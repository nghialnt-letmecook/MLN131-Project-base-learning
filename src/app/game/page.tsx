"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Trophy, Star } from "lucide-react";

import imagesData from "../../../public/images/game/images.json";

// Define the specific images to show based on user request
const activeImageFiles = ["12.jpg", "14.jpg", "15.jpg", "17.jpg", "20.jpg", "21.jpg"];

const galleryImages = imagesData.images
  .filter((img) => activeImageFiles.includes(img.file))
  .map((img) => ({
    src: `/images/game/${img.file}`,
    alt: img.title,
    label: img.title,
    file: `game/${img.file}`,
    pieces: "9 mảnh", // Default or calculated
    period: "Lễ hội & Văn hóa", // Generic or could be added to JSON
    description: img.description,
  }));

export default function GameGallery() {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "bg-[#2E4600]/20 text-[#2E4600] border-[#2E4600]/30";
      case "Trung bình":
        return "bg-[#FFD700]/20 text-[#B22222] border-[#FFD700]/50";
      case "Khó":
        return "bg-[#B22222]/20 text-[#B22222] border-[#B22222]/50";
      default:
        return "bg-[#E5E5E5] text-[#4B2E2E] border-[#D2B48C]";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 relative overflow-hidden">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Historical Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-red-600 rotate-45"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-yellow-500 rotate-12"></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 border-2 border-red-600 -rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-yellow-500 rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 mt-24 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-4 sm:gap-0">
          {/* <Link
            href="/leaderboard"
            className="group flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25 self-start sm:self-auto"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Bảng xếp hạng</span>
          </Link> */}

          <div className="text-center flex-1 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-700 mb-1 sm:mb-2 leading-tight">
              Sắc màu Dân tộc & Tôn giáo
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
              Khám phá vẻ đẹp đa dạng của các dân tộc và nét đặc sắc trong văn hóa tôn giáo Việt Nam qua những mảnh ghép đầy thú vị
            </p>
          </div>

          <div className="hidden sm:block w-20 md:w-32"></div>
        </div>

        {/* Gallery Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {galleryImages.map((img, idx) => (
            <div
              key={img.src}
              className="group cursor-pointer"
              onClick={() =>
                router.push(`/game/play/${encodeURIComponent(img.file)}`)
              }
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-red-200 hover:border-red-500 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay with period */}
                  <div className="absolute top-4 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {img.period}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-700 transition-colors">
                    {img.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-red-200">
          <div className="flex items-center justify-center gap-2 text-yellow-500 mb-4">
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-2xl font-bold text-red-700 mb-2 font-serif">
            Khám phá Văn hóa Việt
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Mỗi mảnh ghép là một nét văn hóa độc đáo, mỗi hình ảnh hoàn thành là một
            câu chuyện về sự đoàn kết và đa dạng của các dân tộc Việt Nam. Hãy
            bắt đầu hành trình khám phá những giá trị tinh thần quý báu này!
          </p>
        </div>
      </div>
    </div>
  );
}
