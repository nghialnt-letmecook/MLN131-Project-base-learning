"use client";
import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { submitLeaderboard } from "@/services/leaderboard.api";

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  backgroundPositionX: string;
  backgroundPositionY: string;
  isEmpty?: boolean;
}

// Description cho từng hình
const imageDescriptions: Record<string, string> = {
  "Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội, ngày 2-9-1945.jpg":
    'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội ngày 2-9-1945, tuyên bố nước Việt Nam Dân chủ Cộng hòa ra đời trước hàng vạn đồng bào và đại biểu các nước. Đây là sự kiện lịch sử trọng đại, đánh dấu bước ngoặt vĩ đại trong lịch sử dân tộc - kết thúc gần một thế kỷ đô hộ của thực dân Pháp và mở ra kỷ nguyên mới của độc lập, tự do. Bản Tuyên ngôn Độc lập khẳng định những quyền bất khả xâm phạm của con người và dân tộc, tuyên bố "nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập". Lời tuyên bố chấn động của Bác Hồ đã khẳng định quyền tự quyết của dân tộc, mở đầu cho thời kỳ xây dựng và bảo vệ chính quyền cách mạng non trẻ, truyền cảm hứng cho các dân tộc bị áp bức trên thế giới đứng lên đấu tranh giành độc lập.',
  "Quân dân Hà Nội sẵn sàng chiến đấu, tháng 12-1946.jpg":
    'Quân dân Hà Nội sẵn sàng chiến đấu tháng 12-1946, chuẩn bị cho cuộc kháng chiến trường kỳ, gian khổ chống thực dân Pháp xâm lược. Sau khi thực dân Pháp gây hấn ngày 19-12-1946 tại Hà Nội, theo lời kêu gọi "Hỡi đồng bào cả nước, hễ ai còn một tấc sắt thì dùng một tấc sắt, hễ ai còn một gang thép thì dùng một gang thép..." của Chủ tịch Hồ Chí Minh, toàn thể quân và dân Thủ đô Hà Nội đã vùng lên với tinh thần "quyết tử cho Tổ quốc quyết sinh". Hình ảnh này ghi lại khoảnh khắc lịch sử khi nhân dân Thủ đô, từ già đến trẻ, từ công nhân, nông dân đến trí thức, tất cả đều sẵn sàng cầm vũ khí chiến đấu bảo vệ Tổ quốc. 60 ngày đêm kháng chiến của quân dân Hà Nội đã làm nên trang sử vàng chói lọi, thể hiện ý chí quyết chiến quyết thắng và tinh thần yêu nước nồng nàn của nhân dân Thủ đô anh hùng.',
  "Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947.jpg":
    'Bộ đội qua sông Lô truy kích địch trong chiến dịch Việt Bắc Thu-Đông 1947, một trong những chiến dịch quan trọng để bảo vệ căn cứ địa kháng chiến và đánh bại âm mưu "đánh nhanh thắng nhanh" của thực dân Pháp. Chiến dịch diễn ra từ ngày 7/10 đến 22/12/1947, khi địch huy động gần 20.000 quân tinh nhuệ với vũ khí hiện đại tấn công vào vùng căn cứ Việt Bắc nhằm tiêu diệt bộ chỉ huy kháng chiến. Với chiến lược "địch tiến ta lùi, địch đóng ta quấy, địch mỏi ta đánh, địch chạy ta đuổi", quân và dân ta đã kiên cường chiến đấu, tiêu diệt và làm tiêu hao sinh lực địch, buộc chúng phải rút lui trong thất bại. Chiến thắng này đã bảo vệ vững chắc căn cứ địa kháng chiến, giữ vững bộ máy lãnh đạo kháng chiến và chứng minh sức mạnh của chiến tranh du kích kết hợp với chiến tranh vận động.',
  "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê.jpg":
    "Bộ đội ta tiến vào giải phóng thị trấn Đông Khê trong Chiến dịch Biên giới Thu-Đông 1950, đánh dấu bước ngoặt quan trọng khi quân ta chuyển từ thế phòng thủ sang tổng phản công trên chiến trường. Chiến thắng Đông Khê (16-18/9/1950) không chỉ giải phóng thị trấn chiến lược này mà còn mở đầu cho chuỗi thắng lợi liên tiếp trong chiến dịch Biên giới, tạo thế chủ động cho ta trên toàn mặt trận Đông Bắc. Đây là lần đầu tiên quân ta tiến công và tiêu diệt hoàn toàn một cứ điểm kiên cố của địch, chứng tỏ sự trưởng thành vượt bậc về chiến lược, chiến thuật và khả năng tác chiến của quân đội ta. Chiến thắng này đã tạo điều kiện để mở rộng căn cứ địa Việt Bắc và chuẩn bị lực lượng cho những chiến dịch lớn sau này.",
  "bo-doi-hanh-quan.webp":
    'Hình ảnh bộ đội Việt Nam hành quân qua những địa hình núi rừng hiểm trở để tiến vào chiến dịch Điện Biên Phủ thể hiện sức mạnh to lớn của ý chí con người. Với tinh thần kiên cường và quyết tâm cao độ, các chiến sĩ đã vượt qua vô vàn khó khăn, thử thách của thiên nhiên - những con đường rừng núi hiểm trở, sương mù dày đặc, địa hình quanh co - để vận chuyển vũ khí, lương thực và tiến vào vị trí chiến đấu. Họ đã biến "không thể thành có thể", thể hiện tinh thần bất khuất, lòng yêu nước thiết tha và niềm tin vững chắc vào chiến thắng của dân tộc Việt Nam. Mỗi bước chân của bộ đội trên những con đường hành quân ấy đều là minh chứng cho sức mạnh vô địch của chủ nghĩa anh hùng cách mạng.',
  "Lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh được trang hoàng trên chiếc xe tăng thu được của địch diễu hành mừng chiến thắng tại Điện Biên Phủ, năm 1954.jpg":
    'Chiến thắng Điện Biên Phủ (7/5/1954) là đỉnh cao của nghệ thuật quân sự Việt Nam, kết thúc 56 ngày đêm chiến đấu anh dũng, kiên cường. Chiến thắng này không chỉ có ý nghĩa quân sự to lớn mà còn là thắng lợi chính trị - ngoại giao vang dội trên toàn thế giới, buộc thực dân Pháp phải ngồi vào bàn đàm phán tại Hội nghị Genève. Đây là trận đánh "lừng lẫy năm châu, chấn động địa cầu", chấm dứt gần 100 năm ách thống trị của thực dân Pháp tại Đông Dương và mở ra kỷ nguyên mới cho các dân tộc thuộc địa đấu tranh giành độc lập. Hình ảnh chiếc xe tăng được trang trí lá cờ Quyết chiến Quyết thắng và chân dung Chủ tịch Hồ Chí Minh đã trở thành biểu tượng bất hủ của chiến thắng lịch sử này.',
};

