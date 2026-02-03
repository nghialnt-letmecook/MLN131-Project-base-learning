"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ModelWithChat from "@/components/model3D/ModelWithChat";
import InteractiveMap from "@/components/ui/interactive-map";
import BattleStats from "@/components/ui/battle-stats";
import HeroFooter from "@/components/ui/hero-footer";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineData = [
  {
    year: "Phần I",
    title: "Khái niệm và Đặc trưng Dân tộc",
    slug: "khai-niem-dac-trung-dan-toc",
    description:
      "Quá trình hình thành dân tộc, hai nghĩa của khái niệm dân tộc và năm đặc trưng cơ bản về lãnh thổ, kinh tế, ngôn ngữ, văn hóa và nhà nước.",
  },
  {
    year: "Phần II",
    title: "Hai Xu hướng Phát triển và Cương lĩnh Lênin",
    slug: "xu-huong-phat-trien",
    description:
      "Phân tích hai xu hướng phát triển dân tộc trong thời đại mới và nội dung cương lĩnh dân tộc của V.I. Lênin về bình đẳng, tự quyết và liên hiệp.",
  },
  {
    year: "Phần III",
    title: "Đặc điểm và Chính sách Dân tộc ở Việt Nam",
    slug: "dac-diem-chinh-sach-dan-toc",
    description:
      "Làm rõ đặc điểm của 54 dân tộc Việt Nam và các chính sách của Đảng, Nhà nước nhằm bảo đảm bình đẳng, đoàn kết và phát triển bền vững.",
  },
  {
    year: "Phần IV",
    title: "Bản chất, Nguồn gốc và Tính chất của Tôn giáo",
    slug: "ban-chat-nguon-goc",
    description:
      "Giải thích bản chất của tôn giáo, các nguồn gốc hình thành và những tính chất cơ bản trong đời sống xã hội.",
  },
  {
    year: "Phần V",
    title: "Đặc điểm và Chính sách Tôn giáo ở Việt Nam",
    slug: "dac-diem-chinh-sach-ton-giao",
    description:
      "Trình bày thực trạng tôn giáo ở Việt Nam và chính sách của Nhà nước trong việc bảo đảm quyền tự do tín ngưỡng, tôn giáo.",
  },
  {
    year: "Phần VI",
    title: "Đặc điểm Quan hệ Dân tộc – Tôn giáo",
    slug: "dac-diem-quan-he",
    description:
      "Phân tích mối quan hệ gắn bó giữa dân tộc và tôn giáo, vai trò của tín ngưỡng truyền thống và tinh thần chung sống hòa bình.",
  },
  {
    year: "Phần VII",
    title: "Những Thách thức Hiện nay",
    slug: "nhung-thach-thuc-hien-nay",
    description:
      "Nhận diện các hiện tượng tiêu cực như đạo lạ, lợi dụng tôn giáo và âm mưu chia rẽ khối đại đoàn kết dân tộc.",
  },
  {
    year: "Phần VIII",
    title: "Định hướng và Giải pháp",
    slug: "dinh-huong-giai-phap",
    description:
      "Đề xuất các giải pháp nhằm củng cố đoàn kết, phát triển kinh tế – xã hội và bảo vệ ổn định chính trị, xã hội.",
  },
];

