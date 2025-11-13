"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Trophy, Star } from "lucide-react";

const galleryImages = [
  {
    src: "/images/Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, ngày 2-9-1945.jpg",
    alt: "Tuyên ngôn Độc lập 2/9/1945",
    label: "Tuyên ngôn Độc lập 2/9/1945",
    file: "Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, ngày 2-9-1945.jpg",
    pieces: "12 mảnh",
    period: "1945",
    description:
      "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời, mở ra kỷ nguyên mới của dân tộc.",
  },
  {
    src: "/images/Quân dân Hà Nội sẵn sàng chiến đấu, tháng 12-1946.jpg",
    alt: "Kháng chiến toàn quốc 1946",
    label: "Quân dân Hà Nội sẵn sàng chiến đấu",
    file: "Quân dân Hà Nội sẵn sàng chiến đấu, tháng 12-1946.jpg",
    pieces: "15 mảnh",
    period: "1946",
    description:
      "Quân dân Hà Nội sẵn sàng chiến đấu tháng 12-1946, chuẩn bị cho cuộc kháng chiến toàn quốc chống thực dân Pháp xâm lược.",
  },
  {
    src: "/images/Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947.jpg",
    alt: "Bộ đội qua sông Lô",
    label: "Chiến dịch Việt Bắc Thu-Đông 1947",
    file: "Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947.jpg",
    pieces: "18 mảnh",
    period: "1947",
    description:
      "Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947, bảo vệ căn cứ địa kháng chiến và đánh bại âm mưu đánh nhanh thắng nhanh của Pháp.",
  },
  {
    src: "/images/Bộ đội ta tiến vào giải phóng thị trấn Đông Khê.jpg",
    alt: "Bộ đội giải phóng thị trấn Đông Khê",
    label: "Bộ đội giải phóng thị trấn Đông Khê",
    file: "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê.jpg",
    pieces: "20 mảnh",
    period: "1950",
    description:
      "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê trong Chiến dịch Biên giới Thu-Đông 1950, mở đầu cho giai đoạn ta chuyển sang tổng phản công.",
  },
  {
    src: "/images/bo-doi-hanh-quan.webp",
    alt: "Bộ đội hành quân tại Điện Biên Phủ",
    label: "Bộ đội hành quân tại Điện Biên Phủ",
    file: "bo-doi-hanh-quan.webp",
    pieces: "22 mảnh",
    period: "1953-1954",
    description:
      "Hình ảnh bộ đội Việt Nam hành quân qua những địa hình hiểm trở để tiến vào Điện Biên Phủ, thể hiện ý chí quyết tâm và tinh thần bất khuất của quân dân ta.",
  },
  {
    src: "/images/Lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh được trang hoàng trên chiếc xe tăng thu được của địch diễu hành mừng chiến thắng tại Điện Biên Phủ, năm 1954.jpg",
    alt: "Chiến thắng lịch sử Điện Biên Phủ",
    label: "Chiến thắng lịch sử Điện Biên Phủ",
    file: "Lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh được trang hoàng trên chiếc xe tăng thu được của địch diễu hành mừng chiến thắng tại Điện Biên Phủ, năm 1954.jpg",
    pieces: "25 mảnh",
    period: "1954",
    description:
      "Chiến thắng Điện Biên Phủ là đỉnh cao của nghệ thuật quân sự Việt Nam, buộc thực dân Pháp phải ký Hiệp định Genève, chấm dứt ách thống trị của họ tại Đông Dương.",
  },
];

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
            href="/"
            className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-red-600/25 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Link> */}

          <div className="text-center flex-1 sm:px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-700 mb-1 sm:mb-2 leading-tight">
              Chín năm kháng chiến trường kì
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
              Tái hiện những khoảnh khắc lịch sử hào hùng của những năm tháng
              kháng chiến từ năm 1945 đến năm 1954 qua trò chơi xếp hình tương
              tác
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
              onClick={() => router.push(`/game/play/${img.file}`)}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-red-200 hover:border-red-500 hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
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
            Học Lịch Sử Qua Trò Chơi
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Mỗi mảnh ghép là một khoảnh khắc lịch sử, mỗi hình hoàn thành là một
            chương vẻ vang của quá trình kháng chiến chống thực dân Pháp. Hãy
            bắt đầu hành trình khám phá những trang sử hào hùng này!
          </p>
        </div>
      </div>
    </div>
  );
}