export default function PuzzleGame() {
  const params = useParams();
  const router = useRouter();
  const img =
    typeof params.img === "string"
      ? params.img
      : Array.isArray(params.img)
      ? params.img[0]
      : "header.png";
  const imgUrl = `/images/${img}`;

  // Decode URL để tìm description chính xác
  const decodedImg = decodeURIComponent(img);

  // Fallback description nếu không tìm thấy
  const description =
    imageDescriptions[img] ||
    imageDescriptions[decodedImg] ||
    "Hình ảnh lịch sử quý giá trong cuộc kháng chiến chống thực dân Pháp (1945-1954), thể hiện tinh thần bất khuất và ý chí quyết tâm giành độc lập của dân tộc Việt Nam.";

  // Tất cả hook phải ở đầu hàm
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPosition, setEmptyPosition] = useState(8);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializePuzzle = useCallback(() => {
    const initialPieces: PuzzlePiece[] = [];
    for (let i = 0; i < 8; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const backgroundX = col === 0 ? "0%" : col === 1 ? "50%" : "100%";
      const backgroundY = row === 0 ? "0%" : row === 1 ? "50%" : "100%";
      initialPieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        backgroundPositionX: backgroundX,
        backgroundPositionY: backgroundY,
        isEmpty: false,
      });
    }
    return initialPieces;
  }, []);

  const isAdjacent = (pos1: number, pos2: number) => {
    const row1 = Math.floor(pos1 / 3);
    const col1 = pos1 % 3;
    const row2 = Math.floor(pos2 / 3);
    const col2 = pos2 % 3;
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const shufflePuzzle = useCallback(() => {
    const newPieces = initializePuzzle();
    let currentEmptyPos = 8;
    for (let i = 0; i < 200; i++) {
      const adjacentPositions = [];
      for (let pos = 0; pos < 9; pos++) {
        if (isAdjacent(currentEmptyPos, pos)) {
          adjacentPositions.push(pos);
        }
      }
      if (adjacentPositions.length > 0) {
        const randomPos =
          adjacentPositions[
            Math.floor(Math.random() * adjacentPositions.length)
          ];
        const pieceToMove = newPieces.find(
          (p) => p.currentPosition === randomPos
        );
        if (pieceToMove) {
          pieceToMove.currentPosition = currentEmptyPos;
          currentEmptyPos = randomPos;
        }
      }
    }
    setPieces(newPieces);
    setEmptyPosition(currentEmptyPos);
    setIsComplete(false);
    setMoves(0);
    setGameStarted(true);
    setShowDescription(false);
  }, [initializePuzzle]);

  const checkCompletion = useCallback(
    (currentPieces: PuzzlePiece[], emptyPos: number) => {
      const isAllPiecesCorrect = currentPieces.every(
        (piece) => piece.currentPosition === piece.correctPosition
      );
      const isEmptyAtEnd = emptyPos === 8;
      return isAllPiecesCorrect && isEmptyAtEnd;
    },
    []
  );

  const handlePieceClick = useCallback(
    (clickedPosition: number) => {
      if (isComplete || !gameStarted) return;
      if (isAdjacent(clickedPosition, emptyPosition)) {
        setPieces((currentPieces) => {
          const newPieces = [...currentPieces];
          const pieceToMove = newPieces.find(
            (p) => p.currentPosition === clickedPosition
          );
          if (pieceToMove) {
            pieceToMove.currentPosition = emptyPosition;
            // Lưu lại emptyPos mới để truyền vào checkCompletion
            const newEmptyPos = clickedPosition;
            setEmptyPosition(newEmptyPos);
            setMoves((prev) => prev + 1);
            setTimeout(() => {
              if (checkCompletion(newPieces, newEmptyPos)) {
                setIsComplete(true);
                gsap.fromTo(
                  ".puzzle-piece",
                  { scale: 1 },
                  {
                    scale: 1.05,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    stagger: 0.1,
                  }
                );
                setTimeout(() => {
                  setShowNameModal(true);
                }, 2000);
              }
            }, 100);
          }
          return newPieces;
        });
      }
    },
    [emptyPosition, isComplete, gameStarted, checkCompletion]
  );

  const gridPositions = Array.from({ length: 9 }, (_, index) => {
    const piece = pieces.find((p) => p.currentPosition === index);
    return piece || { isEmpty: true, position: index };
  });

  const handleSubmitScore = async () => {
    if (!userName.trim()) {
      alert("Vui lòng nhập tên của bạn!");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLeaderboard({
        name: userName.trim(),
        picture: imgUrl,
        count: moves,
      });
      setShowNameModal(false);
      setShowDescription(true);
    } catch (error) {
      console.error("Lỗi khi gửi điểm:", error);
      alert("Có lỗi xảy ra khi gửi điểm. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cheat code: Ctrl + Shift + Alt + W + I + N để tự động thắng
  const autoWin = useCallback(() => {
    const correctPieces = initializePuzzle();
    setPieces(correctPieces);
    setEmptyPosition(8);
    setIsComplete(true);
    gsap.fromTo(
      ".puzzle-piece",
      { scale: 1 },
      {
        scale: 1.05,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        stagger: 0.1,
      }
    );
    setTimeout(() => {
      setShowNameModal(true);
    }, 2000);
  }, [initializePuzzle]);

  useEffect(() => {
    const keySequence: string[] = [];
    const requiredSequence = ['w', 'i', 'n']; // Phím W-I-N
    let sequenceTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Phải giữ Ctrl + Shift + Alt
      if (e.ctrlKey && e.shiftKey && e.altKey) {
        const key = e.key.toLowerCase();
        
        // Chỉ chấp nhận các phím trong sequence
        if (requiredSequence.includes(key)) {
          e.preventDefault();
          
          // Thêm phím vào sequence
          keySequence.push(key);
          
          // Reset timer - người dùng có 1.5 giây để nhấn phím tiếp theo
          clearTimeout(sequenceTimer);
          sequenceTimer = setTimeout(() => {
            keySequence.length = 0;
          }, 1500);
          
          // Kiểm tra nếu đã nhấn đủ sequence (cuối 3 phím phải là w-i-n)
          if (keySequence.length >= 3) {
            const lastThree = keySequence.slice(-3);
            if (
              lastThree[0] === 'w' &&
              lastThree[1] === 'i' &&
              lastThree[2] === 'n'
            ) {
              keySequence.length = 0;
              clearTimeout(sequenceTimer);
              if (!isComplete && gameStarted) {
                autoWin();
              }
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(sequenceTimer);
    };
  }, [isComplete, gameStarted, autoWin]);

  useEffect(() => {
    const initialPieces = initializePuzzle();
    setPieces(initialPieces);
    // Tự động bắt đầu game khi component được mount
    setTimeout(() => {
      shufflePuzzle();
    }, 500); // Delay nhỏ để đảm bảo pieces đã được khởi tạo
  }, [initializePuzzle, shufflePuzzle]);

  // Nếu đã hoàn thành và showDescription, hiển thị layout mô tả
  if (isComplete && showDescription) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-4 py-4 md:py-6">
          <Link
            href="/game"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors duration-300 font-medium flex items-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </Link>
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-red-700 text-center flex-1 px-4">
            🎉 Chúc mừng! Bạn đã hoàn thành!
          </h1>
          <div className="w-16 md:w-24"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 md:gap-8 items-stretch justify-center px-4 py-4">
            {/* Hình hoàn chỉnh */}
            <div className="w-full lg:flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl aspect-square rounded-3xl shadow-2xl overflow-hidden bg-white border-4 border-red-200 hover:border-red-300 transition-all duration-300">
                <img
                  src={imgUrl}
                  alt="Hình ảnh lịch sử hoàn chỉnh"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Phần mô tả */}
            <div className="w-full lg:max-w-xl flex flex-col justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
                {/* Thông tin số nước đi */}
                <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-2xl p-6 border-2 border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-lg font-medium">
                      Số nước đi:
                    </span>
                    <span className="text-4xl font-bold text-red-600">
                      {moves}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          moves < 50
                            ? "100%"
                            : moves < 100
                            ? "75%"
                            : moves < 150
                            ? "50%"
                            : "25%",
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {moves < 50 && "🌟 Xuất sắc! Bạn là bậc thầy xếp hình!"}
                    {moves >= 50 &&
                      moves < 100 &&
                      "Rất tốt! Bạn có tư duy logic tuyệt vời!"}
                    {moves >= 100 &&
                      moves < 150 &&
                      "Tốt lắm! Tiếp tục cố gắng!"}
                    {moves >= 150 &&
                      "Hoàn thành! Thử thách lại để cải thiện nhé!"}
                  </p>
                </div>

                {/* Tiêu đề mô tả */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📜</span>
                    <span>Ý nghĩa lịch sử</span>
                  </h2>

                  {/* Nội dung mô tả */}
                  <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-red-500">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={shufflePuzzle}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Chơi lại
                  </button>
                  <Link
                    href="/game"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Chọn ảnh khác
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout chơi game bình thường
  return (
    <div className="min-h-screen w-screen h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        {/* Ảnh hoàn chỉnh nhỏ góc trên trái, click để xem to */}
        <div
          className="absolute bottom-6 left-6 z-20 flex flex-col items-center cursor-pointer group"
          onClick={() => setShowImageModal(true)}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg shadow-lg overflow-hidden border-2 border-red-300 group-hover:scale-110 transition-transform bg-white">
            <img
              src={imgUrl}
              alt="Hình hoàn chỉnh nhỏ"
              className="w-full h-full object-cover object-center"
              style={{ aspectRatio: "1/1" }}
            />
          </div>
          <span className="text-xs text-red-700 mt-1 group-hover:underline">
            Xem mẫu
          </span>
        </div>
        {/* Modal xem ảnh lớn */}
        {showImageModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setShowImageModal(false)}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-2 md:p-4 max-w-2xl w-[90vw] max-h-[90vh] flex flex-col items-center justify-center">
              <img
                src={imgUrl}
                alt="Hình hoàn chỉnh lớn"
                className="w-full h-full object-contain object-center rounded-xl"
                style={{ maxHeight: "70vh" }}
              />
              <button
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                onClick={() => setShowImageModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between w-full max-w-4xl px-4 mt-4 mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-red-700 text-center flex-1"></h1>
          <div className="w-24"></div>
        </div>

        {/* Game Instructions */}
        <div className="text-center mb-2 w-full max-w-4xl">
          <p className="text-gray-700 text-base md:text-lg">
            Nhấn vào mảnh ghép kề với ô trống để di chuyển
          </p>
        </div>
        <p className="text-center text-sm text-gray-500 mb-2">
          Cố gắng hoàn thành với ít nước đi nhất!
        </p>
        {/* Puzzle chính giữa màn hình */}
        <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 p-2 md:p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
              {gridPositions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handlePieceClick(index)}
                  className={`
													puzzle-piece w-20 h-20 md:w-40 md:h-40 rounded-lg overflow-hidden relative
													${
                            item.isEmpty
                              ? "bg-gray-200 border-2 border-dashed border-gray-400"
                              : `cursor-pointer hover:scale-105 hover:shadow-lg ${
                                  gameStarted &&
                                  isAdjacent(index, emptyPosition)
                                    ? "ring-2 ring-blue-400 ring-opacity-50"
                                    : ""
                                }`
                          }
													${!gameStarted ? "cursor-not-allowed opacity-50" : ""}
												`}
                  style={
                    !item.isEmpty
                      ? {
                          backgroundImage: `url('${imgUrl}')`,
                          backgroundSize: "300% 300%",
                          backgroundPosition: `${
                            (item as PuzzlePiece).backgroundPositionX
                          } ${(item as PuzzlePiece).backgroundPositionY}`,
                          backgroundRepeat: "no-repeat",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          aspectRatio: "1/1",
                        }
                      : {
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          aspectRatio: "1/1",
                        }
                  }
                >
                  {!item.isEmpty && (
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-xs md:text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {(item as PuzzlePiece).id + 1}
                    </span>
                  )}
                  {item.isEmpty && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500 text-xl md:text-2xl font-bold">
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
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {isComplete && !showDescription && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <div className="bg-white p-8 rounded-2xl text-center shadow-2xl">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-red-700 mb-4">
                    Chúc mừng!
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Bạn đã hoàn thành puzzle trong {moves} nước đi!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal nhập tên khi hoàn thành game */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-[90vw]">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-2">
                Chúc mừng!
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Bạn đã hoàn thành trong{" "}
                <span className="font-bold text-red-600">{moves} nước đi</span>!
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Nhập tên của bạn để lưu kết quả:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Tên của bạn..."
                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                maxLength={50}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleSubmitScore();
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitScore}
                disabled={isSubmitting || !userName.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-red-600/25"
              >
                {isSubmitting ? "Đang gửi..." : "Lưu kết quả"}
              </button>
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setShowDescription(true);
                }}
                disabled={isSubmitting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all duration-300"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
