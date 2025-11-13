"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, Plus, History, Trash2 } from "lucide-react";
import { createChatSession } from "@/services/chat.api";
import { refreshTokenIfNeeded, isAuthenticated } from "@/services/token.api";
import { ChatSession } from "@/types/chat.type";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatboxProps {
  isOpen: boolean;
  onClose: () => void;
}

// Chat states
type ChatState = "welcome" | "connecting" | "ready" | "error";

export default function Chatbox({ isOpen, onClose }: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<ChatState>("welcome");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [showChatModal, setShowChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize chat - authenticate and create session in one go
  const initializeChat = async () => {
    setIsAuthenticating(true);
    setChatState("connecting");
    setShowChatModal(true); // Show modal immediately when starting

    try {
      await refreshTokenIfNeeded();

      // Auto create session after successful authentication
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);

      const chatSession: ChatSession = {
        sessionId: newSessionId,
        chatInput: "",
      };

      await createChatSession(chatSession);

      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        text: "Xin chào! Tôi có thể giúp bạn tìm hiểu về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh. Bạn muốn hỏi gì?",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      setChatState("ready");
    } catch (error: any) {
      setChatState("error");
      setShowChatModal(false); // Hide modal on error
    } finally {
      setIsAuthenticating(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const chatSession: ChatSession = {
      sessionId,
      chatInput: userMessage.text,
    };

    let retryCount = 0;
    const maxRetries = 1;
    let errorText = "";
    while (retryCount <= maxRetries) {
      try {
        await createChatSession(chatSession); // chỉ phát audio, không lấy text
        errorText = "";
        break;
      } catch (error: any) {
        // Nếu lỗi do token expired, thử refresh và retry
        if (
          error?.response?.data?.valid === "false" &&
          typeof error?.response?.data?.reason === "string" &&
          error.response.data.reason.includes("Token expired")
        ) {
          await refreshTokenIfNeeded(true);
          retryCount++;
          continue;
        }
        errorText = "Đã xảy ra lỗi khi gửi câu hỏi. Vui lòng thử lại.";
        break;
      }
    }

    if (errorText) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }
    setIsTyping(false);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setChatState("welcome");
    setMessages([]);
    setSessionId("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Large Chat Modal - Center Screen */}
      {showChatModal ? (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={handleCloseChatModal}
          >
            {/* Modal Container */}
            <div
              className="bg-[#F5F5F5] rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] max-h-[800px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#B22222] to-[#1C1C1C] text-[#F5F5F5] p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#F5F5F5] p-2 rounded-full">
                    <MessageCircle size={24} className="text-[#B22222]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">
                      Trò chuyện với AI Assistant
                    </h2>
                    <p className="text-sm text-[#FFD700] flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#2E4600] rounded-full animate-pulse"></span>
                      Đang hoạt động
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChatModal}
                  className="hover:bg-[#B22222] rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#E5E5E5] to-[#F5F5F5] space-y-4">
                {chatState === "connecting" && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#B22222]"></div>
                    <p className="text-lg text-[#4B2E2E] font-medium">
                      Đang kết nối với server...
                    </p>
                  </div>
                )}

                {chatState === "ready" &&
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isUser ? "justify-end" : "justify-start"
                      } animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl shadow-md ${
                          message.isUser
                            ? "bg-gradient-to-r from-[#B22222] to-[#8B0000] text-[#F5F5F5] rounded-br-md"
                            : "bg-white border-2 border-[#D2B48C] text-[#2E4600] rounded-bl-md"
                        }`}
                      >
                        <p className="text-base leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.isUser ? "text-[#FFD700]" : "text-[#8B7355]"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white border-2 border-[#D2B48C] p-4 rounded-2xl rounded-bl-md shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-[#B22222] rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-[#B22222] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-[#B22222] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="p-6 bg-white border-t-2 border-[#D2B48C]"
              >
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn..."
                    className="flex-1 px-5 py-4 border-2 border-[#D2B48C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#B22222] focus:border-transparent text-base bg-[#F5F5F5]"
                    disabled={isTyping || chatState === "connecting"}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={
                      !inputValue.trim() ||
                      isTyping ||
                      chatState === "connecting"
                    }
                    className="bg-gradient-to-r from-[#B22222] to-[#8B0000] hover:from-[#8B0000] hover:to-[#B22222] disabled:from-[#D2B48C] disabled:to-[#C4A484] text-[#F5F5F5] px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center min-w-[56px] shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-xs text-[#8B7355] mt-3 text-center">
                  Nhấn Enter để gửi tin nhắn
                </p>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-35 md:hidden"
            onClick={onClose}
          />

          {/* Small Chatbox - Welcome Screen */}
          <div
            className="fixed bottom-6 right-52 w-80 h-96 bg-[#F5F5F5] border border-[#D2B48C] rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden
                      max-sm:right-4 max-sm:w-72 max-sm:h-80 max-sm:bottom-4
                      max-md:right-48 max-md:w-76
                      animate-in slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B22222] to-[#1C1C1C] text-[#F5F5F5] p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-2">
                <MessageCircle size={20} />
                <h3 className="font-semibold text-sm">Trò chuyện với AI</h3>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-[#B22222] rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Welcome Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#E5E5E5] to-[#F5F5F5]">
              {chatState === "welcome" && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <MessageCircle size={48} className="text-[#B22222]" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#2E4600]">
                      Chào mừng đến với AI Assistant
                    </h3>
                    <p className="text-sm text-[#4B2E2E] max-w-xs">
                      Tôi có thể giúp bạn tìm hiểu về cuộc đời và sự nghiệp của
                      Chủ tịch Hồ Chí Minh
                    </p>
                  </div>
                  <div className="space-y-2 w-full max-w-xs">
                    <button
                      onClick={initializeChat}
                      disabled={isAuthenticating}
                      className="w-full bg-[#B22222] hover:bg-[#1C1C1C] disabled:bg-[#D2B48C] text-[#F5F5F5] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      {isAuthenticating ? "Đang kết nối..." : "Bắt đầu chat"}
                    </button>
                  </div>
                </div>
              )}

              {chatState === "error" && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-12 h-12 bg-[#B22222]/20 rounded-full flex items-center justify-center">
                    <X size={20} className="text-[#B22222]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#2E4600]">
                      Có lỗi xảy ra
                    </h3>
                    <p className="text-sm text-[#4B2E2E] max-w-xs">
                      Không thể kết nối với server. Vui lòng thử lại
                    </p>
                  </div>
                  <button
                    onClick={() => setChatState("welcome")}
                    className="bg-[#4B2E2E] hover:bg-[#2E4600] text-[#F5F5F5] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
