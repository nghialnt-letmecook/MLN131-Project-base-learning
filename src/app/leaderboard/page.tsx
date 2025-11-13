"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Award, Crown } from "lucide-react";
import { getLeaderboard } from "@/services/leaderboard.api";

interface LeaderboardEntry {
  name: string;
  picture: string;
  count: number;
}

interface GroupedLeaderboard {
  [picture: string]: LeaderboardEntry[];
}

// Tên hiển thị cho từng hình ảnh
const imageLabels: Record<string, string> = {
  "Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, ngày 2-9-1945.jpg":
    "Tuyên ngôn Độc lập 2/9/1945",
  "Quân dân Hà Nội sẵn sàng chiến đấu, tháng 12-1946.jpg":
    "Quân dân Hà Nội sẵn sàng chiến đấu",
  "Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947.jpg":
    "Chiến dịch Việt Bắc Thu-Đông 1947",
  "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê.jpg":
    "Giải phóng Đông Khê 1950",
  "bo-doi-hanh-quan.webp": "Bộ đội hành quân Điện Biên Phủ",
  "Lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh được trang hoàng trên chiếc xe tăng thu được của địch diễu hành mừng chiến thắng tại Điện Biên Phủ, năm 1954.jpg":
    "Chiến thắng Điện Biên Phủ 1954",
};

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<GroupedLeaderboard>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      const data = response.data || response; // Handle cả {data: [...]} và [...]

      // Nhóm theo picture và sắp xếp theo điểm (count thấp = tốt hơn)
      const grouped: GroupedLeaderboard = {};

      if (Array.isArray(data)) {
        data.forEach((entry: LeaderboardEntry) => {
          // Decode URL-encoded picture name
          let pictureName = entry.picture;
          if (pictureName.startsWith("/images/")) {
            pictureName = decodeURIComponent(
              pictureName.replace("/images/", "")
            );
          }

          // Skip invalid entries
          if (pictureName === "string" || !pictureName) {
            return;
          }

          if (!grouped[pictureName]) {
            grouped[pictureName] = [];
          }
          grouped[pictureName].push(entry);
        });

        // Sắp xếp mỗi nhóm theo count (thấp nhất = tốt nhất)
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => a.count - b.count);
        });
      }

      setLeaderboardData(grouped);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch ngay lập tức
    fetchLeaderboard();

    // Polling mỗi 2 giây
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
        );
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300";
      case 1:
        return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300";
      case 2:
        return "bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  const pictures = Object.keys(leaderboardData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100">
      {/* Spacer for navbar */}
      <div className="h-20"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/game"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors duration-300 font-medium flex items-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>

          <div className="text-center flex-1 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-red-700 mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Bảng Xếp Hạng
            </h1>
          </div>

          <div className="w-32"></div>
        </div>

        {pictures.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              Chưa có dữ liệu xếp hạng. Hãy chơi game để trở thành người đầu
              tiên!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pictures.map((picture) => {
              const entries = leaderboardData[picture];
              const displayName =
                imageLabels[picture] ||
                picture.replace(".jpg", "").replace(".webp", "");

              return (
                <div
                  key={picture}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-200 hover:border-red-400 transition-all duration-300"
                >
                  {/* Header với hình ảnh */}
                  <div className="relative h-48 bg-gradient-to-r from-red-600 to-yellow-600">
                    <div className="absolute inset-0 bg-red-900/50"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h2 className="text-xl md:text-2xl font-bold text-white text-center px-4 drop-shadow-lg">
                        {displayName}
                      </h2>
                    </div>
                    {/* Hiển thị số người chơi */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-red-600">
                        {entries.length} người chơi
                      </span>
                    </div>
                  </div>

                  {/* Top 3 */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {entries.slice(0, 5).map((entry, index) => (
                        <div
                          key={`${entry.name}-${index}`}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-102 ${getRankBg(
                            index
                          )}`}
                        >
                          {/* Rank Icon */}
                          <div className="flex-shrink-0 w-12 flex items-center justify-center">
                            {getRankIcon(index)}
                          </div>

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 truncate text-lg">
                              {entry.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {entry.count} nước đi
                            </p>
                          </div>

                          {/* Medal for top 3 */}
                          {index < 3 && (
                            <div className="flex-shrink-0">
                              {index === 0 && (
                                <div className="text-4xl">🥇</div>
                              )}
                              {index === 1 && (
                                <div className="text-4xl">🥈</div>
                              )}
                              {index === 2 && (
                                <div className="text-4xl">🥉</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {entries.length > 5 && (
                        <button
                          onClick={() =>
                            setSelectedPicture(
                              selectedPicture === picture ? null : picture
                            )
                          }
                          className="w-full py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          {selectedPicture === picture
                            ? "Ẩn bớt"
                            : `Xem thêm ${entries.length - 5} người chơi`}
                        </button>
                      )}

                      {/* Extended list */}
                      {selectedPicture === picture &&
                        entries.slice(5).map((entry, index) => (
                          <div
                            key={`${entry.name}-${index + 5}`}
                            className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-200"
                          >
                            <div className="flex-shrink-0 w-12 text-center">
                              <span className="text-gray-500 font-medium">
                                #{index + 6}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-700 truncate">
                                {entry.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {entry.count} nước đi
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-red-200">
          <p className="text-gray-600">
            💡 <strong>Mẹo:</strong> Số nước đi càng ít thì xếp hạng càng cao!
          </p>
        </div>
      </div>
    </div>
  );
}
