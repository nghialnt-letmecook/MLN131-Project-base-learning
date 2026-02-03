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
    year: "Phần I",
    title: "KHÁI NIỆM VÀ ĐẶC TRƯNG CỦA DÂN TỘC",
    slug: "khai-niem-dac-trung-dan-toc",
    description:
      "Quá trình hình thành dân tộc, hai nghĩa của khái niệm dân tộc và năm đặc trưng cơ bản về lãnh thổ, kinh tế, ngôn ngữ, văn hóa và nhà nước.",
    richContent: [
      {
        type: "highlight",
        content: "Tiến trình hình thành dân tộc",
      },
      {
        type: "paragraph",
        content:
          "Dân tộc là hình thức cộng đồng người cao nhất, phát triển sau các hình thức: thị tộc, bộ lạc và bộ tộc.",
      },
      {
        type: "highlight",
        content: "Hai tầng ý nghĩa của dân tộc",
      },
      {
        type: "highlight-normal",
        content: "1. Nghĩa rộng (Dân tộc - Quốc gia/Nation)",
      },
      {
        type: "paragraph",
        content:
          "Chỉ cộng đồng người ổn định làm thành nhân dân một nước, có lãnh thổ riêng, kinh tế thống nhất, ngôn ngữ chung và có ý thức về sự thống nhất quốc gia.",
      },
      {
        type: "image",
        src: "/images/buu-thiep-dan-toc.jpg",
        alt: "Minh họa khái niệm Dân tộc - Quốc gia",
        caption:
          "Ảnh: “Một tấm bưu thiếp từ năm 1916 cho thấy hình ảnh nhân cách hóa quốc gia của một số nước Đồng minh trong Thế chiến I, mỗi người cầm một lá cờ đại diện cho quốc gia của họ.”",
      },
      {
        type: "highlight-normal",
        content: "2. Nghĩa hẹp (Dân tộc - Tộc người/Ethnie)",
      },
      {
        type: "paragraph",
        content:
          "Chỉ các cộng đồng người có mối liên hệ chặt chẽ về nguồn gốc, ngôn ngữ, văn hóa và ý thức tự giác tộc người; đây là bộ phận cấu thành nên quốc gia.",
      },
      {
        type: "image",
        src: "/images/dan-toc-minh-hoa.jpg",
        alt: "Minh họa khái niệm Dân tộc - Tộc người",
        caption:
          "Ảnh: “Một nghệ sĩ biểu diễn mặc trang phục truyền thống trong lễ hội Quốc khánh ở Kuala Lumpur, Malaysia.”",
      },
      {
        type: "highlight",
        content: "5 Đặc trưng cốt lõi của Dân tộc (Quốc gia)",
      },
      {
        type: "highlight-normal",
        content: "1. Lãnh thổ",
      },
      {
        type: "paragraph",
        content:
          "Có một vùng đất, vùng trời, vùng biển ổn định, là không gian sinh tồn của cộng đồng.",
      },
      {
        type: "highlight-normal",
        content: "2. Kinh tế",
      },
      {
        type: "paragraph",
        content:
          "Có chung một phương thức sinh hoạt kinh tế, tạo ra sự gắn kết bền vững giữa các bộ phận trong dân tộc.",
      },
      {
        type: "highlight-normal",
        content: "3. Ngôn ngữ",
      },
      {
        type: "paragraph",
        content:
          "Sử dụng một ngôn ngữ chung làm công cụ giao tiếp chính trong mọi lĩnh vực đời sống.",
      },
      {
        type: "highlight-normal",
        content: "4. Văn hóa và tâm lý",
      },
      {
        type: "paragraph",
        content:
          "Có nền văn hóa và đặc điểm tâm lý chung, biểu hiện qua lối sống, phong tục và bản sắc riêng.",
      },
      {
        type: "highlight-normal",
        content: "5. Nhà nước",
      },
      {
        type: "paragraph",
        content:
          "Có một Nhà nước thống nhất quản lý, đại diện cho dân tộc trong quan hệ quốc tế.",
      },
      {
        type: "image",
        src: "/images/5-dac-trung.jpg",
        alt: "Minh họa đặc trưng Dân tộc Việt Nam",
        caption: "Ảnh: Minh họa 5 đặc trưng dân tộc. Nguồn: baochinhphu.vn",
      },
    ],
  },
  {
    year: "Phần II",
    title: "Hai Xu hướng Phát triển và Cương lĩnh Lênin",
    slug: "xu-huong-phat-trien",
    description:
      "Phân tích hai xu hướng phát triển dân tộc trong thời đại mới và nội dung cương lĩnh dân tộc của V.I. Lênin về bình đẳng, tự quyết và liên hiệp.",
    richContent: [
      {
        type: "highlight",
        content: "Hai xu hướng khách quan",
      },
      {
        type: "highlight-normal",
        content: "Xu hướng 1: Tách ra thành lập quốc gia độc lập",
      },
      {
        type: "paragraph",
        content:
          "Các cộng đồng dân cư muốn tách ra để thành lập các quốc gia độc lập nhằm thực hiện quyền tự quyết và giải phóng dân tộc.",
      },
      {
        type: "highlight-normal",
        content: "Xu hướng 2: Liên hiệp để mở rộng không gian phát triển",
      },
      {
        type: "paragraph",
        content:
          "Các dân tộc muốn liên hiệp lại để mở rộng không gian phát triển kinh tế, khoa học và công nghệ trong bối cảnh toàn cầu hóa.",
      },
      {
        type: "image",
        src: "/images/anh-minh-hoa-xu-huong.png",
        alt: "Minh họa hai xu hướng phát triển dân tộc",
        caption:
          "Ảnh: Minh họa hai xu hướng phát triển dân tộc. Nguồn: Internet",
      },
      {
        type: "highlight",
        content: "Cương lĩnh dân tộc của V.I. Lênin",
      },
      {
        type: "image",
        src: "/images/lenin.jpg",
        alt: "Chân dung V.I. Lênin",
        caption: "Ảnh: Chân dung V.I. Lênin.",
      },
      {
        type: "highlight-normal",
        content: "1. Các dân tộc hoàn toàn bình đẳng",
      },
      {
        type: "paragraph",
        content:
          "Xóa bỏ mọi đặc quyền hoặc sự áp bức giữa dân tộc lớn và dân tộc nhỏ.",
      },
      {
        type: "highlight-normal",
        content: "2. Các dân tộc được quyền tự quyết",
      },
      {
        type: "paragraph",
        content:
          "Quyền tự quyết định vận mệnh chính trị, con đường phát triển của mỗi dân tộc.",
      },
      {
        type: "highlight-normal",
        content: "3. Liên hiệp công nhân tất cả các dân tộc",
      },
      {
        type: "paragraph",
        content:
          "Đây là nội dung quan trọng nhất, tạo sức mạnh đoàn kết để giải quyết vấn đề dân tộc theo lập trường giai cấp công nhân.",
      },
      {
        type: "image",
        src: "/images/anh-minh-hoa-cuong-linh-Lenin.jpg",
        alt: "Minh họa cương lĩnh dân tộc của V.I. Lênin",
        caption:
          "Ảnh: Minh họa cương lĩnh dân tộc của V.I. Lênin: Các quốc gia, dân tộc trên Thế Giới. Nguồn: Internet",
      },
    ],
  },
  {
    year: "Phần III",
    title: "Đặc điểm và Chính sách Dân tộc ở Việt Nam",
    slug: "dac-diem-chinh-sach-dan-toc",
    description:
      "Làm rõ đặc điểm của 54 dân tộc Việt Nam và các chính sách của Đảng, Nhà nước nhằm bảo đảm bình đẳng, đoàn kết và phát triển bền vững.",
    richContent: [
      {
        type: "highlight",
        content: "6 Đặc điểm dân tộc Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "1. Chênh lệch số dân giữa các tộc người",
      },
      {
        type: "paragraph",
        content:
          "Có sự chênh lệch lớn về số dân giữa tộc người Kinh và 53 dân tộc thiểu số.",
      },
      {
        type: "image",
        src: "/images/54-dan-toc.jpg",
        alt: "Ảnh: “Năm mươi bốn nhóm dân tộc được mô tả bằng biểu tượng cảm xúc, kèm theo thông tin chi tiết về văn hóa”",
        caption:
          "Ảnh: “Năm mươi bốn nhóm dân tộc được mô tả bằng biểu tượng cảm xúc, kèm theo thông tin chi tiết về văn hóa”",
      },
      {
        type: "highlight-normal",
        content: "2. Cư trú xen kẽ nhau",
      },
      {
        type: "paragraph",
        content:
          "Các dân tộc cư trú xen kẽ nhau, không có vùng lãnh thổ riêng biệt tuyệt đối.",
      },

      {
        type: "highlight-normal",
        content: "3. Vị trí chiến lược quan trọng",
      },
      {
        type: "paragraph",
        content:
          "Dân tộc thiểu số phân bố chủ yếu ở địa bàn có vị trí chiến lược quan trọng về an ninh, biên giới.",
      },
      {
        type: "image",
        src: "/images/nguoi-HMong.jpg",
        alt: "Ảnh: “Chân dung người dân tộc H’Mông ở Sapa (Việt Nam) ",
        caption: "Ảnh: “Chân dung người dân tộc H’Mông ở Sapa (Việt Nam) ",
      },
      {
        type: "highlight-normal",
        content: "4. Trình độ phát triển không đồng đều",
      },
      {
        type: "paragraph",
        content:
          "Trình độ phát triển kinh tế - xã hội giữa các dân tộc không đồng đều.",
      },
      {
        type: "image",
        src: "/images/doi-song-lao-dong.jpg",
        alt: "Ảnh: “Đời sống và lao động của đồng bào các dân tộc — ảnh minh họa sinh hoạt cộng đồng.”",
        caption:
          "Ảnh: “Đời sống và lao động của đồng bào các dân tộc — ảnh minh họa sinh hoạt cộng đồng.”",
      },
      {
        type: "highlight-normal",
        content: "5. Truyền thống đoàn kết lâu đời",
      },

      {
        type: "paragraph",
        content:
          "Có truyền thống đoàn kết lâu đời trong quá trình dựng nước và giữ nước.",
      },
      {
        type: "image",
        src: "/images/hinh-anh-dan-toc-doan-ket.jpg",
        alt: "Ảnh: Minh họa về truyền thống đoàn kết dân tộc Việt Nam",
        caption: "Ảnh: Minh họa về truyền thống đoàn kết dân tộc Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "6. Bản sắc văn hóa đa dạng",
      },
      {
        type: "image",
        src: "/images/trang-phuc-truyen-thong.jpg",
        alt: "Ảnh: “Người các dân tộc thiểu số ở Việt Nam — trang phục truyền thống và văn hoá đặc trưng của nhiều dân tộc khác nhau.”",
        caption:
          "Ảnh: “Người các dân tộc thiểu số ở Việt Nam — trang phục truyền thống và văn hoá đặc trưng của nhiều dân tộc khác nhau.”",
      },
      {
        type: "paragraph",
        content:
          "Mỗi dân tộc đều có bản sắc văn hóa riêng, tạo nên sự đa dạng của nền văn hóa Việt Nam thống nhất.",
      },
      {
        type: "highlight",
        content: "Chính sách của Đảng và Nhà nước",
      },
      {
        type: "highlight-normal",
        content: "1. Nguyên tắc bình đẳng và đoàn kết",
      },
      {
        type: "paragraph",
        content:
          "Thực hiện bình đẳng, đoàn kết, tương trợ và giúp nhau cùng phát triển.",
      },
      {
        type: "image",
        src: "/images/nha-nuoc-doan-ket.jpg",
        alt: "Ảnh: Minh họa về truyền thống đoàn kết dân tộc Việt Nam",
        caption: "Ảnh: Minh họa về bình đẳng, đoàn kết dân tộc Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "2. Ưu tiên đầu tư phát triển",
      },
      {
        type: "paragraph",
        content:
          "Ưu tiên đầu tư phát triển kinh tế - xã hội cho các vùng dân tộc thiểu số và miền núi.",
      },
      {
        type: "image",
        src: "/images/phat-trien-ktxh.jpg",
        alt: "Ảnh: Minh họa về ưu tiên đầu tư phát triển kinh tế - xã hội cho các vùng dân tộc thiểu số và miền núi.",
        caption:
          "Ảnh: Minh họa về ưu tiên đầu tư phát triển kinh tế - xã hội cho các vùng dân tộc thiểu số và miền núi.",
      },
      {
        type: "highlight-normal",
        content: "3. Bảo tồn và phát huy văn hóa",
      },
      {
        type: "paragraph",
        content:
          "Bảo tồn và phát huy các giá trị văn hóa truyền thống tốt đẹp của các tộc người.",
      },
      {
        type: "image",
        src: "/images/nhom-nhac-vung-cao.jpg",
        alt: "Ảnh: “Nhóm nhạc dân tộc thiểu số biểu diễn trong lễ hội văn hóa truyền thống.”",
        caption:
          "Ảnh: “Nhóm nhạc của dân tộc thiểu số vùng cao — biểu diễn văn hoá, âm nhạc truyền thống.”",
      },
    ],
  },
  {
    year: "Phần IV",
    title: "Bản chất, Nguồn gốc và Tính chất của Tôn giáo",
    slug: "ban-chat-nguon-goc",
    description:
      "Giải thích bản chất của tôn giáo, các nguồn gốc hình thành và những tính chất cơ bản trong đời sống xã hội.",
    richContent: [
      {
        type: "highlight",
        content: "Bản chất của Tôn giáo",
      },
      {
        type: "paragraph",
        content:
          "Tôn giáo là một hình thái ý thức xã hội phản ánh hư ảo thực tại khách quan; là một thực thể xã hội có niềm tin, hệ thống tổ chức và tín đồ.",
      },
      {
        type: "image",
        src: "/images/anh-minh-hoa-ton-giao.jpg",
        alt: "Minh họa bản chất của Tôn giáo",
        caption: "Ảnh: Minh họa Tôn giáo. Nguồn: Internet",
      },
      {
        type: "highlight",
        content: "Phân biệt các khái niệm liên quan",
      },
      {
        type: "highlight-normal",
        content: "Tín ngưỡng",
      },
      {
        type: "paragraph",
        content: "Niềm tin và sự ngưỡng mộ vào một cái gì đó linh thiêng.",
      },
      {
        type: "image",
        src: "/images/tin-nguong-dan-gian.jpg",
        alt: "Ảnh: Tín ngưỡng thờ Thành Hoàng làng là một nét đẹp trong văn hóa người Việt",
        caption:
          "Ảnh: Tín ngưỡng thờ Thành Hoàng làng là một nét đẹp trong văn hóa người Việt",
      },
      {
        type: "highlight-normal",
        content: "Mê tín",
      },
      {
        type: "paragraph",
        content: "Niềm tin mê muội, viển vông, không dựa trên cơ sở khoa học.",
      },
      {
        type: "highlight-normal",
        content: "Mê tín dị đoan",
      },
      {
        type: "paragraph",
        content:
          "Niềm tin cực đoan vào các lực lượng siêu nhiên đến mức mê muội, gây hậu quả tiêu cực cho xã hội.",
      },
      {
        type: "image",
        src: "/images/Hoi-Thanh-Duc-Chua-T.jpeg",
        alt: "Ảnh: Một buổi truyền đạo của Hội Thánh Đức Chúa Trời Mẹ tại Việt Nam",
        caption:
          "Ảnh: Bộ Nội vụ yêu cầu kiên quyết đấu tranh, xóa bỏ tổ chức của Hội thánh của Đức Chúa Trời Mẹ. Ảnh: Văn Trực. Nguồn: Báo Lao Động",
      },
      {
        type: "highlight",
        content: "3 Nguồn gốc của Tôn giáo",
      },
      {
        type: "highlight-normal",
        content: "1. Nguồn gốc tự nhiên, kinh tế - xã hội",
      },
      {
        type: "paragraph",
        content:
          "Do sự bất lực trước thiên tai và sự áp bức, bất công của xã hội cũ.",
      },
      {
        type: "highlight-normal",
        content: "2. Nguồn gốc nhận thức",
      },
      {
        type: "paragraph",
        content:
          "Do giới hạn của tri thức con người trước những hiện tượng bí ẩn.",
      },
      {
        type: "highlight-normal",
        content: "3. Nguồn gốc tâm lý",
      },
      {
        type: "paragraph",
        content:
          "Nỗi sợ hãi hoặc mong muốn được che chở trước các rủi ro trong cuộc sống.",
      },
      {
        type: "highlight",
        content: "3 Tính chất của Tôn giáo",
      },
      {
        type: "highlight-normal",
        content: "1. Tính lịch sử",
      },
      {
        type: "paragraph",
        content: "Có sinh ra và có mất đi.",
      },
      {
        type: "highlight-normal",
        content: "2. Tính quần chúng",
      },
      {
        type: "paragraph",
        content: "Là nhu cầu tinh thần của nhiều người.",
      },
      {
        type: "highlight-normal",
        content: "3. Tính chính trị",
      },
      {
        type: "paragraph",
        content: "Dễ bị lợi dụng vào mục đích xấu.",
      },
    ],
  },
  {
    year: "Phần V",
    title: "Đặc điểm và Chính sách Tôn giáo ở Việt Nam",
    slug: "dac-diem-chinh-sach-ton-giao",
    description:
      "Trình bày thực trạng tôn giáo ở Việt Nam và chính sách của Nhà nước trong việc bảo đảm quyền tự do tín ngưỡng, tôn giáo.",
    richContent: [
      {
        type: "highlight",
        content: "Đặc điểm Tôn giáo ở Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "Quốc gia đa tôn giáo",
      },
      {
        type: "paragraph",
        content:
          "Việt Nam là một quốc gia có nhiều tôn giáo: Hiện nay, nước ta có 13 tôn giáo đã được công nhận tư cách pháp nhân (như Phật giáo, Công giáo, Tin lành, Cao Đài, Hòa Hảo, Hồi giáo...). Về quy mô, có hơn 40 tổ chức tôn giáo được công nhận hoặc đăng ký hoạt động với khoảng 24 triệu tín đồ (chiếm khoảng 27% dân số), 95.000 chức sắc, 200.000 chức việc và hơn 23.250 cơ sở thờ tự.",
      },
      {
        type: "highlight-normal",
        content: "Tính chất chung sống hòa bình",
      },
      {
        type: "paragraph",
        content:
          "Việt Nam là nơi giao lưu của nhiều luồng văn hóa thế giới, tạo nên sự phong phú về nguồn gốc và truyền thống lịch sử của các tôn giáo. Các tôn giáo cùng tồn tại và phát triển trên một địa bàn cư trú, giữa họ có sự tôn trọng niềm tin của nhau và chưa từng xảy ra xung đột hay chiến tranh tôn giáo lớn. Thực tế cho thấy không có tôn giáo nào du nhập vào Việt Nam mà không mang dấu ấn hoặc chịu ảnh hưởng của bản sắc văn hóa dân tộc.",
      },
      {
        type: "image",
        src: "/images/den-buu-long.jpg",
        alt: "Ảnh: “Đền Bửu Long ở Thành phố Hồ Chí Minh — minh hoạ sự đa dạng tôn giáo và tín ngưỡng ở Việt Nam, nơi nhiều đạo cùng tồn tại.”",
        caption:
          "Ảnh: “Đền Bửu Long ở Thành phố Hồ Chí Minh — minh hoạ sự đa dạng tôn giáo và tín ngưỡng ở Việt Nam, nơi nhiều đạo cùng tồn tại.”",
      },
      {
        type: "highlight-normal",
        content: "Tín đồ yêu nước",
      },
      {
        type: "paragraph",
        content:
          "Đa số các tín đồ tôn giáo đều có lòng nồng nàn yêu nước, tinh thần chống ngoại xâm và tôn trọng công lý. Trong các giai đoạn lịch sử, đồng bào có đạo đã cùng các tầng lớp nhân dân khác đóng góp to lớn vào sự nghiệp giải phóng và xây dựng Tổ quốc",
      },
      {
        type: "image",
        src: "/images/chua-long-son.jpg",
        alt: "Ảnh: “Chùa Long Sơn, Nha Trang — biểu tượng tôn giáo gắn liền với đời sống tinh thần của người dân lao động.”",
        caption:
          "Ảnh: “Chùa Long Sơn, Nha Trang — biểu tượng tôn giáo gắn liền với đời sống tinh thần của người dân lao động.”",
      },
      {
        type: "highlight-normal",
        content: "Vai trò chức sắc",
      },
      {
        type: "paragraph",
        content:
          "Chức sắc các tôn giáo có vai trò, vị trí quan trọng trong giáo hội, có uy tín và ảnh hưởng lớn đến tâm lý, hành vi của tín đồ. Đồng thời, các tôn giáo ở Việt Nam đều có mối quan hệ rộng rãi với các tổ chức và cá nhân tôn giáo ở nước ngoài",
      },
      {
        type: "image",
        src: "/images/tong-bi-thu-gap-chuc-sac.webp",
        alt: "Ảnh: “Chủ tịch nước Tô Lâm gặp mặt đoàn đại biểu chức sắc tôn giáo ",
        caption:
          "Ảnh: “Chủ tịch nước Tô Lâm gặp mặt đoàn đại biểu chức sắc tôn giáo ",
      },
      {
        type: "highlight",
        content: "Chính sách của Việt Nam hiện nay",
      },
      {
        type: "highlight-normal",
        content: "Bảo đảm quyền tự do tín ngưỡng",
      },
      {
        type: "paragraph",
        content:
          "Đảng và Nhà nước xác định tín ngưỡng, tôn giáo là nhu cầu tinh thần của một bộ phận nhân dân, sẽ tồn tại cùng dân tộc trong quá trình xây dựng chủ nghĩa xã hội. Mọi công dân đều có quyền tự do theo hoặc không theo một tôn giáo nào; các tổ chức tôn giáo hợp pháp được hoạt động theo pháp luật và được pháp luật bảo hộ",
      },
      {
        type: "image",
        src: "/images/tu-do-tin-nguong.jpg",
        alt: "Ảnh: Quang cảnh Đại lễ Phật đản Phật lịch 2568 tại Việt Nam Quốc tự. (Ảnh: TTXVN)",
        caption:
          "Ảnh: Quang cảnh Đại lễ Phật đản Phật lịch 2568 tại Việt Nam Quốc tự. (Ảnh: TTXVN)",
      },
      {
        type: "highlight-normal",
        content: "Đoàn kết trong khối đại đoàn kết dân tộc và ",
      },
      {
        type: "paragraph",
        content:
          " Đây là nội dung trọng tâm nhằm đoàn kết đồng bào có đạo và đồng bào không có đạo, tập hợp mọi thành viên trong xã hội cùng phấn đấu cho mục tiêu 'dân giàu, nước mạnh, dân chủ, công bằng, văn minh'. Tuyệt đối không phân biệt đối xử vì lý do tín ngưỡng, tôn giáo",
      },
      {
        type: "highlight-normal",
        content: "Trách nhiệm toàn hệ thống chính trị",
      },
      {
        type: "paragraph",
        content:
          "Công tác tôn giáo không phải nhiệm vụ riêng lẻ của bất kỳ tổ chức nào mà là trách nhiệm của toàn bộ hệ thống chính trị do Đảng lãnh đạo",
      },
      {
        type: "highlight-normal",
        content: "Nghiêm cấm lợi dụng tôn giáo",
      },
      {
        type: "paragraph",
        content:
          "Mọi hoạt động tôn giáo phải tuân thủ Hiến pháp và pháp luật, đặc biệt là Luật Tín ngưỡng, Tôn giáo năm 2016. Nhà nước nghiêm cấm lợi dụng tôn giáo để tuyên truyền tà đạo, hoạt động mê tín dị đoan, ép buộc người dân theo đạo hoặc kích động chia rẽ dân tộc, chống phá Nhà nước. Các hành vi vi phạm pháp luật dưới danh nghĩa tôn giáo đều bị xử lý nghiêm minh",
      },
      {
        type: "image",
        src: "/images/loi-dung-ton-giao.jpg",
        alt: "Ảnh: Lợi dụng tôn giáo.",
        caption: "Ảnh: Lợi dụng tôn giáo, chia rẽ đoàn kết dân tộc. Nguồn: VTV",
      },
    ],
  },
  {
    year: "Phần VI",
    title: "Đặc điểm Quan hệ Dân tộc – Tôn giáo",
    slug: "dac-diem-quan-he",
    description:
      "Phân tích mối quan hệ gắn bó giữa dân tộc và tôn giáo, vai trò của tín ngưỡng truyền thống và tinh thần chung sống hòa bình.",
    richContent: [
      {
        type: "paragraph",
        content:
          "Mối quan hệ giữa dân tộc và tôn giáo ở nước ta không chỉ là sự tồn tại song song mà là sự đan xen, tác động qua lại sâu sắc, quyết định đến sự ổn định chính trị và phát triển xã hội.",
      },
      {
        type: "highlight",
        content: "Đặc điểm cốt lõi của mối quan hệ dân tộc và tôn giáo",
      },
      {
        type: "highlight-normal",
        content: '1. Sự gắn bó mật thiết "Gắn đạo với đời"',
      },
      {
        type: "paragraph",
        content:
          'Ở Việt Nam, các tôn giáo có truyền thống đồng hành cùng dân tộc trong mọi giai đoạn lịch sử. Đa số tín đồ là nhân dân lao động, họ vừa có lòng nồng nàn yêu nước, vừa có niềm tin tôn giáo sâu sắc, luôn thực hiện phương châm "tốt đời, đẹp đạo".',
      },
      {
        type: "image",
        src: "/images/tot-doi-dep-dao.jpg",
        alt: "Ảnh: Minh họa phương châm ''Tốt đời, đẹp đạo'' trong cộng đồng tôn giáo ở Việt Nam",
        caption:
          "Ảnh: Minh họa phương châm ''Tốt đời, đẹp đạo'' trong cộng đồng tôn giáo ở Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "2. Sự chi phối của tín ngưỡng truyền thống",
      },
      {
        type: "paragraph",
        content:
          "Quan hệ dân tộc - tôn giáo chịu ảnh hưởng mạnh mẽ của các hình thái tín ngưỡng bản địa.",
      },

      {
        type: "highlight-normal",
        content: "Ở cấp độ gia đình",
      },
      {
        type: "paragraph",
        content:
          "Tín ngưỡng thờ cúng tổ tiên là nét đẹp văn hóa phổ biến, gắn kết các thành viên trong dòng họ.",
      },
      {
        type: "image",
        src: "/images/tho-cung-to-tien.jpg",
        alt: "Ảnh: Tín ngưỡng thờ cúng tổ tiên là một nét đẹp trong văn hóa người Việt",
        caption:
          "Ảnh: Tín ngưỡng thờ cúng tổ tiên là một nét đẹp trong văn hóa người Việt",
      },
      {
        type: "highlight-normal",
        content: "Ở cấp độ làng xã",
      },
      {
        type: "paragraph",
        content:
          "Thờ cúng Thành hoàng làng tạo nên sự cố kết cộng đồng địa phương.",
      },
      {
        type: "image",
        src: "/images/thanh-hoang-huyen-quang.jpg",
        alt: "Ảnh: Lễ rước tượng thành hoàng Huyền Quang trong hội làng Hưng Học, thị xã Quảng Yên.",
        caption:
          "Ảnh: Lễ rước tượng thành hoàng Huyền Quang trong hội làng Hưng Học, thị xã Quảng Yên.",
      },
      {
        type: "highlight-normal",
        content: "Ở cấp độ quốc gia",
      },
      {
        type: "paragraph",
        content:
          'Tín ngưỡng thờ cúng Hùng Vương đã trở thành biểu tượng của sự hội tụ khối đại đoàn kết, nhắc nhở về nguồn gốc "đồng bào" chung của 54 dân tộc.',
      },
      {
        type: "image",
        src: "/images/tho-cung-vua-hung.jpg",
        alt: "Ảnh: Tín ngưỡng thờ cúng Hùng Vương là biểu tượng của sự hội tụ khối đại đoàn kết dân tộc Việt Nam",
        caption:
          "Ảnh: Tín ngưỡng thờ cúng Hùng Vương là biểu tượng của sự hội tụ khối đại đoàn kết dân tộc Việt Nam",
      },
      {
        type: "highlight-normal",
        content: "3. Sự đan xen và chung sống hòa bình",
      },
      {
        type: "paragraph",
        content:
          "Việt Nam là nơi giao lưu của nhiều luồng văn hóa thế giới, tạo nên một bức tranh tôn giáo đa dạng, đan xen mà không dẫn đến xung đột, chiến tranh tôn giáo lớn. Mọi công dân không phân biệt dân tộc, tín ngưỡng đều có ý thức rõ ràng về cội nguồn và sự thống nhất quốc gia.",
      },
    ],
  },
  {
    year: "Phần VII",
    title: "Những Thách thức Hiện nay",
    slug: "nhung-thach-thuc-hien-nay",
    description:
      "Nhận diện các hiện tượng tiêu cực như đạo lạ, lợi dụng tôn giáo và âm mưu chia rẽ khối đại đoàn kết dân tộc.",
    richContent: [
      {
        type: "highlight",
        content:
          "Những thách thức và hiện tượng mới trong quan hệ dân tộc - tôn giáo",
      },
      {
        type: "highlight-normal",
        content: "Sự xuất hiện của các hiện tượng tôn giáo mới",
      },
      {
        type: "paragraph",
        content:
          "Gần đây xuất hiện nhiều hiện tượng tôn giáo mới có xu hướng phát triển mạnh, tác động đến đời sống cộng đồng.",
      },
      {
        type: "highlight-normal",
        content: "Sự lợi dụng của các thế lực thù địch",
      },
      {
        type: "paragraph",
        content:
          "Một số tổ chức đã lợi dụng niềm tin tôn giáo và các vấn đề dân tộc thiểu số để thực hiện mưu đồ chính trị.",
      },
      {
        type: "highlight-normal",
        content: "Kích động ly khai",
      },
      {
        type: "paragraph",
        content:
          'Các hiện tượng như "Tin lành Đề Ga" hay "Hà Mòn" ở Tây Nguyên đã bị lợi dụng để tuyên truyền nội dung gây hoang mang, xuyên tạc chính sách của Đảng và Nhà nước.',
      },
      {
        type: "image",
        src: "/images/tin-lanh-de-ga.jpg",
        alt: "Ảnh: Cờ của tổ chức tự xưng “Nhà nước Tin lành Đề-ga”",
        caption: "Ảnh: Cờ của tổ chức tự xưng “Nhà nước Tin lành Đề-ga”",
      },
      {
        type: "highlight-normal",
        content: "Phá hoại đại đoàn kết",
      },
      {
        type: "paragraph",
        content:
          "Những hành vi này làm ảnh hưởng đến sự ổn định, trật tự xã hội và trực tiếp xâm phạm đến mối quan hệ tốt đẹp giữa dân tộc và tôn giáo.",
      },
    ],
  },
  {
    year: "Phần VIII",
    title: "Định hướng và Giải pháp",
    slug: "dinh-huong-giai-phap",
    description:
      "Đề xuất các giải pháp nhằm củng cố đoàn kết, phát triển kinh tế – xã hội và bảo vệ ổn định chính trị, xã hội.",
    richContent: [
      {
        type: "paragraph",
        content:
          "Để giải quyết tốt mối quan hệ này, Đảng và Nhà nước đề ra các định hướng sau:",
      },
      {
        type: "highlight",
        content: "Các định hướng và giải pháp chủ yếu",
      },
      {
        type: "highlight-normal",
        content: "1. Tăng cường đại đoàn kết là nhiệm vụ hàng đầu",
      },
      {
        type: "paragraph",
        content:
          "Coi vấn đề dân tộc và tôn giáo là vấn đề chiến lược, lâu dài và cấp bách của cách mạng Việt Nam. Phải xây dựng khối liên minh giữa giai cấp công nhân, nông dân và đội ngũ trí thức làm nòng cốt cho khối đoàn kết toàn dân.",
      },
      {
        type: "highlight-normal",
        content: "2. Giải quyết vấn đề tôn giáo trên cơ sở vấn đề dân tộc",
      },
      {
        type: "paragraph",
        content:
          "Tuyệt đối không được để các vấn đề tôn giáo trở thành cái cớ để đòi ly khai dân tộc. Mọi hoạt động tôn giáo phải bảo đảm giữ vững độc lập, chủ quyền và thống nhất đất nước.",
      },
      {
        type: "image",
        src: "/images/thu-tuong-PMC.jpg",
        alt: "Ảnh: Thủ tướng Phạm Minh Chính gặp mặt, biểu dương các tổ chức tôn giáo có đóng góp trong sự nghiệp xây dựng và bảo vệ Tổ quốc",
        caption:
          "Ảnh: Thủ tướng Phạm Minh Chính gặp mặt, biểu dương các tổ chức tôn giáo có đóng góp trong sự nghiệp xây dựng và bảo vệ Tổ quốc. Nguồn: VGP",
      },
      {
        type: "highlight-normal",
        content: "3. Phát triển toàn diện kinh tế - xã hội",
      },
      {
        type: "paragraph",
        content:
          "Gắn việc thực hiện chính sách dân tộc, tôn giáo với nhiệm vụ phát triển vùng dân tộc thiểu số và miền núi. Nhà nước ưu tiên đầu tư để rút ngắn khoảng cách phát triển, bảo đảm an sinh xã hội cho đồng bào có đạo ở vùng sâu, vùng xa.",
      },
      {
        type: "highlight-normal",
        content: "4. Thực thi pháp luật nghiêm minh",
      },
      {
        type: "paragraph",
        content:
          "Bảo đảm quyền tự do tín ngưỡng, tôn giáo của nhân dân theo Hiến pháp và Luật Tín ngưỡng, Tôn giáo năm 2016. Đồng thời, kiên quyết đấu tranh chống lợi dụng tôn giáo vào mục đích chính trị và xử lý nghiêm các hành vi truyền đạo trái pháp luật.",
      },
      {
        type: "highlight-normal",
        content: "5. Chủ động phòng ngừa và vạch trần âm mưu thù địch",
      },
      {
        type: "paragraph",
        content:
          "Xây dựng cơ chế phối hợp giữa các lực lượng để nắm bắt tình hình, ngăn chặn từ sớm các hoạt động phá hoại khối đoàn kết dân tộc.",
      },
      {
        type: "image",
        src: "/images/tong-bi-thu-To-Lam.jpg",
        alt: "Ảnh: Chủ tịch nước Tô Lâm đã gặp mặt đoàn đại biểu lãnh đạo, chức sắc các tổ chức tôn giáo nhằm biểu dương, tôn vinh, khích lệ lãnh đạo chức sắc, phát huy truyền thống “phụng đạo, yêu nước”, tinh thần đại đoàn kết toàn dân tộc.",
        caption:
          "Ảnh: Chủ tịch nước Tô Lâm đã gặp mặt đoàn đại biểu lãnh đạo, chức sắc các tổ chức tôn giáo nhằm biểu dương, tôn vinh, khích lệ lãnh đạo chức sắc, phát huy truyền thống “phụng đạo, yêu nước”, tinh thần đại đoàn kết toàn dân tộc.",
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
      Math.min(audioDuration, audioRef.current.currentTime + seconds),
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
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" },
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
                            imageItem.caption,
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
                      `/timeline/${timelineData[currentIndex - 1].slug}`,
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
                      `/timeline/${timelineData[currentIndex + 1].slug}`,
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
