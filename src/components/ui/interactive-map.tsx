"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MapPoint {
  id: string;
  name: string;
  x: number; // Phần trăm từ trái
  y: number; // Phần trăm từ trên
  description: string;
  details: string;
  image?: string;
  video?: string;
}

// Các cứ điểm chiến lược tại Điện Biên Phủ
const mapPoints: MapPoint[] = [
  {
    id: "him-lam",
    name: "Cứ điểm Him Lam",
    x: 25,
    y: 40,
    description: "Cứ điểm chiến lược quan trọng phía tây",
    details:
      "Cứ điểm Him Lam là một trong những vị trí then chốt trong hệ thống phòng thủ của quân Pháp. Được bố trí trên một đồi cao, Him Lam kiểm soát tuyến đường tiếp tế quan trọng. Việc chiếm được cứ điểm này đã tạo ra bước ngoặt quan trọng trong chiến dịch, giúp quân Việt Minh cắt đứt liên lạc giữa các cứ điểm của địch.",
    image: "/image/him-lam.jpg",
    video: "/video/him-lam.mp4",
  },
  {
    id: "doc-lap",
    name: "Cứ điểm Độc Lập",
    x: 50,
    y: 35,
    description: "Trung tâm chỉ huy của quân Pháp",
    details:
      "Độc Lập là trung tâm chỉ huy chính của Tướng de Castries và Bộ tư lệnh quân Pháp tại Điện Biên Phủ. Đây là mục tiêu cuối cùng và quan trọng nhất trong chiến dịch. Cứ điểm này được bảo vệ bởi hệ thống công sự kiên cố và là nơi diễn ra những trận đánh quyết liệt cuối cùng của chiến dịch.",
    image: "/image/doc-lap.jpg",
    video: "/video/doc-lap.mp4",
  },
  {
    id: "a1",
    name: "Cứ điểm A1 (Eliane)",
    x: 65,
    y: 25,
    description: "Đồi chiến lược phía đông bắc",
    details:
      "Cứ điểm A1 (tên mã Eliane của Pháp) nằm trên một đồi cao, kiểm soát toàn bộ thung lũng Điện Biên Phủ. Đây là một trong những cứ điểm được tấn công đầu tiên và quyết liệt nhất. Việc chiếm được A1 đã cho phép quân Việt Minh có được vị trí quan sát tuyệt vời và khả năng pháo kích hiệu quả vào các vị trí của địch.",
    image: "/image/a1.jpg",
    video: "/video/a1.mp4",
  },
  {
    id: "d1",
    name: "Cứ điểm D1 (Dominique)",
    x: 35,
    y: 60,
    description: "Cứ điểm phía nam thung lũng",
    details:
      "D1 (Dominique) là một trong những cứ điểm được tấn công đầu tiên trong chiến dịch, mở màn cho cuộc tổng tấn công lịch sử. Vị trí này có tầm quan trọng chiến lược cao trong việc kiểm soát phần phía nam của thung lũng và các tuyến đường tiếp tế của quân Pháp.",
    image: "/image/d1.jpg",
    video: "/video/d1.mp4",
  },
];

