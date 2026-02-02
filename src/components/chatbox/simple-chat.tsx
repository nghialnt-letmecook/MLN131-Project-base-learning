"use client";

import { useState, useRef } from "react";
import { Send, X, MessageCircle, Volume2, Mic } from "lucide-react";
import { createChatSession } from "@/services/chat.api";
import { ChatSession } from "@/types/chat.type";

interface SimpleChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

export default function SimpleChat({ isOpen, onClose }: SimpleChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false); // Đang chờ AI xử lý
  const [isPlayingAudio, setIsPlayingAudio] = useState(false); // AI đang đọc câu trả lời
  const [sessionId, setSessionId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference để control audio
  const abortControllerRef = useRef<AbortController | null>(null); // Để cancel request

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to stop current audio and reset states
  const stopCurrentAudio = () => {
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Cancel ongoing request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset all playing states
    setIsWaitingResponse(false);
    setIsPlayingAudio(false);
    setIsTyping(false);
  };

  const initializeChat = () => {
    stopCurrentAudio();
    setMessages([]);
    setShowChatModal(true);
    setSessionId(generateSessionId());
    setIsInitialized(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if input is empty
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) {
      console.warn("⚠️ Empty input - not sending to BE");
      return;
    }

    // Validation: Check if sessionId exists
    if (!sessionId) {
      console.error("❌ No session ID - cannot send message");
      alert("Phiên làm việc không hợp lệ. Vui lòng khởi động lại chat.");
      return;
    }

    // IMPORTANT: Stop current audio/response if user sends new message
    if (isTyping || isPlayingAudio || isWaitingResponse) {
      console.log("🛑 Stopping current audio to process new message");
      stopCurrentAudio();
    }

    // Add user message to display
    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsWaitingResponse(true); // Bắt đầu chờ AI

    setTimeout(scrollToBottom, 100);

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    // Prepare chat session with sessionId from API
    const chatSession: ChatSession = {
      sessionId: sessionId, // Use sessionId from start API
      chatInput: trimmedInput, // Ensure chatInput is not null/empty
    };

    try {
      console.log("📤 Sending message with sessionId:", sessionId);

      // Call API và nhận audio object
      const audio = await createChatSession(chatSession);

      if (!audio || !abortControllerRef.current) {
        throw new Error("No audio returned");
      }

      // Lưu audio ref để có thể stop sau này
      audioRef.current = audio as HTMLAudioElement;

      // Lắng nghe sự kiện khi audio bắt đầu phát
      audio.addEventListener("play", () => {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsWaitingResponse(false);
          setIsPlayingAudio(true);
          console.log("🔊 Audio started playing");
        }
      });

      // Lắng nghe sự kiện khi audio kết thúc
      audio.addEventListener("ended", () => {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsPlayingAudio(false);
          setIsTyping(false);
          audioRef.current = null;
          console.log("✅ Audio finished playing");
        }
      });

      // Lắng nghe sự kiện lỗi
      audio.addEventListener("error", (e: any) => {
        console.error("❌ Audio error:", e);
        setIsWaitingResponse(false);
        setIsPlayingAudio(false);
        setIsTyping(false);
      });

      console.log("✅ Message sent successfully");
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("⚠️ Request was cancelled");
        return;
      }
      console.error("❌ Chat error:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại!");
      setIsWaitingResponse(false);
      setIsPlayingAudio(false);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleCloseChatModal = () => {
    // Stop any playing audio when closing modal
    stopCurrentAudio();

    setShowChatModal(false);
    setIsInitialized(false);
    setSessionId("");
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Large Chat Modal - Center Screen */}
      {showChatModal ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={handleCloseChatModal}
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] max-h-[700px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white p-6 flex items-center justify-between relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
              </div>

              <div className="flex items-center space-x-4 relative z-10">
                <div className="bg-white p-3 rounded-2xl shadow-lg">
                  <Volume2 size={28} className="text-[#B22222]" />
                </div>
                <div>
                  <h2 className="font-bold text-2xl">
                    Trò chuyện bằng giọng nói
                  </h2>
                  <p className="text-sm text-yellow-200 flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                    Sẵn sàng nghe bạn
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseChatModal}
                className="hover:bg-white/20 rounded-full p-2 transition-colors relative z-10"
              >
                <X size={28} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isInitialized && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
                  <div className="bg-gradient-to-br from-red-100 to-yellow-100 p-8 rounded-3xl shadow-xl">
                    <Volume2
                      size={64}
                      className="text-[#B22222] mx-auto mb-4"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Chào mừng bạn đến với AI Voice Assistant
                    </h3>
                    <p className="text-base text-gray-600 max-w-md leading-relaxed">
                      Hãy nhập câu hỏi của bạn và AI sẽ trả lời bằng giọng nói.
                      Bạn có thể hỏi về cuộc kháng chiến chống thực dân Pháp từ
                      năm 1945 đến 1954.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-md">
                    <Mic size={16} className="text-[#B22222]" />
                    <span>Câu trả lời sẽ được phát bằng giọng nói</span>
                  </div>
                </div>
              )}

              {/* Display user messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex justify-end animate-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="max-w-[80%] bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                    <p className="text-base leading-relaxed mb-2">
                      {message.text}
                    </p>
                    <p className="text-xs text-yellow-200">
                      {message.timestamp.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* AI Response Box - Shows both thinking and playing states */}
              {(isWaitingResponse || isPlayingAudio) && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-red-200 p-6 rounded-2xl rounded-bl-md shadow-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Volume2
                        className="text-[#B22222] animate-pulse"
                        size={24}
                      />
                      <span className="text-gray-700 font-medium">
                        {isWaitingResponse
                          ? "AI đang suy nghĩ..."
                          : "Đang phát câu trả lời..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-[#B22222] to-[#FF6B6B] rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 30}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.8s",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {isInitialized && (
              <form
                onSubmit={handleSubmit}
                className="p-6 bg-white border-t-2 border-red-200"
              >
                <div className="flex space-x-3 mb-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        isTyping
                          ? "Vui lòng chờ AI trả lời..."
                          : "Nhập câu hỏi của bạn..."
                      }
                      className={`w-full px-5 py-4 border-2 rounded-full focus:outline-none focus:ring-2 text-base transition-all duration-300 ${isTyping
                        ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed placeholder:text-gray-400"
                        : "border-red-200 bg-gray-50 text-gray-900 focus:ring-[#B22222] focus:border-transparent placeholder:text-gray-400"
                        }`}
                      disabled={isTyping}
                      autoFocus
                    />
                    {isTyping && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-[#B22222] to-[#8B0000] hover:from-[#8B0000] hover:to-[#B22222] disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center min-w-14 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Volume2 size={14} className="text-[#B22222]" />
                  <span>
                    {isTyping
                      ? "Đang phát câu trả lời bằng giọng nói..."
                      : "Câu trả lời sẽ được phát bằng giọng nói • Nhấn Enter để gửi"}
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="fixed bottom-60 right-6 w-52 bg-white/20 backdrop-blur-sm border border-red-200/30 rounded-2xl shadow-2xl z-20 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-red-600">Trò chuyện với AI</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={initializeChat}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Bắt đầu chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
