"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroFooter() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Flag animation
      gsap.to(".vietnam-flag", {
        rotationY: 5,
        rotationX: 2,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Text reveal animation
      gsap.fromTo(
        ".footer-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={footerRef}
      className="py-24 px-4 bg-gradient-to-br from-red-900 via-red-800 to-yellow-600 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="footer-content">
          {/* Vietnamese Flag */}
          <div className="vietnam-flag mb-8 mx-auto w-32 h-20 bg-red-600 rounded-lg shadow-2xl border-4 border-yellow-400 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700"></div>
            <div className="relative z-10">
              <svg
                className="w-12 h-12 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>

          {/* Main Quote */}
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-8 leading-relaxed text-pretty">
            <span className="text-yellow-200 block mb-4">
              "Việt Nam là đất nước đa dân tộc, đa tôn giáo, với 54 dân tộc anh
              em, nhiều tôn giáo cùng sinh hoạt tại các cộng đồng... Hiến pháp,
              pháp luật Việt Nam quy định tất cả mọi người dân đều có quyền theo
              hoặc không theo tôn giáo. Ở Việt Nam không có xung đột tôn giáo,
              xung đột dân tộc, tất cả chung sống hòa thuận..."
            </span>
            <span className="text-gradient-red-yellow italic block"></span>
          </blockquote>

          <cite className="text-xl md:text-2xl text-yellow-300 font-medium mb-12 block">
            — Thủ tướng trân trọng chuyển lời chúc mừng của Tổng Bí thư Nguyễn
            Phú Trọng đến đồng bào Phật giáo cả nước nhân Đại lễ Phật đản —
          </cite>

          {/* Unity Theme */}
          {/* <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-400 mb-8">
            <div className="text-4xl md:text-6xl font-black text-yellow-400 mb-4 animate-victory-glow">
              54 DÂN TỘC
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              MỘT ĐẤT NƯỚC VIỆT NAM THỐNG NHẤT
            </div>
            <div className="text-lg md:text-xl text-yellow-200 space-y-2">
              <p>"Đại đoàn kết dân tộc là truyền thống quý báu,</p>
              <p>
                là sức mạnh to lớn của dân tộc ta trong sự nghiệp đấu tranh giải
                phóng dân tộc,"
              </p>
              <p>và xây dựng, bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa."</p>
            </div>
          </div> */}

          {/* Final Quote */}
          {/* <div className="text-xl md:text-2xl text-red-100 italic">
            Khối đại đoàn kết toàn dân tộc là nguồn sức mạnh vô tận,
            <br />
            là nền tảng vững chắc để xây dựng đất nước Việt Nam phồn vinh, hạnh
            phúc.
          </div> */}
        </div>
      </div>
    </section>
  );
}
