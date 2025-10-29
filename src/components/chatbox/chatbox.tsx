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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize chat - authenticate and create session in one go
  const initializeChat = async () => {
    setIsAuthenticating(true);
    setChatState("connecting");

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-35 md:hidden"
        onClick={onClose}
      />

      {/* Chatbox */}
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
          <div className="flex items-center space-x-1">
            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              {chatState === "connecting" && (
                <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
              )}
              {chatState === "ready" && (
                <div className="w-2 h-2 bg-[#2E4600] rounded-full"></div>
              )}
              {chatState === "error" && (
                <div className="w-2 h-2 bg-[#B22222] rounded-full"></div>
              )}
            </div>

            <button
              onClick={onClose}
              className="hover:bg-[#B22222] rounded-full p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#E5E5E5] to-[#F5F5F5]">
          {chatState === "welcome" && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <MessageCircle size={48} className="text-[#B22222]" />
              <div className="space-y-2">
                <h3 className="font-semibold text-[#2E4600]">
                  Chào mừng đến với AI Assistant
                </h3>
                <p className="text-sm text-[#4B2E2E] max-w-xs">
                  Tôi có thể giúp bạn tìm hiểu về cuộc đời và sự nghiệp của Chủ
                  tịch Hồ Chí Minh
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

          {chatState === "connecting" && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B22222]"></div>
              <p className="text-sm text-[#4B2E2E]">
                Đang kết nối với server...
              </p>
            </div>
          )}

          {chatState === "error" && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-12 h-12 bg-[#B22222]/20 rounded-full flex items-center justify-center">
                <X size={20} className="text-[#B22222]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-[#2E4600]">Có lỗi xảy ra</h3>
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

          {chatState === "ready" && messages.length > 0 && (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                      message.isUser
                        ? "bg-[#B22222] text-[#F5F5F5] rounded-br-md"
                        : "bg-[#F5F5F5] border border-[#D2B48C] text-[#2E4600] rounded-bl-md shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#F5F5F5] border border-[#D2B48C] p-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#B22222] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#B22222] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#B22222] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {chatState === "ready" && sessionId && (
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#F5F5F5] border-t border-[#D2B48C]"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Hỏi về Bác Hồ..."
                className="flex-1 px-3 py-2 border border-[#D2B48C] rounded-full focus:outline-none focus:ring-2 focus:ring-[#B22222] focus:border-transparent text-sm"
                disabled={isTyping}
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#B22222] hover:bg-[#1C1C1C] disabled:bg-[#D2B48C] text-[#F5F5F5] p-2 rounded-full transition-colors flex items-center justify-center min-w-[36px]"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
