"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { createChatSession } from "@/services/chat.api";
import { refreshTokenIfNeeded } from "@/services/token.api";
import { ChatSession } from "@/types/chat.type";

interface SimpleChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleChat({ isOpen, onClose }: SimpleChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialize chat session
  const initializeChat = async () => {
    setIsInitializing(true);

    try {
      console.log("🔑 Authenticating user...");
      await refreshTokenIfNeeded();

      // Create session
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);

      const chatSession: ChatSession = {
        sessionId: newSessionId,
        chatInput: "",
      };

      await createChatSession(chatSession);
      setIsInitialized(true);
      console.log("✅ Chat initialized successfully");
    } catch (error: any) {
      console.error("❌ Chat initialization failed:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || isTyping) return;

    setIsTyping(true);

    const chatSession: ChatSession = {
      sessionId,
      chatInput: inputValue.trim(),
    };

    try {
      await createChatSession(chatSession); // Chỉ phát audio, không hiển thị text
      setInputValue("");
    } catch (error: any) {
      console.error("❌ Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
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

      {!isInitialized ? (
        <div className="text-center">
          <button
            onClick={initializeChat}
            disabled={isInitializing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {isInitializing ? "Đang kết nối..." : "Bắt đầu chat"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về Bác Hồ..."
              className="flex-1 min-w-0 px-3 py-2 border border-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              disabled={isTyping}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="flex-shrink-0 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white p-2 rounded-full transition-colors flex items-center justify-center w-9 h-9"
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
