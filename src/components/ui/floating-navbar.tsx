"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Gamepad2,
  Headset,
  ImageIcon,
  Home,
  Menu,
  X,
  Scan,
  QrCode,
  Camera,
} from "lucide-react";

// Timeline data extracted from the page
const timelineItems = [
  {
    year: "Tháng 8 - 9 năm 1945",
    title: "Giành Độc lập và Thành lập Chính quyền",
    slug: "gianh-doc-lap-thanh-lap-chinh-quyen",
  },
  {
    year: "Cuối 1945 – Cuối 1946",
    title: "Củng cố Chính quyền và Đối phó với Thù trong, Giặc ngoài",
    slug: "cung-co-chinh-quyen",
  },
  {
    year: "Cuối 1946 – 1947",
    title: "Kháng chiến Toàn quốc Bùng nổ",
    slug: "khang-chien-bung-no",
  },
  {
    year: "1948 – 1950",
    title: "Xây dựng Lực lượng và Mở đầu Tổng phản công",
    slug: "xay-dung-luc-luong",
  },
  {
    year: "1951 – 1953",
    title: "Củng cố Đường lối và Đẩy mạnh Kháng chiến",
    slug: "cung-co-duong-loi",
  },
  {
    year: "1954",
    title: "Chiến thắng Quyết định và Ký kết Hiệp định",
    slug: "chien-thang",
  },
];

