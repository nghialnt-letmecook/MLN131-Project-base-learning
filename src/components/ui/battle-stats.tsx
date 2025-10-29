"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const battleStats = [
  {
    number: "57",
    label: "Ngày đêm",
    description: "Thời gian diễn ra chiến dịch",
    icon: "📅"
  },
  {
    number: "16,000",
    label: "Quân Pháp",
    description: "Tổng số quân địch tham gia",
    icon: "⚔️"
  },
  {
    number: "55,000", 
    label: "Quân Việt Minh",
    description: "Lực lượng ta tham gia",
    icon: "🛡️"
  },
  {
    number: "100%",
    label: "Chiến thắng",
    description: "Toàn bộ quân địch đầu hàng",
    icon: "🏆"
  }
];

export default function BattleStats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Counter animation
      document.querySelectorAll(".counter-number").forEach((element, index) => {
        const target = element.textContent;
        const numericValue = parseInt(target?.replace(/[^\d]/g, '') || '0');
        
        if (numericValue > 0) {
          gsap.fromTo(element,
            { textContent: 0 },
            {
              textContent: numericValue,
              duration: 2,
              delay: index * 0.3,
              snap: { textContent: 1 },
              scrollTrigger: {
                trigger: element,
                start: "top 90%"
              },
              onUpdate: function() {
                const currentValue = Math.round(this.targets()[0].textContent);
                if (target?.includes('%')) {
                  element.textContent = `${currentValue}%`;
                } else if (target?.includes(',')) {
                  element.textContent = currentValue.toLocaleString();
                } else {
                  element.textContent = currentValue.toString();
                }
              }
            }
          );
        }
      });

      // Animate stat cards
      gsap.fromTo(".stat-card",
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%"
          }
        }
      );

    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={statsRef} className="py-16 bg-gradient-to-r from-red-600 to-yellow-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-white bg-opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Con Số Ấn Tượng
          </h2>
          <p className="text-xl text-yellow-100 opacity-90">
            Những thống kê đáng nhớ về chiến thắng Điện Biên Phủ
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {battleStats.map((stat, index) => (
            <div 
              key={index}
              className="stat-card text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 counter-number">
                {stat.number}
              </div>
              <div className="text-lg font-bold text-yellow-200 mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}