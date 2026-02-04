"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Gamepad2,
  Home,
  Menu,
  X,
} from "lucide-react";

// Timeline data for Dân tộc và Tôn giáo
const timelineData = [
  {
    year: "Phần I",
    title: "Khái niệm và Đặc trưng Dân tộc",
    slug: "khai-niem-dac-trung-dan-toc",
  },
  {
    year: "Phần II",
    title: "Hai Xu hướng Phát triển và Cương lĩnh Lênin",
    slug: "xu-huong-phat-trien",
  },
  {
    year: "Phần III",
    title: "Đặc điểm và Chính sách Dân tộc ở Việt Nam",
    slug: "dac-diem-chinh-sach-dan-toc",
  },
  {
    year: "Phần IV",
    title: "Bản chất, Nguồn gốc và Tính chất của Tôn giáo",
    slug: "ban-chat-nguon-goc",
  },
  {
    year: "Phần V",
    title: "Đặc điểm và Chính sách Tôn giáo ở Việt Nam",
    slug: "dac-diem-chinh-sach-ton-giao",
  },
  {
    year: "Phần VI",
    title: "Đặc điểm Quan hệ Dân tộc – Tôn giáo",
    slug: "dac-diem-quan-he",
  },
  {
    year: "Phần VII",
    title: "Những Thách thức Hiện nay",
    slug: "nhung-thach-thuc-hien-nay",
  },
  {
    year: "Phần VIII",
    title: "Định hướng và Giải pháp",
    slug: "dinh-huong-giai-phap",
  },
];

interface TimelineNavbarProps {
  // Audio player props
  isPlaying: boolean;
  audioProgress: number;
  audioDuration: number;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  showVolumeSlider: boolean;
  onToggleAudio: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onProgressClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSetShowVolumeSlider: (show: boolean) => void;
  formatTime: (time: number) => string;
  currentSlug: string;
}

export default function TimelineNavbar(props: TimelineNavbarProps) {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const {
    isPlaying,
    audioProgress,
    audioDuration,
    isMuted,
    volume,
    playbackRate,
    showVolumeSlider,
    onToggleAudio,
    onToggleMute,
    onVolumeChange,
    onPlaybackRateChange,
    onProgressClick,
    onSetShowVolumeSlider,
    formatTime,
    currentSlug,
  } = props;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const timelineDropdown = document.querySelector(
        ".timeline-navbar-dropdown",
      );
      if (
        isTimelineOpen &&
        timelineDropdown &&
        !timelineDropdown.contains(event.target as Node)
      ) {
        setIsTimelineOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isTimelineOpen]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:block bg-white/90 backdrop-blur-sm border-b border-red-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-6">
            {/* Back to Timeline */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 text-red-700 hover:text-red-800 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Timeline</span>
              </motion.div>
            </Link>

            {/* Timeline Dropdown */}
            <div
              className="relative timeline-navbar-dropdown"
              onMouseEnter={() => setIsTimelineOpen(true)}
              onMouseLeave={() => setIsTimelineOpen(false)}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Scroll to timeline section on main page
                  if (window.location.pathname === "/") {
                    const timelineSection = document.getElementById("timeline");
                    if (timelineSection) {
                      timelineSection.scrollIntoView({ behavior: "smooth" });
                    }
                  } else {
                    // Navigate to main page with timeline scroll
                    window.location.href = "/#timeline";
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Nội dung khác</span>
                <motion.div
                  animate={{ rotate: isTimelineOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {isTimelineOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-red-200/50 py-2 max-h-80 overflow-y-auto"
                  >
                    {timelineData.map((item, index) => (
                      <motion.div
                        key={item.slug}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link href={`/timeline/${item.slug}`}>
                          <motion.div
                            whileHover={{
                              scale: 1.01,
                              backgroundColor: "rgba(220, 38, 38, 0.1)",
                              x: 4,
                            }}
                            className={`px-3 py-2 hover:bg-red-50 transition-all duration-200 border-l-4 ${
                              item.slug === currentSlug
                                ? "border-red-500 bg-red-50/50"
                                : "border-transparent"
                            }`}
                          >
                            <div className="font-medium text-red-800 text-xs">
                              {item.year}
                            </div>
                            <div className="text-gray-700 text-xs mt-0.5 line-clamp-2">
                              {item.title}
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Game Link */}
            <Link href="/game">
              <motion.div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="text-sm font-medium">Game</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-white/90 backdrop-blur-sm border-b border-red-200 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Back button */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-2 text-red-700"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Timeline</span>
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-red-700"
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-red-800 mb-3">
                  Giai đoạn khác
                </h3>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {timelineData.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/timeline/${item.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={`p-3 text-sm hover:bg-red-50 rounded-lg transition-colors ${
                          item.slug === currentSlug
                            ? "bg-red-50 border-l-4 border-red-500"
                            : ""
                        }`}
                      >
                        <div className="font-medium text-red-800">
                          {item.year}
                        </div>
                        <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {item.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-red-200">
                  <Link href="/game" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors">
                      <Gamepad2 className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Game</span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