export default function DienBienPhuPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Scroll về đầu trang và ẩn thanh scroll
    window.scrollTo(0, 0);
    document.documentElement.style.scrollbarWidth = "none";
    const style = document.createElement("style");
    style.setAttribute("data-hide-scrollbar", "true");
    style.textContent = `
      html::-webkit-scrollbar { width: 0 !important; display: none !important; }
      html { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      body::-webkit-scrollbar { width: 0 !important; display: none !important; }
    `;
    document.head.appendChild(style);

    // Chặn scroll trong quá trình load
    // document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Tạo timeline master cho hero section
      const heroTl = gsap.timeline({
        onComplete: () => {
          // Cho phép scroll lại sau khi animation hoàn thành
          // document.body.style.overflow = "auto";
          // Đánh dấu animation đã hoàn thành
          setAnimationComplete(true);
        },
      });

      // 1. Fade in background image
      heroTl
        .fromTo(
          ".hero-bg",
          { opacity: 0, scale: 1.1 },
          {
            opacity: 0.9,
            scale: 1,
            duration: 2.5,
            ease: "power3.out",
          },
        )

        // 2. Hiệu ứng cho hero content container
        .fromTo(
          ".hero-content",
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 3,
            ease: "power4.out",
          },
          "-=2.0",
        )

        // 3. Hiệu ứng cho title với delay 2 giây
        .fromTo(
          ".hero-title",
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=1",
        )

        // 5. Hiệu ứng floating particles
        .fromTo(
          ".floating-particle",
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=1.5",
        )

        // 6. Quote với hiệu ứng elegant
        .fromTo(
          ".hero-quote",
          {
            opacity: 0,
            y: 30,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=2",
        );

      // 7. Thêm hiệu ứng floating liên tục cho particles
      gsap.to(".floating-particle", {
        y: "-=8",
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      });

      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 80,
              x: window.innerWidth >= 768 ? (index % 2 === 0 ? -50 : 50) : -30,
              scale: 0.8,
              rotationY:
                window.innerWidth >= 768 ? (index % 2 === 0 ? -10 : 10) : -5,
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      // Timeline line animation với responsive
      gsap.fromTo(
        ".timeline-line-animated",
        { scaleY: 0, opacity: 0.3 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        },
      );
    }, timelineRef);

    return () => {
      ctx.revert();
      // Đảm bảo scroll được khôi phục khi component unmount
      document.body.style.overflow = "auto";
      // Xóa style element đã thêm
      const customStyle = document.querySelector("style[data-hide-scrollbar]");
      if (customStyle) {
        customStyle.remove();
      }
    };
  }, []);

  const getBadgeClass = (importance: string) => {
    switch (importance) {
      case "important":
        return "bg-gradient-to-r from-[#B22222] to-[#1C1C1C] text-[#F5F5F5] border-0 shadow-lg";
      case "secondary":
        return "bg-gradient-to-r from-[#FFD700] to-[#B22222] text-[#1C1C1C] border-0 shadow-lg";
      case "accent":
        return "bg-gradient-to-r from-[#1C1C1C] to-[#B22222] text-[#F5F5F5] border-0 shadow-lg";
      default:
        return "bg-gradient-to-r from-[#B22222] to-[#FFD700] text-[#1C1C1C] border-0 shadow-lg";
    }
  };

  return (
    <div ref={timelineRef} className="min-h-screen bg-background">
      <section className="hero-section py-32 px-4 text-center relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 hero-bg"
            style={{
              backgroundImage:
                "url('/images/dan-toc-ton-giao-qua-do-XHCN.jpg')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="floating-particle absolute w-2 h-2 bg-yellow-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-20 px-4">
          <div className="hero-content mb-12">
            <h1 className="hero-title text-5xl md:text-7xl lg:text-[7rem] font-extrabold mb-8 text-balance leading-[0.9] tracking-wide font-[family-name:var(--font-be-vietnam)]">
              <div className="title-line text-center">
                <span className="text-red-700/80 drop-shadow-2xl inline-block font-extrabold">
                  DÂN TỘC
                </span>
              </div>
              <div className="title-line mt-6 text-center">
                <span className="text-yellow-500/80 drop-shadow-2xl inline-block font-extrabold">
                  TÔN GIÁO
                </span>
              </div>
            </h1>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="hero-quote text-3xl md:text-4xl text-yellow-500 mb-6 text-pretty leading-relaxed italic drop-shadow-lg font-normal">
              Trong Thời Kỳ Quá Độ Lên Chủ Nghĩa Xã Hội
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-container relative py-16 md:py-24 px-4 bg-gradient-to-br from-amber-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('/images/pattern-vietnam.png')] opacity-5 bg-repeat"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Timeline Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-800/80 mb-4">
              Vấn đề Dân tộc và Tôn giáo
            </h2>
            <p className="text-lg md:text-xl text-yellow-600 max-w-3xl mx-auto">
              Những nội dung cơ bản về dân tộc và tôn giáo trong thời kỳ quá độ
            </p>
          </div>

          {/* Desktop Timeline Line */}
          <div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 timeline-line timeline-line-animated origin-top rounded-full bg-gradient-to-b from-red-600 to-yellow-400"
            style={{ height: "98.24%" }}
          ></div>

          {/* Mobile Timeline Line */}
          <div
            className="md:hidden absolute left-8 top-32 w-1 timeline-line timeline-line-animated origin-top rounded-full bg-gradient-to-b from-red-600 to-yellow-400"
            style={{ height: "98.24%" }}
          ></div>

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-24">
            {timelineData.map((item, index) => (
              <div
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`relative flex items-center ${
                  // Desktop: alternating left/right, Mobile: all left-aligned
                  "md:" + (index % 2 === 0 ? "justify-start" : "justify-end")
                }`}
              >
                {/* Timeline Dot */}
                {/* <div className="absolute md:left-1/2 left-8 transform md:-translate-x-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full timeline-dot z-10 border-4 border-white shadow-xl"></div> */}

                {/* Section Number Badge */}
                <div
                  className={`absolute md:left-1/2 left-8 transform md:-translate-x-1/2 -translate-x-1/2 ${
                    // Desktop positioning, Mobile: above the dot
                    "md:" +
                    (index % 2 === 0 ? "translate-x-20" : "-translate-x-28") +
                    " -translate-y-12 md:translate-y-0"
                  } flex items-center gap-2 text-base md:text-lg font-bold z-20 text-white bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-full shadow-lg border-2 border-yellow-400/50`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  {item.year}
                </div>

                {/* Timeline Card */}
                <Link
                  href={`/timeline/${item.slug}`}
                  className={`block w-full ${
                    // Desktop: max-width and positioning, Mobile: full width with left margin
                    "md:max-w-lg ml-20 md:ml-0 " +
                    (index % 2 === 0 ? "md:mr-auto" : "md:ml-auto")
                  }`}
                >
                  <Card className="timeline-card w-full shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-amber-300 bg-white/98 backdrop-blur-sm hover:scale-105 md:hover:scale-105 hover:scale-[1.02] cursor-pointer group overflow-hidden hover:bg-gradient-to-br hover:from-amber-50/80 hover:to-red-50/50">
                    <CardContent className="p-6 md:p-8">
                      {/* Category Badge */}
                      {/* <div className="mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeClass(item.importance)}`}>
                          {item.category}
                        </span>
                      </div> */}

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-800 leading-tight group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed text-pretty text-base md:text-lg mb-4">
                        {item.description}
                      </p>

                      {/* Read More Button */}
                      <div className="flex items-center justify-between">
                        <div className="text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 text-sm md:text-base">
                          Đọc chi tiết
                        </div>
                        <div className="w-8 h-8 bg-red-600/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-24 px-4 text-center bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <blockquote className="text-3xl md:text-4xl font-semibold text-red-700 mb-8 text-balance italic leading-relaxed">
            "Không có gì quý hơn độc lập tự do"
          </blockquote>

          <cite className="text-xl text-gray-800 font-medium">
            — Chủ tịch Hồ Chí Minh —
          </cite>
        </div>
      </section> */}

      {/* Thống kê chiến dịch */}
      {/* <BattleStats /> */}

      {/* Bản đồ tương tác Điện Biên Phủ */}
      {/* <InteractiveMap /> */}

      {/* 3D Model với Chat tích hợp - chỉ hiện sau animation */}
      {animationComplete && <ModelWithChat />}

      {/* Hero Footer */}
      <HeroFooter />

      {/* Floating Game Button - chỉ hiện sau animation */}
      {animationComplete && (
        <Link href="/game" className="fixed bottom-8 left-8 z-50">
          <div className="bg-red-600 hover:bg-red-800 text-white p-2 rounded-full shadow-2xl hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-110 cursor-pointer group animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
                />
              </svg>
            </div>
            <div className="absolute -top-12 left-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Chơi game xếp hình
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
