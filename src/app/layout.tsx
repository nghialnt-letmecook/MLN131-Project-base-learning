import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Inter,
  Crimson_Text,
  Be_Vietnam_Pro,
} from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ui/conditional-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Font tiếng Việt đẹp cho tiêu đề chính
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Font sang trọng cho tiêu đề
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Font hiện đại cho body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

// Font elegant cho quotes
const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Một khối Việt Nam",
  description:
    "Tìm hiểu vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội - 54 dân tộc anh em, đoàn kết tôn giáo, xây dựng khối đại đoàn kết dân tộc",
  keywords:
    "dân tộc tôn giáo Việt Nam, 54 dân tộc, đại đoàn kết dân tộc, tự do tôn giáo, chủ nghĩa xã hội, Tổng Bí thư Nguyễn Phú Trọng, đặc trưng dân tộc, chính sách dân tộc, Leinxin, Cương lĩnh dân tộc",
  authors: [{ name: "AIZY" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  creator: "Một khối Việt Nam",
  publisher: "Một khối Việt Nam",
  openGraph: {
    title: "Một khối Việt Nam",
    description:
      "Tìm hiểu vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội - 54 dân tộc anh em, đoàn kết tôn giáo, xây dựng khối đại đoàn kết dân tộc",
    url: "https://motkhoivietnam.aizy.io.vn/",
    images: [
      {
        url: "/image/dan-toc-ton-giao-qua-do-XHCN.jpg",
        width: 1200,
        height: 630,
        alt: "Một khối Việt Nam",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "vi_VN",
    siteName: "Một khối Việt Nam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Một khối Việt Nam",
    description:
      "Tìm hiểu vấn đề dân tộc và tôn giáo trong thời kỳ quá độ lên chủ nghĩa xã hội - 54 dân tộc anh em, đoàn kết tôn giáo, xây dựng khối đại đoàn kết dân tộc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} ${playfairDisplay.variable} ${inter.variable} ${crimsonText.variable} antialiased`}
      >
        <ConditionalNavbar />
        {children}
      </body>
    </html>
  );
}
