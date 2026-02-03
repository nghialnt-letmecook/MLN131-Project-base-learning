"use client";
import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { storeScore } from "@/app/actions/mln.actions";

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  backgroundPositionX: string;
  backgroundPositionY: string;
  isEmpty?: boolean;
}

import imagesData from "../../../../../public/images/game/images.json";

// Helper to find description dynamically
const getImageInfo = (filename: string) => {
  const pureFilename = filename.split('/').pop() || filename;
  const imageEntry = imagesData.images.find((img) => img.file === pureFilename);
  return imageEntry
    ? { description: imageEntry.description, title: imageEntry.title }
    : {
      description:
        "Hãy quan sát kỹ bức ảnh và sắp xếp các mảnh ghép để hoàn thiện tác phẩm lịch sử này. Bạn có thể làm được!",
      title: "Trò chơi ghép hình",
    };
};

export default function PuzzleGame({
  img,
  submitToken,
}: {
  img: string;
  submitToken: { nonce: string; timestamp: number; token: string };
}) {
  const imgUrl = `/images/${img}`;
  const decodedImg = decodeURIComponent(img);
  const { description, title } = getImageInfo(decodedImg);

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
      await storeScore(
        {
          name: userName.trim(),
          picture: imgUrl,
          count: moves,
        },
        submitToken.nonce,
        submitToken.timestamp,
        submitToken.token
      );
      setShowNameModal(false);
      setShowDescription(true);
    } catch (error) {
      console.error("Lỗi khi gửi điểm:", error);
      alert("Có lỗi xảy ra khi gửi điểm. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const initialPieces = initializePuzzle();
    setPieces(initialPieces);
    setTimeout(() => {
      shufflePuzzle();
    }, 500);
  }, [initializePuzzle, shufflePuzzle]);

  if (isComplete && showDescription) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex flex-col overflow-hidden">
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
        <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 md:gap-8 items-stretch justify-center px-4 py-4">
            <div className="w-full lg:flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl aspect-square rounded-3xl shadow-2xl overflow-hidden bg-white border-4 border-red-200 hover:border-red-300 transition-all duration-300">
                <img
                  src={imgUrl}
                  alt="Hình ảnh lịch sử hoàn chỉnh"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="w-full lg:max-w-xl flex flex-col justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
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
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📜</span>
                    <span>Ý nghĩa lịch sử</span>
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-red-500">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                      {description}
                    </p>
                  </div>
                </div>
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

  return (
    <div className="min-h-screen w-screen h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center justify-center w-full h-full">
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
        <div className="flex items-center justify-between w-full max-w-4xl px-4 mt-4 mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-red-700 text-center flex-1">{title}</h1>
          <div className="w-24"></div>
        </div>
        <div className="text-center mb-2 w-full max-w-4xl">
          <p className="text-gray-700 text-base md:text-lg">
            Nhấn vào mảnh ghép kề với ô trống để di chuyển
          </p>
        </div>
        <p className="text-center text-sm text-gray-500 mb-2">
          Cố gắng hoàn thành với ít nước đi nhất!
        </p>
        <div className="flex flex-col items-center justify-center flex-1 w-full h-full">
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 p-2 md:p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
              {gridPositions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handlePieceClick(index)}
                  className={`puzzle-piece w-20 h-20 md:w-40 md:h-40 rounded-lg overflow-hidden relative ${item.isEmpty
                    ? "bg-gray-200 border-2 border-dashed border-gray-400"
                    : `cursor-pointer hover:scale-105 hover:shadow-lg ${gameStarted && isAdjacent(index, emptyPosition)
                      ? "ring-2 ring-blue-400 ring-opacity-50"
                      : ""
                    }`
                    } ${!gameStarted ? "cursor-not-allowed opacity-50" : ""}`}
                  style={
                    !item.isEmpty
                      ? {
                        backgroundImage: `url('${imgUrl}')`,
                        backgroundSize: "300% 300%",
                        backgroundPosition: `${(item as PuzzlePiece).backgroundPositionX} ${(item as PuzzlePiece).backgroundPositionY}`,
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
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
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
