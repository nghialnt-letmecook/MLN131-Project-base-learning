"use client";
import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
  "chien-thang.jpg":
    "Chiến thắng Điện Biên Phủ (7/5/1954) là đỉnh cao của nghệ thuật quân sự Việt Nam, kết thúc 56 ngày đêm chiến đấu anh heroic. Chiến thắng này không chỉ có ý nghĩa quân sự mà còn là thắng lợi chính trị to lớn, buộc thực dân Pháp phải ngồi vào bàn đàm phán tại Hội nghị Genève, chấm dứt ách thống trị của họ tại Đông Dương và mở ra kỷ nguyên mới cho các dân tộc Đông Dương.",
  "bo-doi-hanh-quan.webp":
    "Hình ảnh bộ đội Việt Nam hành quân qua những địa hình núi rừng hiểm trở để tiến vào chiến dịch Điện Biên Phủ. Với tinh thần kiên cường và ý chí quyết tâm cao, các chiến sĩ đã vượt qua mọi khó khăn, thử thách của thiên nhiên để tham gia vào trận đánh lịch sử này, thể hiện tinh thần bất khuất và lòng yêu nước thiết tha của dân tộc Việt Nam.",
  "keo-phao.jpg":
    "Cảnh tượng hùng tráng và cảm động của bộ đội và dân công kéo những khẩu pháo nặng lên những sườn đồi dựng đứng quanh thung lũng Điện Biên Phủ. Với tinh thần 'không có gì khó, chỉ sợ lòng không bền', họ đã vượt qua địa hình hiểm trở để tạo nên thế trận bao vây địch từ trên cao xuống, tạo điều kiện cho chiến thắng cuối cùng.",
  "dao-hao.jpg":
    "Hệ thống hào giao thông dài hàng chục kilomet được các chiến sĩ đào xuyên đêm trong im lặng, từng xẻng đất một. Những con hào này không chỉ giúp bộ đội tiến sát đến từng cứ điểm của địch một cách an toàn mà còn thể hiện trí tuệ, sự kiên nhẫn và nghệ thuật tác chiến độc đáo của quân đội Việt Nam trong chiến dịch Điện Biên Phủ.",
  "doan_xe_dap_tho.webp":
    "Đoàn xe đạp thồ - biểu tượng bất hủ của chiến dịch Điện Biên Phủ. Những chiếc xe đạp chở lương thực, đạn dược, vật dụng y tế... lăn bánh qua những con đường rừng núi hiểm trở, thể hiện sức mạnh hậu cần đồng thời là biểu tượng của ý chí chiến thắng và tinh thần đoàn kết của cả dân tộc trong cuộc kháng chiến chống thực dân Pháp.",
  "geneve.jpg":
    "Lễ ký kết Hiệp định Genève ngày 21/7/1954 - thành quả chính trị to lớn của chiến thắng Điện Biên Phủ. Hiệp định này chính thức công nhận độc lập, chủ quyền của Việt Nam, chấm dứt chiến tranh Đông Dương lần thứ nhất và mở ra một trang sử mới cho khu vực Đông Nam Á. Đây là minh chứng cho sức mạnh của đàm phán trên cơ sở thắng lợi quân sự.",
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
  const imgUrl = `/image/${img}`;
  const description =
    imageDescriptions[img] || "Hình ảnh mô tả cho game xếp hình.";

  // Tất cả hook phải ở đầu hàm
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPosition, setEmptyPosition] = useState(8);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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
                setTimeout(() => setShowDescription(true), 3000);
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
        <div className="flex items-center justify-between w-full px-4 py-4 md:py-6">
          <Link
            href="/game"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-colors duration-300 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </Link>
          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-red-700 text-center flex-1 px-4">
            Chúc mừng! Bạn đã hoàn thành!
          </h1>
          <div className="w-16 md:w-24"></div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-4 md:gap-8 items-center justify-center px-4 py-4">
            {/* Hình hoàn chỉnh */}
            <div className="w-full lg:flex-1 flex items-center justify-center">
              <div className="w-full max-w-md lg:max-w-none h-auto lg:h-full flex items-center justify-center">
                <div className="w-full aspect-square max-w-[80vw] lg:max-w-[50vw] lg:max-h-[60vh] rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden bg-white/90 flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt="Hình hoàn chỉnh"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="w-full lg:max-w-[400px] flex flex-col justify-center bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 lg:h-full">
              <h2 className="text-xl md:text-2xl font-bold text-red-700 mb-3 md:mb-4 text-center lg:text-left">
                Mô tả về hình
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 text-center lg:text-left leading-relaxed">
                {description}
              </p>
              <div className="text-gray-500 mb-4 text-center lg:text-left">
                Bạn đã hoàn thành trong{" "}
                <span className="font-semibold text-red-700">{moves}</span> nước
                đi!
              </div>
              <button
                onClick={shufflePuzzle}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 w-full lg:w-auto"
              >
                Chơi lại
              </button>
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
    </div>
  );
}
