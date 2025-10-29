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
        }
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
          <blockquote className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            <span className="text-gradient-red-yellow">
              “Chúng ta thà hy sinh tất cả,
            </span>
            <br />
            <span className="text-yellow-200">
              chứ nhất định không chịu mất nước,
            </span>
            <br />
            <span className="text-white">không chịu làm nô lệ.”</span>
          </blockquote>

          <cite className="text-2xl md:text-3xl text-yellow-300 font-medium mb-12 block">
            — Chủ tịch Hồ Chí Minh —
          </cite>

          {/* Victory Date */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-400 mb-8">
            <div className="text-6xl md:text-8xl font-black text-yellow-400 mb-4 animate-victory-glow">
              1945 – 1954
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              9 NĂM TRƯỜNG KỲ KHÁNG CHIẾN
            </div>
            <div className="text-lg md:text-xl text-yellow-200 space-y-2">
              <p>
                “Toàn dân, toàn Đảng, toàn quân ta quyết đem tất cả tinh thần và
                lực lượng,
              </p>
              <p>tính mạng và của cải để giữ vững quyền tự do, độc lập ấy.”</p>
              <p className="mt-1">
                - Hồ Chí Minh, Lời kêu gọi Toàn quốc kháng chiến (19/12/1946) -
              </p>
            </div>
          </div>

          {/* Final Quote */}
          <div className="text-xl md:text-2xl text-red-100 italic">
            Dưới sự lãnh đạo của Đảng, nhân dân Việt Nam đã kiên cường đứng lên
            bảo vệ độc lập,
            <br />
            giữ vững chính quyền cách mạng và làm nên thắng lợi của cuộc kháng
            chiến trường kỳ.
          </div>
        </div>
      </div>
    </section>
  );
}
