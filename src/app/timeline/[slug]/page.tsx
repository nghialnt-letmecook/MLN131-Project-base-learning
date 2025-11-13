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
    title: "Giành chính quyền và tình thế 'Ngàn cân treo sợi tóc'",
    slug: "gianh-doc-lap-thanh-lap-chinh-quyen",
    description:
      "Giai đoạn này là đỉnh cao của 15 năm đấu tranh dưới sự lãnh đạo của Đảng, mở ra thời kỳ phát triển mới của dân tộc.",
    richContent: [
      {
        type: "highlight",
        content: "1. Tổng khởi nghĩa Tháng Tám (Giữa tháng 8-1945)",
      },
      { type: "highlight-normal", content: "Bối cảnh và thời cơ cách mạng" },
      {
        type: "paragraph",
        content:
          "Sau hơn 80 năm dưới ách thống trị của thực dân Pháp, nhân dân Việt Nam rơi vào cảnh lầm than, mất nước, nạn đói, nạn mù chữ và áp bức chính trị nặng nề. Trong Chiến tranh thế giới thứ hai, phát xít Nhật tiến vào Đông Dương, lật đổ Pháp, lập nên chính quyền tay sai thân Nhật, khiến đất nước rơi vào tình cảnh 'một cổ hai tròng'.",
      },
      {
        type: "paragraph",
        content:
          "Đến giữa năm 1945, khi phát xít Đức đầu hàng Đồng minh và Nhật Bản tuyên bố đầu hàng vô điều kiện (15-8-1945), chính quyền thân Nhật ở Đông Dương hoang mang cực độ, quân Nhật mất tinh thần chiến đấu. Đây là thời cơ vàng của cách mạng Việt Nam. Dưới sự lãnh đạo của Đảng Cộng sản Đông Dương và Mặt trận Việt Minh, toàn dân vùng dậy giành chính quyền.",
      },
      {
        type: "image",
        src: "/images/nan-doi-1945.jpg",
        alt: "Nạn đói năm 1945",
        caption:
          "Nạn đói năm 1945 - một trong những thách thức lớn nhất mà chính quyền cách mạng phải đối mặt",
      },
      {
        type: "image",
        src: "/images/nan-doi-1945-1.jpg",
        alt: "Nạn đói năm 1945",
        caption: "Cảnh đói khổ của nhân dân trong nạn đói năm 1945",
      },
      {
        type: "highlight-normal",
        content: "Chủ trương và quyết định khởi nghĩa",
      },
      {
        type: "paragraph",
        content:
          "Ngày 12-8-1945, Ủy ban lâm thời khu giải phóng ra lệnh khởi nghĩa trong khu.",
      },
      {
        type: "paragraph",
        content:
          "23 giờ ngày 13-8-1945, Trung ương Đảng và Tổng bộ Việt Minh thành lập Ủy ban khởi nghĩa toàn quốc và ban bố 'Quân lệnh số 1', phát động Tổng khởi nghĩa trong toàn quốc.",
      },
      {
        type: "paragraph",
        content:
          "Ngày 14–15-8-1945, Hội nghị toàn quốc của Đảng họp tại Tân Trào (Tuyên Quang), quyết định phát động toàn dân nổi dậy giành chính quyền từ tay phát xít Nhật trước khi quân Đồng minh vào Đông Dương.",
      },
      {
        type: "paragraph",
        content:
          "Ba nguyên tắc chỉ đạo: Tập trung – Thống nhất – Kịp thời. Phương hướng hành động là đánh chiếm ngay những nơi chắc thắng, phối hợp quân sự và chính trị, làm tan rã tinh thần địch.",
      },
      { type: "highlight-normal", content: "Diễn biến và kết quả" },
      {
        type: "paragraph",
        content:
          "19-8-1945: Nhân dân Hà Nội vùng dậy khởi nghĩa, chiếm Phủ Khâm sai, Tòa Thị chính, trụ sở cảnh sát, bưu điện... Cờ đỏ sao vàng tung bay khắp nơi.",
      },
      {
        type: "image",
        src: "/images/mit-tinh-nha-hat-lon-ha-noi-19-8-1945.jpg",
        alt: "Mít tinh tại Quảng trường Nhà hát Lớn Hà Nội",
        caption:
          "Mít tinh lớn tại Quảng trường Nhà hát Lớn Hà Nội ngày 19-8-1945",
      },
      {
        type: "image",
        src: "/images/mit-tinh-nha-hat-lon-ha-noi-19-8-1945-1.jpg",
        alt: "Mít tinh tại Hà Nội",
        caption:
          "Quần chúng cách mạng tham gia mít tinh tại Quảng trường Nhà hát Lớn Hà Nội",
      },
      {
        type: "image",
        src: "/images/mit-tinh-nha-hat-lon-ha-noi-19-8-1945-2.jpg",
        alt: "Biểu tình vũ trang tại Hà Nội",
        caption:
          "Cuộc biểu tình vũ trang tại Hà Nội chuyển thành khởi nghĩa giành chính quyền",
      },
      {
        type: "paragraph",
        content:
          "23-8-1945: Nhân dân Thừa Thiên – Huế giành chính quyền, vua Bảo Đại sau đó thoái vị, trao ấn kiếm cho chính quyền cách mạng, chấm dứt chế độ phong kiến kéo dài hàng nghìn năm.",
      },
      {
        type: "paragraph",
        content:
          "25-8-1945: Ở Sài Gòn và nhiều tỉnh Nam Bộ, hàng triệu người tham gia biểu tình, giành chính quyền thắng lợi.",
      },
      {
        type: "paragraph",
        content:
          "Đến cuối tháng 8-1945, chính quyền trong cả nước hoàn toàn thuộc về nhân dân.",
      },
      { type: "highlight-normal", content: "Nguyên nhân thắng lợi" },
      {
        type: "paragraph",
        content:
          "Sự lãnh đạo đúng đắn, kịp thời và sáng tạo của Đảng Cộng sản Đông Dương.",
      },
      {
        type: "paragraph",
        content:
          "Sự chuẩn bị lâu dài về lực lượng chính trị, vũ trang và căn cứ cách mạng.",
      },
      {
        type: "paragraph",
        content:
          "Nhân dân cả nước đoàn kết, tin tưởng tuyệt đối vào Việt Minh.",
      },
      {
        type: "paragraph",
        content:
          "Bối cảnh quốc tế thuận lợi: phát xít Nhật đầu hàng, chính quyền tay sai tê liệt.",
      },
      { type: "highlight-normal", content: "Ý nghĩa lịch sử" },
      {
        type: "paragraph",
        content:
          "Lật đổ ách thống trị của thực dân Pháp và phát xít Nhật, chấm dứt chế độ phong kiến kéo dài hàng nghìn năm.",
      },
      {
        type: "paragraph",
        content:
          "Giành chính quyền về tay nhân dân, mở ra kỷ nguyên mới: độc lập dân tộc gắn liền với chủ nghĩa xã hội.",
      },
      {
        type: "paragraph",
        content:
          "Thành lập Nhà nước Việt Nam Dân chủ Cộng hòa (VNDCCH) – nhà nước công nông đầu tiên ở Đông Nam Á.",
      },
      {
        type: "paragraph",
        content:
          "Khẳng định đường lối cách mạng đúng đắn của Đảng, là thắng lợi vĩ đại đầu tiên của chủ nghĩa Mác – Lênin ở Việt Nam.",
      },
      {
        type: "paragraph",
        content:
          "Góp phần thúc đẩy phong trào giải phóng dân tộc trên thế giới sau Thế chiến II.",
      },
      {
        type: "highlight",
        content:
          "2. Thành lập Nhà nước Việt Nam Dân chủ Cộng hòa và tình thế 'Ngàn cân treo sợi tóc' (Tháng 9-1945)",
      },
      { type: "highlight-normal", content: "Thành lập Nhà nước VNDCCH" },
      {
        type: "paragraph",
        content:
          "Ngày 27-8-1945: Ủy ban Dân tộc Giải phóng được cải tổ thành Chính phủ lâm thời nước VNDCCH, do Chủ tịch Hồ Chí Minh đứng đầu.",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-chinh-phu-lam-thoi-3-9-1945.jpg",
        alt: "Chủ tịch Hồ Chí Minh và Chính phủ lâm thời",
        caption:
          "Chủ tịch Hồ Chí Minh và Chính phủ lâm thời ra mắt ngày 3-9-1945",
      },
      {
        type: "paragraph",
        content:
          "Ngày 2-9-1945: Tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc 'Tuyên ngôn Độc lập', long trọng tuyên bố với toàn thế giới rằng:",
      },
      {
        type: "quote",
        content:
          "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã trở thành một nước tự do độc lập.",
      },
      {
        type: "paragraph",
        content:
          "Từ đây, nước Việt Nam Dân chủ Cộng hòa ra đời, trở thành nhà nước nhân dân, do nhân dân và vì nhân dân.",
      },
      {
        type: "image",
        src: "/images/tuyen-ngon-doc-lap-2-9-1945.jpg",
        alt: "Hồ Chí Minh đọc Tuyên ngôn Độc lập",
        caption:
          "Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, ngày 2-9-1945",
        layout: "wide",
      },
      { type: "highlight-normal", content: "Khó khăn và thử thách" },
      {
        type: "paragraph",
        content:
          "Ngay sau khi giành chính quyền, chính phủ non trẻ phải đối mặt với muôn vàn khó khăn:",
      },
      {
        type: "paragraph",
        content:
          "Giặc đói: Nạn đói năm 1945 đã giết chết hơn 2 triệu người ở miền Bắc.",
      },
      {
        type: "paragraph",
        content: "Giặc dốt: Hơn 90% dân số mù chữ.",
      },
      {
        type: "paragraph",
        content:
          "Giặc ngoại xâm: Quân Tưởng Giới Thạch kéo vào miền Bắc. Quân Anh đưa quân Pháp trở lại miền Nam. Các đảng phái phản động trong nước nổi lên chống phá.",
      },
      {
        type: "paragraph",
        content:
          "Nền tài chính trống rỗng, ngân khố quốc gia chỉ còn vài triệu đồng Đông Dương.",
      },
      {
        type: "paragraph",
        content:
          "Tình hình đất nước đúng như Hồ Chí Minh nói: 'Ngàn cân treo sợi tóc.'",
      },
      {
        type: "image",
        src: "/images/quan-doi-anh-tiep-nhan-khi-gioi-nhat-ban-sai-gon-9-1945.png",
        alt: "Quân đội Anh tại Sài Gòn",
        caption:
          "Quân đội Anh tiếp nhận khí giới đầu hàng của binh lính Nhật Bản tại Sài Gòn, tháng 9-1945",
      },
      {
        type: "paragraph",
        content:
          "Thực dân Pháp bắt đầu gây hấn trở lại, nổ súng đánh chiếm Sài Gòn-Chợ Lớn ngày 23-9-1945.",
      },
      {
        type: "image",
        src: "/images/cho-ben-thanh-ngay-dau-khang-chien-23-9-1945.jpg",
        alt: "Chợ Bến Thành ngày đầu kháng chiến",
        caption:
          "Chợ Bến Thành trong ngày đầu kháng chiến chống thực dân Pháp xâm lược, ngày 23-9-1945",
      },
      {
        type: "image",
        src: "/images/mit-tinh-phan-doi-phai-bo-anh-24-9-1945.jpg",
        alt: "Mít tinh phản đối phái bộ Anh",
        caption:
          "Mít tinh phản đối phái bộ Anh tại Quảng trường Nhà hát Lớn, 24-9-1945",
      },
    ],
  },
  {
    year: "Cuối 1945 – Cuối 1946",
    title: "Vừa kháng chiến vừa kiến quốc",
    slug: "cung-co-chinh-quyen",
    description:
      "Đây là giai đoạn Đảng lãnh đạo 'Xây dựng và bảo vệ chính quyền cách mạng'.",
    richContent: [
      {
        type: "highlight",
        content: "1. Giải quyết nhiệm vụ cấp bách (Diệt Giặc đói, giặc dốt)",
      },
      {
        type: "highlight-normal",
        content: "Ba nhiệm vụ cấp bách (3-9-1945)",
      },
      {
        type: "paragraph",
        content:
          "Chính phủ lâm thời xác định ba nhiệm vụ lớn trước mắt là: diệt giặc đói, diệt giặc dốt và diệt giặc ngoại xâm.",
      },
      { type: "highlight-normal", content: "Chống giặc đói" },
      {
        type: "paragraph",
        content:
          "Phát động phong trào tăng gia sản xuất (với khẩu hiệu tăng gia sản xuất ngay, tăng gia sản xuất nữa), lập Hũ gạo tiết kiệm, tổ chức Tuần lễ vàng, Quỹ độc lập. Chính phủ bãi bỏ thuế thân, thực hiện giảm tô 25%. Nạn đói cơ bản được đẩy lùi vào đầu năm 1946.",
      },
      { type: "highlight-normal", content: "Chống giặc dốt" },
      {
        type: "paragraph",
        content:
          "Phát động phong trào 'Bình dân học vụ' để xóa nạn mù chữ; vận động xây dựng nếp sống mới. Đến cuối năm 1946, hơn 2,5 triệu người biết đọc, biết viết chữ Quốc ngữ.",
      },
      {
        type: "image",
        src: "/images/bac-ho-day-chu-binh-dan-hoc-vu.jpg",
        alt: "Bác Hồ dạy Bình dân học vụ",
        caption: "Bác Hồ trực tiếp dạy chữ cho một lớp Bình dân học vụ",
      },
      {
        type: "highlight",
        content: "2. Xây dựng chính quyền và Chỉ thị Kháng chiến kiến quốc",
      },
      {
        type: "highlight-normal",
        content: "Chỉ thị Kháng chiến kiến quốc (25-11-1945)",
      },
      {
        type: "paragraph",
        content:
          "Trung ương Đảng xác định rõ 'kẻ thù chính của ta lúc này là thực dân Pháp xâm lược, phải tập trung ngọn lửa đấu tranh vào chúng'. Khẩu hiệu được đề ra là 'Dân tộc trên hết, Tổ quốc trên hết'. Nhiệm vụ chủ yếu là củng cố chính quyền, chống Pháp, bài trừ nội phản, và cải thiện đời sống nhân dân.",
      },
      { type: "highlight-normal", content: "Xây dựng nền tảng pháp lý" },
      {
        type: "paragraph",
        content:
          "Ngày 6-1-1946, tổ chức thành công Tổng tuyển cử bầu Quốc hội khóa I theo hình thức phổ thông đầu phiếu. Bầu cử đã làm thất bại âm mưu chia rẽ, lật đổ của các kẻ thù.",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-den-bau-cu-pho-hang-voi.png",
        alt: "Chủ tịch Hồ Chí Minh đi bầu cử",
        caption:
          "Chủ tịch Hồ Chí Minh đến bầu cử tại nhà số 10, phố Hàng Vôi, Hà Nội",
      },
      {
        type: "paragraph",
        content:
          "Quốc hội khóa I đã thông qua bản Hiến pháp đầu tiên của Nhà nước VNDCCH (Hiến pháp năm 1946) (tại kỳ họp thứ 2, 9-11-1946).",
      },
      {
        type: "image",
        src: "/images/bac-ho-coi-trong-cong-tac-tuyen-truyen.png",
        alt: "Bác Hồ và công tác tuyên truyền",
        caption: "Bác Hồ luôn coi trọng công tác tuyên truyền cách mạng",
      },
      {
        type: "highlight",
        content: "3. Đấu tranh ngoại giao và chuẩn bị kháng chiến",
      },
      { type: "highlight-normal", content: "Chiến sự ở Nam Bộ" },
      {
        type: "paragraph",
        content:
          "Quân và dân Nam Bộ đã đứng lên kháng chiến chống xâm lược Pháp ngay từ cuối tháng 9-1945, nêu cao tinh thần 'thà chết tự do còn hơn sống nô lệ'. Chính phủ Hồ Chí Minh kịp thời chi viện, và Hồ Chí Minh đã tặng nhân dân Nam Bộ danh hiệu 'Thành đồng Tổ quốc'.",
      },
      { type: "highlight-normal", content: "Sách lược 'Hòa để tiến'" },
      {
        type: "paragraph",
        content:
          "Trước âm mưu của Pháp và Tưởng, Thường vụ Trung ương Đảng ra Chỉ thị Tình hình và chủ trương (3-3-1946), chủ trương tạm thời 'dàn hòa với Pháp' để diệt bọn phản động tay sai Tàu trắng, thúc đẩy nhanh quân Tưởng về nước, bớt đi một kẻ thù.",
      },
      { type: "highlight-normal", content: "Hiệp định sơ bộ và Tạm ước" },
      {
        type: "paragraph",
        content:
          "Ngày 6-3-1946, Hồ Chí Minh ký Hiệp định sơ bộ với Pháp, Pháp công nhận Việt Nam là một quốc gia tự do trong Liên hiệp Pháp. Sau đó, Hồ Chí Minh ký Tạm ước 14-9-1946 tại Pháp, nhằm tranh thủ thời gian hòa hoãn.",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-ky-hiep-dinh-so-bo-6-3-1946.jpg",
        alt: "Ký Hiệp định sơ bộ 6-3-1946",
        caption:
          "Chủ tịch Hồ Chí Minh và đại diện nước Pháp ký Hiệp định sơ bộ 6-3-1946",
      },
      {
        type: "image",
        src: "/images/ho-chu-tich-jean-sainteny-le-ky-hiep-dinh-so-bo-6-3-1946.jpg",
        alt: "Lễ ký Hiệp định sơ bộ",
        caption:
          "Hồ Chủ tịch và Jean Sainteny cùng các vị dự lễ ký Hiệp định sơ bộ 6-3-1946 tại 38 Lý Thái Tổ, Hà Nội",
      },
      { type: "highlight-normal", content: "Chỉ thị Hòa để tiến (9-3-1946)" },
      {
        type: "paragraph",
        content:
          "Ngay sau khi ký Hiệp định sơ bộ, Đảng ra Chỉ thị, nhấn mạnh cần phải tiếp tục nêu cao tinh thần cảnh giác cách mạng, không ngừng một phút công việc sửa soạn, sẵn sàng kháng chiến bất cứ lúc nào.",
      },
      { type: "highlight-normal", content: "Chuẩn bị" },
      {
        type: "paragraph",
        content:
          "Đến tháng 12-1946, số lượng đảng viên tăng lên hơn 20.000 người. Sách lược đúng đắn của Đảng đã tạo thêm thời gian hòa bình, hòa hoãn, tranh thủ xây dựng thực lực, chuẩn bị sẵn sàng cho cuộc kháng chiến lâu dài.",
      },
      {
        type: "image",
        src: "/images/bac-ho-day-chu-binh-dan-hoc-vu-1.jpg",
        alt: "Bác Hồ dạy Bình dân học vụ",
        caption: "Bác Hồ trực tiếp dạy chữ cho một lớp Bình dân học vụ",
      },
    ],
  },
  {
    year: "Cuối 1946 – 1947",
    title: "Kháng chiến toàn quốc và Chiến dịch Việt Bắc",
    slug: "khang-chien-bung-no",
    description:
      "Giai đoạn này mở đầu bằng sự bùng nổ của cuộc kháng chiến toàn quốc.",
    richContent: [
      { type: "highlight", content: "1. Bùng nổ Kháng chiến (12-1946)" },
      { type: "highlight-normal", content: "Quyết định" },
      {
        type: "paragraph",
        content:
          "Trước sự khiêu khích, gây hấn và tối hậu thư của Pháp, ngày 18-12-1946, Ban Thường vụ Trung ương Đảng quyết định phát động toàn dân kháng chiến.",
      },
      { type: "highlight-normal", content: "Lời kêu gọi (19-12-1946)" },
      {
        type: "quote",
        content:
          "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ.",
        author: "Chủ tịch Hồ Chí Minh",
      },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến, khẳng định quyết tâm của dân tộc.",
      },
      {
        type: "image",
        src: "/images/loi-keu-goi-toan-quoc-khang-chien.jpg",
        alt: "Lời kêu gọi toàn quốc kháng chiến",
        caption: "Lời kêu gọi toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh",
      },
      { type: "highlight-normal", content: "Mở đầu" },
      {
        type: "paragraph",
        content:
          "Bắt đầu từ 20 giờ ngày 19-12-1946, quân và dân Hà Nội và các đô thị từ Bắc vĩ tuyến 16 trở ra đồng loạt nổ súng.",
      },
      {
        type: "image",
        src: "/images/phat-lenh-toan-quoc-khang-chien-ha-noi.jpg",
        alt: "Phát lệnh toàn quốc kháng chiến",
        caption:
          "Phát lệnh toàn quốc kháng chiến tại các cửa ngõ Thủ đô Hà Nội",
      },
      {
        type: "image",
        src: "/images/quan-dan-ha-noi-san-sang-chien-dau-12-1946.jpg",
        alt: "Quân dân Hà Nội sẵn sàng chiến đấu",
        caption: "Quân dân Hà Nội sẵn sàng chiến đấu, tháng 12-1946",
      },
      { type: "highlight-normal", content: "Trận chiến ở Hà Nội" },
      {
        type: "paragraph",
        content:
          "Diễn ra 60 ngày đêm khói lửa (từ 19-12-1946 đến 17-2-1947), thành công trong việc giam chân địch, bảo vệ an toàn các cơ quan đầu não và nhân dân rút ra ngoại thành, bước đầu làm thất bại kế hoạch đánh nhanh thắng nhanh của Pháp.",
      },
      { type: "highlight", content: "2. Đường lối Kháng chiến" },
      {
        type: "paragraph",
        content:
          "Đường lối kháng chiến được Đảng xác định là toàn dân, toàn diện, lâu dài và dựa vào sức mình là chính.",
      },
      { type: "highlight-normal", content: "Kháng chiến toàn dân" },
      {
        type: "paragraph",
        content:
          "Huy động toàn bộ sức dân, tài dân, lực dân, với Quân đội nhân dân làm nòng cốt.",
      },
      { type: "highlight-normal", content: "Kháng chiến toàn diện" },
      {
        type: "paragraph",
        content:
          "Đánh địch trên mọi lĩnh vực: quân sự, chính trị, kinh tế, văn hóa, tư tưởng, ngoại giao; trong đó, đấu tranh vũ trang giữ vai trò mũi nhọn, mang tính quyết định.",
      },
      {
        type: "highlight-normal",
        content: "Kháng chiến lâu dài (Trường kỳ kháng chiến)",
      },
      {
        type: "paragraph",
        content:
          "Là tư tưởng chỉ đạo chiến lược nhằm vừa đánh tiêu hao lực lượng địch vừa xây dựng, phát triển lực lượng ta; lấy thời gian để chuyển hóa yếu thành mạnh.",
      },
      { type: "highlight-normal", content: "Dựa vào sức mình là chính" },
      {
        type: "paragraph",
        content:
          "Lấy nguồn nội lực, sức mạnh vật chất, tinh thần của nhân dân làm chỗ dựa chủ yếu, đồng thời tranh thủ sự ủng hộ của quốc tế khi có điều kiện.",
      },
      { type: "highlight", content: "3. Chiến dịch Việt Bắc (Thu Đông 1947)" },
      { type: "highlight-normal", content: "Âm mưu Pháp" },
      {
        type: "paragraph",
        content:
          "Pháp mở cuộc tấn công quy mô lớn lên vùng ATK Việt Bắc, nhằm bắt gọn Chính phủ Hồ Chí Minh và tiêu diệt cơ quan đầu não kháng chiến.",
      },
      {
        type: "image",
        src: "/images/bo-doi-qua-song-lo-chien-dich-viet-bac-1947.jpg",
        alt: "Bộ đội qua sông Lô",
        caption:
          "Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947",
      },
      {
        type: "image",
        src: "/images/chien-si-phao-binh-chien-dich-viet-bac-1947.jpg",
        alt: "Chiến sĩ pháo binh",
        caption:
          "Các chiến sĩ pháo binh trong Chiến dịch Việt Bắc Thu-Đông, năm 1947",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-nghe-bao-cao-chien-dich-viet-bac-1947.jpg",
        alt: "Bác Hồ nghe báo cáo Chiến dịch Việt Bắc",
        caption:
          "Chủ tịch Hồ Chí Minh và Hội đồng Chính phủ nghe Đại tướng Võ Nguyên Giáp báo cáo tình hình Chiến dịch Việt Bắc Thu - Đông 1947",
        layout: "wide",
      },
      { type: "highlight-normal", content: "Kết quả" },
      {
        type: "paragraph",
        content:
          "Quân và dân ta đã bảo toàn được cơ quan đầu não và căn cứ địa kháng chiến, đánh bại âm mưu, kế hoạch đánh nhanh, thắng nhanh của thực dân Pháp.",
      },
    ],
  },
  {
    year: "1948 – 1950",
    title: "Chuyển sang tiến công và Chiến thắng Biên giới",
    slug: "xay-dung-luc-luong",
    description:
      "Giai đoạn Đảng lãnh đạo đẩy mạnh kháng chiến toàn diện và giành chiến thắng quân sự quan trọng.",
    richContent: [
      { type: "highlight-normal", content: "Phát triển lực lượng" },
      {
        type: "paragraph",
        content:
          "Đầu năm 1948, Chủ tịch Hồ Chí Minh ký Sắc lệnh phong quân hàm Đại tướng cho đồng chí Võ Nguyên Giáp.",
      },
      {
        type: "image",
        src: "/images/bac-ho-cung-chien-si-cach-mang-viet-bac.jpg",
        alt: "Bác Hồ tại căn cứ địa Việt Bắc",
        caption: "Bác Hồ cùng các chiến sĩ cách mạng tại căn cứ địa Việt Bắc",
      },
      {
        type: "image",
        src: "/images/bac-ho-cham-soc-ngo-chien-khu-viet-bac.jpg",
        alt: "Bác Hồ chăm sóc ngô",
        caption: "Bác chăm sóc ngô trong vườn ở chiến khu Việt Bắc",
      },
      { type: "highlight-normal", content: "Thi đua Ái quốc" },
      {
        type: "paragraph",
        content:
          "Chủ tịch Hồ Chí Minh ra Lời kêu gọi Thi đua ái quốc (11-6-1948) để thúc đẩy sản xuất và tự cấp, tự túc hàng hóa cần thiết cho kháng chiến.",
      },
      { type: "highlight-normal", content: "Ngoại giao và Hậu phương" },
      {
        type: "paragraph",
        content:
          "Hội nghị Văn hóa toàn quốc (7-1948) nhất trí thông qua đường lối xây dựng nền văn hóa mới mang tính chất dân tộc, khoa học, đại chúng.",
      },
      {
        type: "highlight",
        content: "Biến đổi Quốc tế và sự Can thiệp của Mỹ",
      },
      {
        type: "paragraph",
        content:
          "Sau khi Cộng hòa Nhân dân Trung Hoa ra đời (1-10-1949), Việt Nam nhận được sự công nhận và đặt quan hệ ngoại giao từ Trung Quốc (18-1-1950), Liên Xô (30-1-1950) và các nước xã hội chủ nghĩa khác. Sự kiện này mở ra con đường liên lạc quốc tế cho Việt Nam. Mỹ bắt đầu can thiệp sâu vào chiến tranh ở Việt Nam, viện trợ cho Pháp.",
      },
      { type: "highlight", content: "Chiến dịch Biên giới Thu Đông 1950" },
      { type: "highlight-normal", content: "Mục tiêu" },
      {
        type: "paragraph",
        content:
          "Tiêu diệt sinh lực địch, mở rộng căn cứ địa Việt Bắc, khai thông hành lang liên lạc quốc tế.",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-chu-truong-mo-chien-dich-bien-gioi-6-1950.jpg",
        alt: "Bác Hồ chủ trương mở chiến dịch Biên giới",
        caption:
          "Tháng 6-1950, Chủ tịch Hồ Chí Minh cùng Thường vụ Trung ương Đảng chủ trương mở chiến dịch lớn đánh địch trên tuyến biên giới Việt-Trung",
        layout: "wide",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-dai-tuong-vo-nguyen-giap-ban-ke-hoach-bien-gioi-1950.jpg",
        alt: "Bác Hồ và Đại tướng Võ Nguyên Giáp",
        caption:
          "Chủ tịch Hồ Chí Minh và Đại tướng, Tổng tư lệnh Võ Nguyên Giáp bàn kế hoạch tác chiến Chiến dịch Biên giới năm 1950",
        layout: "wide",
      },
      {
        type: "image",
        src: "/images/dai-tuong-vo-nguyen-giap-chu-tich-ho-chi-minh-ban-ke-hoach-8-1950.jpg",
        alt: "Bàn kế hoạch tác chiến",
        caption:
          "Đại tướng Võ Nguyên Giáp và Chủ tịch Hồ Chí Minh bàn kế hoạch tác chiến với các sĩ quan quân đội trong chiến dịch vào hạ tuần tháng 8-1950",
        layout: "wide",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-dai-quan-sat-dong-khe-16-9-1950.jpg",
        alt: "Bác Hồ trên đài quan sát",
        caption:
          "Chủ tịch Hồ Chí Minh trên đài quan sát mặt trận Đông Khê, Chiến dịch Biên giới, ngày 16-9-1950",
      },
      {
        type: "image",
        src: "/images/bo-doi-giai-phong-dong-khe.jpg",
        alt: "Bộ đội giải phóng Đông Khê",
        caption: "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê",
      },
      { type: "highlight-normal", content: "Ý nghĩa" },
      {
        type: "paragraph",
        content:
          "Chiến thắng Biên giới giành được thắng lợi to lớn, kết thúc thời kỳ chiến đấu trong vòng vây, đánh dấu bước phát triển mới, đưa cuộc kháng chiến chuyển sang giai đoạn phát triển cao hơn.",
      },
    ],
  },
  {
    year: "1951 – 1953",
    title: "Đảng ra công khai, Chính cương và Cải cách Ruộng đất",
    slug: "cung-co-duong-loi",
    description:
      "Giai đoạn Đảng củng cố toàn diện cả về đường lối chính trị, tổ chức và hậu phương để chuẩn bị cho thắng lợi quyết định.",
    richContent: [
      { type: "highlight", content: "1. Đại hội Đảng lần thứ II (2-1951)" },
      {
        type: "image",
        src: "/images/toan-canh-dai-hoi-lan-thu-ii-cua-dang.jpg",
        alt: "Toàn cảnh Đại hội lần thứ II",
        caption: "Toàn cảnh Đại hội lần thứ II của Đảng",
        layout: "wide",
      },
      {
        type: "image",
        src: "/images/cac-dai-bieu-du-dai-hoi-dang-lan-thu-ii.jpg",
        alt: "Các đại biểu dự Đại hội",
        caption: "Các đại biểu dự Đại hội Đảng toàn quốc lần thứ II",
      },
      {
        type: "image",
        src: "/images/chu-tich-ho-chi-minh-tong-bi-thu-truong-chinh-trao-doi-dai-hoi-ii.jpg",
        alt: "Bác Hồ và Tổng Bí thư Trường Chinh",
        caption:
          "Chủ tịch Hồ Chí Minh và Tổng Bí thư Trường Chinh trao đổi về những văn kiện Đại hội II",
      },
      {
        type: "image",
        src: "/images/cac-dai-bieu-mung-dai-hoi-thanh-cong.jpg",
        alt: "Đại biểu mừng Đại hội",
        caption: "Các đại biểu mừng Đại hội thành công",
      },
      { type: "highlight-normal", content: "Tên Đảng" },
      {
        type: "paragraph",
        content:
          "Đảng ra hoạt động công khai dưới tên gọi Đảng Lao động Việt Nam.",
      },
      {
        type: "highlight-normal",
        content: "Chính cương của Đảng Lao động Việt Nam",
      },
      {
        type: "paragraph",
        content:
          "Được thông qua, xác định tính chất xã hội Việt Nam lúc này có 3 tính chất: 'dân chủ nhân dân, một phần thuộc địa và nửa phong kiến'.",
      },
      { type: "highlight-normal", content: "Đối tượng đấu tranh chính" },
      {
        type: "paragraph",
        content:
          "Chủ nghĩa đế quốc xâm lược Pháp và can thiệp Mỹ, và phong kiến phản động.",
      },
      { type: "highlight-normal", content: "Nhiệm vụ chính" },
      {
        type: "paragraph",
        content:
          "Tập trung đấu tranh chống xâm lược, hoàn thành công cuộc giải phóng dân tộc.",
      },
      { type: "highlight-normal", content: "Lãnh đạo" },
      {
        type: "paragraph",
        content:
          "Hồ Chí Minh được bầu làm Chủ tịch Đảng, Trường Chinh được bầu lại làm Tổng Bí thư. Đại hội II là 'Đại hội kháng chiến kiến quốc'.",
      },
      {
        type: "highlight",
        content: "2. Củng cố hậu phương và Cải cách Ruộng đất",
      },
      { type: "highlight-normal", content: "Chỉnh Đảng, Chỉnh quân" },
      {
        type: "paragraph",
        content:
          "Hội nghị Trung ương lần thứ ba (4-1952) đề ra quyết sách lớn về công tác 'chỉnh Đảng, chỉnh quân', xác định đây là nhiệm vụ trọng tâm.",
      },
      { type: "highlight-normal", content: "Cải cách Ruộng đất" },
      {
        type: "paragraph",
        content:
          "Ngày 19-12-1953, Chủ tịch Hồ Chí Minh ký ban hành sắc lệnh Luật cải cách ruộng đất. Chủ trương này nhằm triệt để giảm tô, giảm tức và tiến hành cải cách ruộng đất, thực hiện người cầy có ruộng, nâng cao quyền lợi kinh tế và chính trị của người nông dân.",
      },
      {
        type: "image",
        src: "/images/cai-cach-ruong-dat-nong-dan-dot-van-tu-cu.jpg",
        alt: "Cải cách ruộng đất",
        caption: "Cải cách ruộng đất hoàn tất, nông dân đốt văn tự cũ",
      },
      {
        type: "paragraph",
        content:
          "Chủ trương này đã tạo ra chuyển biến lớn về kinh tế, chính trị ở nông thôn, thúc đẩy sức sản xuất phát triển, và tăng thêm quyết tâm giết giặc, lập công cho bộ đội nơi tiền tuyến.",
      },
    ],
  },
  {
    year: "1954",
    title: "Chiến thắng Điện Biên Phủ và Hiệp định Genève",
    slug: "chien-thang",
    description:
      "Năm 1954 là năm quyết định thắng lợi của cuộc kháng chiến chống Pháp.",
    richContent: [
      { type: "highlight", content: "Chiến dịch Điện Biên Phủ" },
      { type: "highlight-normal", content: "Bối cảnh" },
      {
        type: "paragraph",
        content:
          "Pháp thực hiện Kế hoạch Navarre, xây dựng Điện Biên Phủ thành tập đoàn cứ điểm mạnh nhất Đông Dương.",
      },
      { type: "highlight-normal", content: "Quyết định" },
      {
        type: "paragraph",
        content:
          "Ngày 6-12-1953, Bộ Chính trị quyết định mở Chiến dịch Điện Biên Phủ.",
      },
      { type: "highlight-normal", content: "Chỉ đạo" },
      {
        type: "paragraph",
        content:
          "Đại tướng Võ Nguyên Giáp được giao làm Tư lệnh. Phương châm chiến dịch là 'đánh chắc, tiến chắc'.",
      },
      { type: "highlight-normal", content: "Chiến thắng" },
      {
        type: "paragraph",
        content:
          "Sau 56 ngày đêm, ngày 7-5-1954, quân đội ta giành chiến thắng, bắt sống tướng Đờ Cátơri. Chiến thắng này buộc Pháp phải đàm phán. Chiến thắng Điện Biên Phủ được ghi nhận là một chiến công vĩ đại của dân tộc Việt Nam, báo hiệu sự sụp đổ của chủ nghĩa thực dân.",
      },
      {
        type: "image",
        src: "/images/chien-thang-dien-bien-phu-1954.jpg",
        alt: "Mừng chiến thắng Điện Biên Phủ",
        caption:
          "Lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh được trang hoàng trên chiếc xe tăng thu được của địch diễu hành mừng chiến thắng tại Điện Biên Phủ, năm 1954",
        layout: "wide",
      },
      { type: "highlight", content: "Hiệp định Genève (21-7-1954)" },
      {
        type: "paragraph",
        content: "Hội nghị được tiến hành từ ngày 8-5-1954.",
      },
      {
        type: "paragraph",
        content:
          "Hiệp định chính thức chấm dứt chiến tranh, công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam, Lào, và Campuchia.",
      },
      {
        type: "paragraph",
        content:
          "Hiệp định đánh dấu kết thúc thắng lợi cuộc kháng chiến chống Pháp xâm lược và dẫn đến việc giải phóng hoàn toàn miền Bắc, tạo tiền đề cho miền Bắc quá độ lên chủ nghĩa xã hội, xây dựng miền Bắc thành hậu phương lớn.",
      },
      {
        type: "image",
        src: "/images/Hội nghị Geneve 1954 bàn về lập lại hòa bình ở Đông Dương.jpg",
        alt: "Hội nghị Genève 1954",
        caption: "Hội nghị Genève 1954 bàn về lập lại hòa bình ở Đông Dương",
        layout: "wide",
      },
      {
        type: "image",
        src: "/images/thu-truong-ta-quang-buu-ky-hiep-dinh-geneva-1954.jpg",
        alt: "Ký Hiệp định Geneva",
        caption:
          "Thứ trưởng Bộ Quốc phòng Tạ Quang Bửu (ngồi bên phải) thay mặt Chính phủ và Bộ Tổng tư lệnh QĐND Việt Nam ký Hiệp định Geneva, năm 1954",
      },
      { type: "highlight", content: "Kết luận chung (1945–1954)" },
      {
        type: "paragraph",
        content:
          "Dưới sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh, dân tộc Việt Nam đã giành độc lập, giữ vững chính quyền, xây dựng nền tảng chế độ mới và đánh bại thực dân Pháp.",
      },
      {
        type: "paragraph",
        content:
          "Đây là thập niên anh hùng, khẳng định đường lối cách mạng đúng đắn, sáng tạo, độc lập, tự chủ.",
      },
      { type: "highlight-normal", content: "Bài học lớn" },
      {
        type: "paragraph",
        content: "Kết hợp kháng chiến và kiến quốc.",
      },
      {
        type: "paragraph",
        content: "Phát huy sức mạnh toàn dân.",
      },
      {
        type: "paragraph",
        content: "Dựa vào nội lực, tranh thủ quốc tế.",
      },
      {
        type: "paragraph",
        content: "Kiên định mục tiêu độc lập dân tộc gắn với chủ nghĩa xã hội.",
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
