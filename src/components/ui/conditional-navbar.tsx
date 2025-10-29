"use client";

import { usePathname } from "next/navigation";
import FloatingNavbar from "./floating-navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Ẩn floating navbar trên các trang timeline slug
  if (pathname.startsWith("/timeline/") && pathname !== "/timeline") {
    return null;
  }

  return <FloatingNavbar />;
}
