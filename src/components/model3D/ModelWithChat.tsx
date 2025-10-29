"use client";

import { useState } from "react";
import SimpleChat from "@/components/chatbox/simple-chat";

interface ModelWithChatProps {
  className?: string;
  modelClassName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showTooltip?: boolean;
  tooltipText?: string;
}

export default function ModelWithChat({
  className = "fixed bottom-6 right-6 w-44 h-44 z-10 opacity-0 sticky-model",
  modelClassName = "rounded-2xl",
  position = "bottom-right",
  showTooltip = true,
  tooltipText = "Trò chuyện với AI ",
}: ModelWithChatProps) {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  const handleModelClick = () => {
    setIsWaving(true);
    setIsChatboxOpen(true);
    // Sau 2 giây thì dừng vẫy tay
    setTimeout(() => {
      setIsWaving(false);
    }, 2000);
  };

  const handleChatboxClose = () => {
    setIsChatboxOpen(false);
  };

  const getPositionClass = () => {
    switch (position) {
      case "bottom-left":
        return "fixed bottom-24 left-6";
      case "top-right":
        return "fixed top-6 right-6";
      case "top-left":
        return "fixed top-6 left-6";
      case "bottom-right":
      default:
        return "fixed -bottom-2 right-6";
    }
  };

  return (
    <>
      {/* Video Animation Container */}
      <div className={`${getPositionClass()} w-20 h-52 z-10 ${className}`}>
        <div className="relative group h-full w-full">
          <video
            className={`${modelClassName} block`}
            src={isWaving ? "/video/vaytay.mp4" : "/video/idle.mp4"}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "1rem",
              cursor: "pointer",
              margin: 0,
              padding: 0,
              display: "block",
            }}
            onClick={handleModelClick}
          />

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute top-4 -left-36 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-40">
              {tooltipText}
            </div>
          )}
        </div>
      </div>

      {/* Simple Chat */}
      <SimpleChat isOpen={isChatboxOpen} onClose={handleChatboxClose} />

      {/* Animation Styles */}
      <style jsx>{`
        .sticky-model {
          animation: fadeInUp 0.8s ease-out 1s forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