export default function FloatingNavbar() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isARMarkersOpen, setIsARMarkersOpen] = useState(false);
  const pathname = usePathname();

  // Scroll effect
  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", updateScrollY);
    return () => window.removeEventListener("scroll", updateScrollY);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const timelineDropdown = document.querySelector(".timeline-dropdown");
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

  // Scroll to timeline section
  const scrollToTimeline = () => {
    const timelineSection = document.querySelector(".timeline-container");
    if (timelineSection) {
      timelineSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Navigation variants
  const navVariants = {
    hidden: {
      y: -100,
      opacity: 0,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    }),
  };

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

  const glowVariants = {
    hover: {
      boxShadow: [
        "0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(220, 38, 38, 0.1)",
        "0 12px 40px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(220, 38, 38, 0.2)",
        "0 16px 48px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(220, 38, 38, 0.3)",
      ],
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.4,
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      },
    },
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        style={{
          transformPerspective: 1200,
          y: useTransform(() => Math.min(scrollY * 0.1, 10)),
        }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          variants={glowVariants}
          whileHover="hover"
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200/50 px-4 py-2.5 hidden md:flex items-center space-x-3"
        >
          {/* Home */}
          <motion.div custom={0} variants={itemVariants}>
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-red-700 hover:bg-red-50 hover:text-red-800"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Timeline Dropdown */}
          <motion.div
            custom={1}
            variants={itemVariants}
            className="relative timeline-dropdown"
            onMouseEnter={() => setIsTimelineOpen(true)}
            onMouseLeave={() => setIsTimelineOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                if (pathname === "/") {
                  scrollToTimeline();
                }
                // Không toggle dropdown khi click, chỉ scroll
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                pathname.startsWith("/timeline")
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-red-700 hover:bg-red-50 hover:text-red-800"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Timeline</span>
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
                  className="absolute top-full left-0 mt-2 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200/50 py-3 max-h-96 overflow-y-auto"
                  style={{
                    boxShadow:
                      "0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(220, 38, 38, 0.1)",
                  }}
                >
                  {timelineItems.map((item, index) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/timeline/${item.slug}`}>
                        <motion.div
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            x: 8,
                            borderColor: "rgba(220, 38, 38, 0.4)",
                          }}
                          className="px-4 py-3 hover:bg-red-50 transition-all duration-200 border-l-4 border-transparent hover:border-red-400"
                        >
                          <motion.div
                            className="font-medium text-red-800 text-sm"
                            whileHover={{ x: 4 }}
                          >
                            {item.year}
                          </motion.div>
                          <motion.div
                            className="text-gray-700 text-sm mt-1 line-clamp-2"
                            whileHover={{ x: 4 }}
                          >
                            {item.title}
                          </motion.div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Game */}
          <motion.div custom={2} variants={itemVariants}>
            <Link href="/game">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                  pathname.startsWith("/game")
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-red-700 hover:bg-red-50 hover:text-red-800"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="font-medium">Game</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* AR Scan */}
          <motion.div custom={3} variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-red-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              onClick={() => setIsQRModalOpen(true)}
            >
              <QrCode className="w-4 h-4" />
              <span className="font-medium">AR Scan</span>
            </motion.div>
          </motion.div>

          {/* AR Markers */}
          <motion.div custom={4} variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-red-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              onClick={() => setIsARMarkersOpen(true)}
            >
              <Camera className="w-4 h-4" />
              <span className="font-medium text-sm">AR</span>
            </motion.div>
          </motion.div>

          {/* Gallery */}
          <motion.div custom={5} variants={itemVariants}>
            <Link
              href="https://motkhoivietnam-3d.aizy.io.vn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-red-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium">Gallery</span>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.div
          className="md:hidden bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-red-200/50 p-3"
          whileTap={{ scale: 0.95 }}
          variants={glowVariants}
          whileHover="hover"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-red-700"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
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
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors"
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Home className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">
                        Trang chủ
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 text-red-800 font-medium">
                      <Calendar className="w-5 h-5" />
                      <span>Timeline</span>
                    </div>
                    <div className="ml-8 space-y-1 max-h-60 overflow-y-auto">
                      {timelineItems.map((item, index) => (
                        <motion.div
                          key={item.slug}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <Link
                            href={`/timeline/${item.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <motion.div
                              className="p-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                              whileHover={{
                                x: 5,
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="font-medium">{item.year}</div>
                              <div className="text-xs text-gray-600 line-clamp-1">
                                {item.title}
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Mobile Game, AR Scan, AR, Gallery items */}
                {[
                  {
                    icon: Gamepad2,
                    label: "Game",
                    href: "/game",
                    available: true,
                  },
                  {
                    icon: QrCode,
                    label: "AR Scan",
                    href: "#",
                    available: true,
                    isQR: true,
                  },
                  {
                    icon: Camera,
                    label: "AR",
                    href: "#",
                    available: true,
                    isARMarkers: true,
                  },
                  {
                    icon: ImageIcon,
                    label: "Gallery",
                    href: "https://haokhikhangchien-3d.aizy.vn",
                    available: true,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {item.available ? (
                      item.isQR ? (
                        <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          whileHover={{
                            x: 5,
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsQRModalOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <item.icon className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-800">
                            {item.label}
                          </span>
                        </motion.div>
                      ) : item.isARMarkers ? (
                        <motion.div
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          whileHover={{
                            x: 5,
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsARMarkersOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <item.icon className="w-5 h-5 text-red-600" />
                          <span className="font-medium text-red-800">
                            {item.label}
                          </span>
                        </motion.div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          target={
                            item.href.startsWith("http") ||
                            item.href.endsWith(".html")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            item.href.startsWith("http") ||
                            item.href.endsWith(".html")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          <motion.div
                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors"
                            whileHover={{
                              x: 5,
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <item.icon className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-red-800">
                              {item.label}
                            </span>
                          </motion.div>
                        </Link>
                      )
                    ) : (
                      <motion.div
                        className="flex items-center space-x-3 p-3 rounded-xl text-gray-400"
                        whileHover={{ x: 5 }}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        <motion.span
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Sắp ra mắt
                        </motion.span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isQRModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsQRModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <QrCode className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      AR Experience
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quét mã QR để trải nghiệm AR
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQRModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* QR Code and Instructions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Bước 1: Quét QR Code
                  </h4>
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-inner">
                    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                          window.location.origin + "/ar-scan.html"
                        )}`}
                        alt="QR Code for AR Experience"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Sử dụng camera điện thoại để quét mã QR
                  </p>
                </div>

                {/* AR Marker Section */}
                <div className="flex flex-col items-center space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Bước 2: Quét hình này
                  </h4>
                  <div className="bg-white p-4 rounded-xl border-2 border-red-200 shadow-inner">
                    <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/vr-image.jpg"
                        alt="AR Marker - Điện Biên Phủ"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Sau khi mở AR, hướng camera vào hình này
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-semibold text-red-800 mb-2">
                    📱 Hướng dẫn sử dụng:
                  </h5>
                  <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
                    <li>Quét mã QR bằng camera điện thoại</li>
                    <li>Chờ trang AR scan tải xong</li>
                    <li>Cho phép truy cập camera khi được hỏi</li>
                    <li>Hướng camera về phía hình Điện Biên Phủ bên trên</li>
                    <li>Thưởng thức trải nghiệm thực tế ảo tăng cường!</li>
                  </ol>
                </div>
              </div>

              <div className="text-center space-y-2 mt-4">
                <p className="text-gray-700 font-medium">
                  Trải nghiệm lịch sử Điện Biên Phủ với công nghệ AR
                </p>
                <p className="text-sm text-gray-500">
                  Hình ảnh sẽ hiện ra khi bạn hướng camera vào marker
                </p>
              </div>

              {/* Alternative link */}
              <div className="pt-4 border-t border-gray-200 w-full">
                <Link
                  href="/ar-scan.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  onClick={() => setIsQRModalOpen(false)}
                >
                  <Scan className="w-4 h-4" />
                  <span>Hoặc mở trực tiếp</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AR Markers Modal */}
      <AnimatePresence>
        {isARMarkersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsARMarkersOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-lg md:max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Camera className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      AR Markers
                    </h3>
                    <p className="text-sm text-gray-600">Hình ảnh để scan AR</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsARMarkersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* AR Markers Grid */}
              <div className="space-y-6">
                {/* Marker 1 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Marker 1: Chiến thắng Điện Biên Phủ
                  </h4>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-red-200 shadow-inner">
                      <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src="/images/vr-image.jpg"
                          alt="AR Marker - Điện Biên Phủ"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Quét hình này để xem video AR về chiến thắng Điện Biên Phủ
                    </p>
                  </div>
                </div>

                {/* Placeholder for more markers */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500 font-medium">Marker 2</p>
                    <p className="text-sm text-gray-400">Sắp cập nhật...</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-gray-500 font-medium">Marker 3</p>
                    <p className="text-sm text-gray-400">Sắp cập nhật...</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">
                  📱 Cách sử dụng:
                </h5>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Mở AR từ navbar (AR Scan → Quét QR)</li>
                  <li>Cho phép truy cập camera</li>
                  <li>Hướng camera về phía marker bạn muốn</li>
                  <li>Thưởng thức nội dung AR!</li>
                </ol>
              </div>

              {/* Quick AR Access */}
              <div className="pt-4 border-t border-gray-200 w-full mt-6">
                <button
                  onClick={() => {
                    setIsARMarkersOpen(false);
                    setIsQRModalOpen(true);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Mở AR Scanner</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