export default function InteractiveMap() {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "video">("info");
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Animate map points on load
      gsap.fromTo(
        ".map-point",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 80%",
          },
        }
      );

      // Pulse animation for map points
      gsap.to(".map-point", {
        scale: 1.2,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });

      // Animate section title
      gsap.fromTo(
        ".map-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 85%",
          },
        }
      );
    }, mapRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isModalOpen]);

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
    setActiveTab("info");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsModalOpen(false);
          setSelectedPoint(null);
        },
      });
    }
  };

  return (
    <section
      ref={mapRef}
      className="py-24 px-4 bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 relative"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-300 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full translate-x-40 translate-y-40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 map-title">
          <h2 className="text-5xl md:text-6xl font-bold text-red-800 mb-6 font-serif">
            Bản Đồ Điện Biên Phủ 1954
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Khám phá các cứ điểm chiến lược trong trận chiến lịch sử. Nhấp vào
            từng điểm đỏ trên bản đồ để tìm hiểu chi tiết về các cứ điểm quan
            trọng.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl border-4 border-yellow-400">
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 rounded-xl overflow-hidden border-2 border-red-200">
            {/* Map Background - Placeholder for actual Điện Biên Phủ map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-8xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold mb-2">
                  Bản đồ Điện Biên Phủ
                </h3>
                <p className="text-lg">
                  Thung lũng Điện Biên - Nơi diễn ra trận chiến lịch sử
                </p>
              </div>
            </div>

            {/* Terrain Features - Simplified representation */}
            <div className="absolute inset-0">
              {/* Mountains around the valley */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-500 to-transparent opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-400 to-transparent opacity-25"></div>
              <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-500 to-transparent opacity-25"></div>
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-500 to-transparent opacity-30"></div>

              {/* River */}
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-2 bg-blue-400 opacity-60 rounded-full transform rotate-12"></div>
            </div>

            {/* Map Points */}
            {mapPoints.map((point) => (
              <button
                key={point.id}
                className="map-point absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => handlePointClick(point)}
              >
                {/* Point Marker */}
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 border-4 border-yellow-400 rounded-full shadow-lg group-hover:scale-125 transition-all duration-300 relative z-10 flex items-center justify-center animate-map-pulse">
                    <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                  </div>

                  {/* Ripple Effect */}
                  <div className="absolute inset-0 w-8 h-8 bg-red-400 rounded-full animate-ping opacity-60"></div>

                  {/* Label */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-800 text-yellow-100 text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border-2 border-yellow-400 max-w-48 text-center">
                    <div className="font-bold">{point.name}</div>
                    <div className="text-xs mt-1 text-yellow-200">
                      {point.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border-2 border-red-200 shadow-lg">
              <h4 className="font-bold text-red-800 mb-3 text-lg">Chú thích</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 border-2 border-yellow-400 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">
                    Cứ điểm chiến lược
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-1 bg-blue-400 rounded flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">Sông Nậm Rốm</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-400 opacity-30 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">
                    Dãy núi bao quanh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {mapPoints.map((point) => (
              <button
                key={`quick-${point.id}`}
                onClick={() => handlePointClick(point)}
                className="p-4 bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-lg group text-left"
              >
                <h4 className="font-bold text-red-800 group-hover:text-red-600 transition-colors mb-2">
                  {point.name}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {point.description}
                </p>
                <div className="mt-2 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Nhấp để xem chi tiết →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPoint && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors z-10 flex items-center justify-center text-2xl font-bold shadow-lg"
              >
                ×
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-6 rounded-t-2xl">
                <h3 className="text-3xl font-bold mb-2">
                  {selectedPoint.name}
                </h3>
                <p className="text-lg opacity-90">
                  {selectedPoint.description}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === "info"
                      ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  📜 Thông tin chi tiết
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === "video"
                      ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  🎬 Video tư liệu
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === "info" && (
                  <div>
                    {/* Image Placeholder */}
                    <div className="mb-6 h-64 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center border-2 border-red-200">
                      <div className="text-center text-red-800">
                        <div className="text-6xl mb-2">📷</div>
                        <p className="text-lg font-bold">Hình ảnh lịch sử</p>
                        <p className="text-sm opacity-75">
                          {selectedPoint.name}
                        </p>
                      </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {selectedPoint.details}
                      </p>
                    </div>

                    {/* Historical Facts */}
                    <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                      <h4 className="font-bold text-yellow-800 mb-2">
                        💡 Thông tin thêm
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        Cứ điểm này đóng vai trò quan trọng trong chiến lược
                        tổng thể của chiến dịch Điện Biên Phủ, góp phần vào
                        thành công chung của cuộc chiến đấu lịch sử này.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "video" && (
                  <div>
                    {/* Video Placeholder */}
                    <div className="mb-6 aspect-video bg-gradient-to-br from-red-800 to-yellow-600 rounded-lg flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-8xl mb-4">🎬</div>
                        <h4 className="text-2xl font-bold mb-2">
                          Video Tư Liệu
                        </h4>
                        <p className="text-lg opacity-90 mb-4">
                          {selectedPoint.name}
                        </p>
                        <button className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                          ▶️ Phát video
                        </button>
                      </div>
                    </div>

                    {/* Video Description */}
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-red-800">
                        Mô tả video
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Tài liệu video quý hiếm về {selectedPoint.name} trong
                        chiến dịch Điện Biên Phủ. Video bao gồm những hình ảnh
                        lịch sử, lời kể của nhân chứng và phân tích chiến thuật
                        về tầm quan trọng của cứ điểm này trong tổng thể chiến
                        dịch.
                      </p>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <h5 className="font-bold text-red-800 mb-2">
                          📋 Nội dung chính:
                        </h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Vị trí và tầm quan trọng chiến lược</li>
                          <li>• Quá trình tác chiến tại cứ điểm</li>
                          <li>• Lời kể của các chiến sĩ tham gia</li>
                          <li>• Ảnh hưởng đến kết quả chung của chiến dịch</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
