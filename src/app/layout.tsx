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
  title: "Hào khí kháng chiến",
  description:
    "Khám phá chiến thắng lịch sử Điện Biên Phủ 1954 - đỉnh cao nghệ thuật quân sự Việt Nam, chấm dứt ách thống trị thực dân Pháp tại Đông Dương",
  keywords:
    "Điện Biên Phủ, chiến thắng 1954, Đại tướng Võ Nguyên Giáp, kháng chiến chống Pháp, lịch sử Việt Nam, chiến tranh Đông Dương, Hiệp định Genève, Henri Navarre, cứ điểm Điện Biên Phủ, đợt tấn công, Him Lam, Độc Lập, A1",
  authors: [{ name: "AIZY" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  creator: "Hào khí kháng chiến",
  publisher: "Hào khí kháng chiến",
  openGraph: {
    title: "Hào khí kháng chiến",
    description:
      "Khám phá chiến thắng lịch sử Điện Biên Phủ 1954 - đỉnh cao nghệ thuật quân sự Việt Nam, chấm dứt ách thống trị thực dân Pháp tại Đông Dương",
    url: "https://dauchanlichsu.aizy.vn",
    images: [
      {
        url: "/image/header.png",
        width: 1200,
        height: 630,
        alt: "Hào khí kháng chiến",
        type: "image/png",
      },
    ],
    type: "website",
    locale: "vi_VN",
    siteName: "Hào khí kháng chiến",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hào khí kháng chiến",
    description:
      "Khám phá chiến thắng lịch sử Điện Biên Phủ 1954 - đỉnh cao nghệ thuật quân sự Việt Nam, chấm dứt ách thống trị thực dân Pháp tại Đông Dương",
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
