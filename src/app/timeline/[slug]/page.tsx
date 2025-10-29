"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Plus,
  PlusCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ModelWithChat from "@/components/model3D/ModelWithChat";
import TimelineNavbar from "@/components/ui/timeline-navbar";

// CSS cho custom slider
const sliderStyles = `
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    width: 16px;
    background: #dc2626;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input[type="range"]::-moz-range-thumb {
    height: 16px;
    width: 16px;
    background: #dc2626;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

// Type definitions for rich content
interface RichContentItem {
  type:
    | "paragraph"
    | "image"
    | "quote"
    | "list"
    | "highlight"
    | "highlight-normal"
    | "raw";
  content?: string;
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  layout?: "normal" | "wide";
  items?: string[];
}

interface TimelineEvent {
  year: string;
  title: string;
  slug: string;
  description: string;
  richContent?: RichContentItem[];
  fullContent?: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: "Tháng 8 - 9 năm 1945",
    title: "Giành Độc lập và Thành lập Chính quyền",
    slug: "gianh-doc-lap-thanh-lap-chinh-quyen",
    description:
      "Đảng lãnh đạo tổng khởi nghĩa giành chính quyền và tuyên bố thành lập Nhà nước.",
    richContent: [
      { type: "highlight-normal", content: "Tháng 8 năm 1945" },
      {
        type: "paragraph",
        content:
          "Sau khi phát xít Nhật đầu hàng Đồng minh (15-8-1945), Đảng lãnh đạo thành công Cách mạng Tháng Tám, giành độc lập, mở ra một thời đại mới.",
      },
      { type: "highlight-normal", content: "13-8-1945" },
      {
        type: "paragraph",
        content:
          "Ủy ban Khởi nghĩa toàn quốc được thành lập và ban bố 'Quân lệnh số 1', phát lệnh tổng khởi nghĩa.",
      },
      { type: "highlight-normal", content: "16-8-1945" },
      {
        type: "paragraph",
        content:
          "Đại hội quốc dân họp tại Tân Trào tán thành tổng khởi nghĩa, thông qua 10 chính sách lớn của Việt Minh và thành lập Ủy ban Giải phóng dân tộc Việt Nam.",
      },
      { type: "highlight-normal", content: "19-8-1945" },
      {
        type: "paragraph",
        content: "Khởi nghĩa giành chính quyền thắng lợi ở Thủ đô Hà Nội.",
      },
      { type: "highlight-normal", content: "2-9-1945" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, tuyên bố thành lập Nước Việt Nam Dân chủ Cộng hòa.",
      },
      { type: "highlight-normal", content: "3-9-1945" },
      {
        type: "paragraph",
        content:
          "Chính phủ lâm thời họp phiên đầu tiên, xác định ba nhiệm vụ lớn cấp bách: diệt giặc đói, diệt giặc dốt và diệt giặc ngoại xâm.",
      },
      { type: "highlight-normal", content: "23-9-1945" },
      {
        type: "paragraph",
        content:
          "Quân đội Pháp nổ súng gây hấn đánh chiếm Sài Gòn–Chợ Lớn, mở đầu cuộc chiến tranh xâm lược lần thứ hai.",
      },
    ],
  },
  {
    year: "Cuối 1945 – Cuối 1946",
    title: "Củng cố Chính quyền và Đối phó với Thù trong, Giặc ngoài",
    slug: "cung-co-chinh-quyen",
    description:
      "Chính quyền non trẻ phải đối mặt với nhiều khó khăn (giặc đói, giặc dốt, giặc ngoại xâm) và thách thức lớn nhất là âm mưu quay lại thống trị của Pháp",
    richContent: [
      { type: "highlight-normal", content: "25-11-1945" },
      {
        type: "paragraph",
        content:
          "Ban Chấp hành Trung ương Đảng ra Chỉ thị Kháng chiến kiến quốc, xác định kẻ thù chính là thực dân Pháp xâm lược và nhiệm vụ chủ yếu là củng cố chính quyền, chống Pháp, cải thiện đời sống nhân dân.",
      },
      { type: "highlight-normal", content: "11-11-1945" },
      {
        type: "paragraph",
        content:
          "Đảng Cộng sản Đông Dương tuyên bố tự giải tán để tránh mũi nhọn tấn công của kẻ thù và thực hiện chiến lược quân sự, chính trị linh hoạt.",
      },
      { type: "highlight-normal", content: "6-1-1946" },
      {
        type: "paragraph",
        content:
          "Cả nước tổ chức thành công cuộc bầu cử toàn quốc theo phổ thông đầu phiếu để bầu ra Quốc hội, với hơn 89% cử tri tham gia.",
      },
      { type: "highlight-normal", content: "2-3-1946" },
      {
        type: "paragraph",
        content:
          "Quốc hội khóa I họp phiên đầu tiên, thành lập Chính phủ chính thức do Hồ Chí Minh làm Chủ tịch.",
      },
      { type: "highlight-normal", content: "6-3-1946" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh ký Hiệp định sơ bộ với Pháp, công nhận Việt Nam là một quốc gia tự do — một nỗ lực nhằm trì hoãn xung đột và bảo toàn lực lượng trong giai đoạn nhạy cảm.",
      },
      { type: "highlight-normal", content: "9-3-1946" },
      {
        type: "paragraph",
        content:
          "Thường vụ Trung ương Đảng ra Chỉ thị 'Hòa để tiến', phân tích chủ trương hòa hoãn và chuẩn bị sẵn sàng kháng chiến khi cần.",
      },
      { type: "highlight-normal", content: "14-9-1946" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh ký Tạm ước 14-9 với Pháp, cam kết đình chỉ chiến sự ở Nam Bộ và tiếp tục đàm phán nhằm tránh xung đột quy mô.",
      },
      { type: "highlight-normal", content: "9-11-1946" },
      {
        type: "paragraph",
        content:
          "Quốc hội thông qua Hiến pháp đầu tiên của Nước Việt Nam Dân chủ Cộng hòa (Hiến pháp năm 1946), đánh dấu bước chuyển quan trọng về pháp lý và tổ chức nhà nước.",
      },
    ],
  },
  {
    year: "Cuối 1946 – 1947",
    title: "Kháng chiến Toàn quốc Bùng nổ",
    slug: "khang-chien-bung-no",
    description:
      "Do Pháp tăng cường gây hấn và ý chí xâm lược, cuộc chiến tranh toàn quốc bùng nổ",
    richContent: [
      { type: "highlight-normal", content: "12-12-1946" },
      {
        type: "paragraph",
        content:
          "Trung ương ra Chỉ thị Toàn dân kháng chiến, kêu gọi mọi tầng lớp nhân dân đứng lên bảo vệ Tổ quốc và chuẩn bị kháng chiến lâu dài.",
      },
      { type: "highlight-normal", content: "19-12-1946" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh phát Lời kêu gọi Toàn quốc kháng chiến, đánh dấu mốc toàn dân đồng lòng chống thực dân Pháp (đêm 19–20/12/1946, Hà Nội).",
      },
      { type: "highlight-normal", content: "1946–1947" },
      {
        type: "paragraph",
        content:
          "Quân và dân Hà Nội cùng nhiều vùng chiến lược chiến đấu liên tục trong nhiều tháng (kéo dài hàng chục ngày đêm), bẻ gãy nhiều cuộc tấn công của Pháp và giữ vững các vùng căn cứ cách mạng.",
      },
      { type: "highlight-normal", content: "8-1947" },
      {
        type: "paragraph",
        content:
          "Trường Chinh xuất bản bài luận 'Kháng chiến nhất định thắng lợi' nhằm củng cố niềm tin và tinh thần chiến đấu của quần chúng trong giai đoạn cam go.",
      },
      { type: "highlight-normal", content: "Thu - Đông 1947" },
      {
        type: "paragraph",
        content:
          "Pháp mở các đợt tấn công quy mô vào căn cứ địa Việt Bắc; quân và dân ta tổ chức chiến tranh du kích, bảo vệ vùng căn cứ và làm thất bại nhiều mũi tiến công của địch.",
      },
    ],
  },
  {
    year: "1948 – 1950",
    title: "Xây dựng Lực lượng và Mở đầu Tổng phản công ",
    slug: "xay-dung-luc-luong",
    description:
      "Giai đoạn đẩy mạnh kháng chiến toàn diện và giành được chiến thắng lớn mang tính bước ngoặt",
    richContent: [
      { type: "highlight-normal", content: "11-6-1948" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh ra Lời kêu gọi Thi đua ái quốc, kêu gọi nhân dân hăng hái tăng gia sản xuất, thi đua lao động và góp phần phục vụ kháng chiến.",
      },
      { type: "highlight-normal", content: "1-10-1949" },
      {
        type: "paragraph",
        content:
          "Nước Cộng hòa Nhân dân Trung Hoa được thành lập, tạo bước chuyển quan hệ chính trị có lợi cho phong trào cách mạng ở khu vực và mở ra khả năng hợp tác với nước láng giềng.",
      },
      { type: "highlight-normal", content: "18-1-1950" },
      {
        type: "paragraph",
        content:
          "Trung Quốc công nhận và thiết lập quan hệ ngoại giao với Việt Nam Dân chủ Cộng hòa, mở đường cho viện trợ và tiếp tế từ phía bạn bè quốc tế.",
      },
      { type: "highlight-normal", content: "30-1-1950" },
      {
        type: "paragraph",
        content:
          "Liên Xô công nhận và đặt quan hệ ngoại giao với Việt Nam Dân chủ Cộng hòa, nâng cao vị thế ngoại giao và mở rộng không gian chính trị quốc tế cho cách mạng Việt Nam.",
      },
      { type: "highlight-normal", content: "16-9 đến 17-10-1950" },
      {
        type: "paragraph",
        content:
          "Đảng tiến hành Chiến dịch Biên giới Thu-Đông 1950; chiến thắng này tiêu diệt sinh lực địch, mở rộng căn cứ địa Việt Bắc, và tạo thông thương với Trung Quốc, kết thúc thời kỳ chiến đấu trong vòng vây và mở ra cuộc diện mới.",
      },
    ],
  },
  {
    year: "1951 – 1953",
    title: "Củng cố Đường lối và Đẩy mạnh Kháng chiến",
    slug: "cung-co-duong-loi",
    description:
      "Giai đoạn Đảng ra hoạt động công khai, hoàn thiện đường lối cách mạng dân tộc dân chủ nhân dân và tiến hành cải cách ruộng đất",
    richContent: [
      { type: "highlight-normal", content: "2-1951" },
      {
        type: "paragraph",
        content:
          "Đại hội đại biểu toàn quốc lần thứ II của Đảng họp (tại Tuyên Quang). Đại hội quyết định Đảng ra hoạt động công khai với tên gọi Đảng Lao động Việt Nam. Đại hội thông qua Cương cương (Chính cương) của Đảng Lao động Việt Nam, xác định mục tiêu là tiêu diệt thực dân Pháp và đánh bại can thiệp Mỹ, giành độc lập hoàn toàn.",
      },
      { type: "highlight-normal", content: "1951–1952" },
      {
        type: "paragraph",
        content:
          "Đảng mở các chiến dịch quân sự như Chiến dịch Hòa Bình (12-1951) và các chiến dịch ở Tây Bắc (Thu‑Đông 1952), nhằm phát triển lực lượng, giành thế chủ động trên một số mặt trận trọng yếu.",
      },
      { type: "highlight-normal", content: "5-1953" },
      {
        type: "paragraph",
        content:
          "Tướng H. Navarre được bổ nhiệm làm Tổng chỉ huy quân đội Pháp ở Đông Dương và vạch ra Kế hoạch Navarre, nhằm chuyển thế trận thôn tính sang các chiến lược khoanh vùng và tiêu diệt lực lượng cách mạng.",
      },
      { type: "highlight-normal", content: "Cuối 9-1953" },
      {
        type: "paragraph",
        content:
          "Bộ Chính trị thông qua chủ trương tác chiến chiến lược Đông‑Xuân 1953‑1954, mục tiêu tiêu diệt sinh lực địch, giữ vững thế chủ động và tạo điều kiện cho các chiến dịch bước ngoặt sau này.",
      },
      { type: "highlight-normal", content: "11-1953" },
      {
        type: "paragraph",
        content:
          "Hội nghị Trung ương Đảng lần thứ năm thông qua Cương lĩnh ruộng đất, chủ trương cải cách ruộng đất nhằm tăng cường chi viện hậu phương và củng cố cơ sở xã hội cho kháng chiến.",
      },
    ],
  },
  {
    year: "1954",
    title: "Chiến thắng Quyết định và Ký kết Hiệp định",
    slug: "chien-thang",
    description:
      "Đây là giai đoạn quyết định chấm dứt cuộc kháng chiến chống Pháp",
    richContent: [
      { type: "highlight-normal", content: "Đầu 12-1953" },
      {
        type: "paragraph",
        content: "Bộ Chính trị quyết định mở Chiến dịch Điện Biên Phủ.",
      },
      { type: "highlight-normal", content: "13-3-1954" },
      {
        type: "paragraph",
        content:
          "Quân ta nổ súng tấn công địch, mở màn Chiến dịch Điện Biên Phủ.",
      },
      { type: "highlight-normal", content: "7-5-1954" },
      {
        type: "paragraph",
        content:
          "Chiến dịch Điện Biên Phủ kết thúc thắng lợi, bắt sống tướng Đờ Cát-xtơ-ri, đưa cuộc kháng chiến chống Pháp đến thắng lợi vẻ vang.",
      },
      { type: "highlight-normal", content: "8-5-1954" },
      {
        type: "paragraph",
        content:
          "Phái đoàn Chính phủ Việt Nam Dân chủ Cộng hòa tham gia Hội nghị Gionevơ (Thụy Sỹ).",
      },
      { type: "highlight-normal", content: "21-7-1954" },
      {
        type: "paragraph",
        content:
          "Các nước ký kết Hiệp định Genève, cam kết tôn trọng độc lập, thống nhất và toàn vẹn lãnh thổ của Việt Nam; Hiệp định góp phần chấm dứt chiến tranh ở Đông Dương.",
      },
    ],
  },
];

export default function TimelineDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const event = timelineData.find((item) => item.slug === slug);
  const currentIndex = timelineData.findIndex((item) => item.slug === slug);

  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // States cho popup hình ảnh
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  // States cho audio
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Functions xử lý audio
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
      audioRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!audioRef.current) return;
    setPlaybackRate(rate);
    audioRef.current.playbackRate = rate;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    const newTime = clickRatio * audioDuration;

    audioRef.current.currentTime = newTime;
    setAudioProgress((newTime / audioDuration) * 100);
  };

  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(
      0,
      Math.min(audioDuration, audioRef.current.currentTime + seconds)
    );
    audioRef.current.currentTime = newTime;
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    const progress =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAudioProgress(progress);
  };

  const handleAudioLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration);
    audioRef.current.volume = volume;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Function xử lý popup hình ảnh
  const openImageModal = (src: string, alt: string, caption?: string) => {
    setSelectedImage({ src, alt, caption });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (!event) return;

    const tl = gsap.timeline();

    // Animate content sections
    tl.fromTo(
      contentRef.current?.children || [],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5E5E5] via-[#D2B48C] to-[#E5E5E5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2E4600] mb-4">
            Không tìm thấy sự kiện
          </h1>
          <button
            onClick={() => router.push("/")}
            className="bg-[#4B2E2E] text-[#F5F5F5] px-6 py-2 rounded-lg hover:bg-[#2E4600] transition-colors"
          >
            Quay về Timeline
          </button>
        </div>
      </div>
    );
  }

  const contentItems = event.richContent || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100">
      <style jsx>{sliderStyles}</style>

      {/* New Timeline Navbar */}
      <TimelineNavbar
        isPlaying={isPlaying}
        audioProgress={audioProgress}
        audioDuration={audioDuration}
        isMuted={isMuted}
        volume={volume}
        playbackRate={playbackRate}
        showVolumeSlider={showVolumeSlider}
        onToggleAudio={toggleAudio}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        onPlaybackRateChange={handlePlaybackRateChange}
        onProgressClick={handleProgressClick}
        onSetShowVolumeSlider={setShowVolumeSlider}
        formatTime={formatTime}
        currentSlug={slug as string}
      />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        onVolumeChange={() => {
          if (audioRef.current) {
            setVolume(audioRef.current.volume);
            setIsMuted(audioRef.current.muted);
          }
        }}
        preload="metadata"
      >
        <source src={`/audio/${slug}.mp3`} type="audio/mpeg" />
        Trình duyệt của bạn không hỗ trợ audio.
      </audio>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article
          ref={contentRef}
          // className="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-100 overflow-hidden shadow-xl"
        >
          {/* Article Header */}
          <div className="relative px-8 pt-12 pb-8 text-center border-b border-red-200">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-yellow-100/60"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <Calendar className="w-8 h-8 text-red-700" />
                </div>
                <span className="text-4xl font-bold text-red-800">
                  {event.year}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-6 leading-tight text-pretty">
                {event.title}
              </h1>

              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-red-700/80 leading-relaxed text-pretty italic mb-6">
                  {event.description}
                </p>

                {/* <div className="inline-flex items-center px-4 py-2 bg-white/60 rounded-full border border-red-200">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeClass(event.importance)}`}>
                    {event.category}
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {/* Blog Content with Rich Text */}
            <div className="prose prose-lg max-w-none">
              {contentItems.map((item: RichContentItem, index: number) => {
                if (item.type === "raw") {
                  return (
                    <div
                      key={index}
                      className="mb-8"
                      dangerouslySetInnerHTML={{ __html: item.content || "" }}
                    />
                  );
                }
                if (item.type === "paragraph") {
                  return (
                    <div key={index} className="mb-8 relative">
                      {/* Add decorative quote for first paragraph */}
                      {index === 0 && (
                        <div className="absolute -left-4 top-0 text-6xl text-yellow-500 font-serif leading-none select-none">
                          "
                        </div>
                      )}
                      <p
                        className={`text-lg text-gray-800 leading-relaxed text-justify font-sans ${
                          index === 0
                            ? "first-letter:text-5xl first-letter:font-bold first-letter:text-red-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:font-serif"
                            : ""
                        }`}
                        style={{
                          lineHeight: "1.8",
                          wordSpacing: "0.1em",
                          textAlign: "justify",
                          hyphens: "auto",
                          fontFeatureSettings: '"liga", "kern"',
                        }}
                      >
                        {item.content}
                      </p>
                    </div>
                  );
                }

                if (item.type === "image") {
                  const imageItem = item as RichContentItem;
                  return (
                    <figure
                      key={index}
                      className={`my-12 ${
                        imageItem.layout === "wide"
                          ? "-mx-8 md:-mx-16 lg:-mx-20"
                          : ""
                      }`}
                    >
                      <div
                        className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                        onClick={() =>
                          openImageModal(
                            imageItem.src || "/placeholder.svg",
                            imageItem.alt || "",
                            imageItem.caption
                          )
                        }
                      >
                        <img
                          src={imageItem.src || "/placeholder.svg"}
                          alt={imageItem.alt}
                          className={`w-full group-hover:scale-[1.02] transition-transform duration-700 ${
                            imageItem.layout === "wide"
                              ? "object-contain"
                              : "object-cover h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem] 2xl:h-[40rem]"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300"></div>

                        {/* Click indicator */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-3 shadow-lg">
                            <PlusCircle className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                      </div>
                      {imageItem.caption && (
                        <figcaption className="text-center text-base text-gray-700 mt-6 italic px-6 leading-relaxed">
                          {imageItem.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (item.type === "quote") {
                  const quoteItem = item as RichContentItem;
                  return (
                    <blockquote
                      key={index}
                      className="my-8 p-6 bg-gradient-to-r from-red-50 to-yellow-50 border-l-4 border-red-600 rounded-r-lg"
                    >
                      <p
                        className="text-xl font-medium text-red-800 italic text-center"
                        style={{
                          lineHeight: "1.6",
                          wordSpacing: "0.05em",
                          fontFeatureSettings: '"liga", "kern"',
                        }}
                      >
                        {quoteItem.content}
                      </p>
                      {quoteItem.author && (
                        <cite
                          className="block text-right text-sm text-red-700 mt-3 font-semibold"
                          style={{
                            fontStyle: "normal",
                            fontFeatureSettings: '"liga", "kern"',
                          }}
                        >
                          — {quoteItem.author}
                        </cite>
                      )}
                    </blockquote>
                  );
                }

                if (item.type === "list") {
                  const listItem = item as RichContentItem;
                  return (
                    <div
                      key={index}
                      className="my-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 rounded-r-lg"
                    >
                      <ul className="space-y-3">
                        {listItem.items?.map((listItemText, listIndex) => (
                          <li
                            key={listIndex}
                            className="flex items-start gap-3 text-lg text-gray-800 leading-relaxed"
                            style={{
                              lineHeight: "1.8",
                              wordSpacing: "0.1em",
                              fontFeatureSettings: '"liga", "kern"',
                            }}
                          >
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-3"></span>
                            <span className="text-justify">{listItemText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                if (item.type === "highlight") {
                  const highlightItem = item as RichContentItem;
                  return (
                    <div
                      key={index}
                      className="my-8 p-6 bg-gradient-to-r from-yellow-100 via-orange-50 to-red-100 border-2 border-orange-400 rounded-xl shadow-lg"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-orange-800 text-center mb-4 tracking-wide">
                        {highlightItem.content}
                      </h3>
                      <div className="flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                      </div>
                    </div>
                  );
                }

                if (item.type === "highlight-normal") {
                  const highlightNormalItem = item as RichContentItem;
                  return (
                    <div key={index} className="my-6">
                      <h4
                        className="text-xl font-semibold text-gray-800 mb-3"
                        style={{
                          lineHeight: "1.6",
                          fontFeatureSettings: '"liga", "kern"',
                        }}
                      >
                        {highlightNormalItem.content}
                      </h4>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="px-8 py-8 bg-gradient-to-r from-red-50/80 to-yellow-50/80 border-t border-red-200">
            <div className="flex justify-between items-center gap-4">
              {currentIndex > 0 ? (
                <button
                  onClick={() =>
                    router.push(
                      `/timeline/${timelineData[currentIndex - 1].slug}`
                    )
                  }
                  className="flex items-center gap-3 text-red-700 hover:text-red-800 transition-all duration-200 group bg-white/70 px-6 py-3 rounded-xl border border-red-200 hover:bg-white/90 hover:shadow-md"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs text-gray-600 uppercase tracking-wide">
                      Sự kiện trước
                    </div>
                    <div className="font-medium truncate max-w-[200px]">
                      {timelineData[currentIndex - 1].title}
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-[200px]"></div>
              )}

              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {currentIndex + 1} / {timelineData.length}
                </div>
                <div className="w-32 h-1 bg-red-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentIndex + 1) / timelineData.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {currentIndex < timelineData.length - 1 ? (
                <button
                  onClick={() =>
                    router.push(
                      `/timeline/${timelineData[currentIndex + 1].slug}`
                    )
                  }
                  className="flex items-center gap-3 text-red-700 hover:text-red-800 transition-all duration-200 group bg-white/70 px-6 py-3 rounded-xl border border-red-200 hover:bg-white/90 hover:shadow-md"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-600 uppercase tracking-wide">
                      Sự kiện tiếp theo
                    </div>
                    <div className="font-medium truncate max-w-[200px]">
                      {timelineData[currentIndex + 1].title}
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="w-[200px]"></div>
              )}
            </div>
          </div>
        </article>
      </div>

      <ModelWithChat />

      {/* Image Modal Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-7xl max-h-[95vh] w-full">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-colors z-10"
            >
              <X className="w-7 h-7 text-gray-800" />
            </button>

            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto min-h-[60vh] max-h-[85vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Caption */}
              {selectedImage.caption && (
                <div className="p-8 bg-white border-t border-gray-200">
                  <p className="text-gray-700 text-center italic leading-relaxed text-lg">
                    {selectedImage.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
