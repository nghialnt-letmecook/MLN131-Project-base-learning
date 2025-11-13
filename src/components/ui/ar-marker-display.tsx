"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Smartphone } from "lucide-react";
import Image from "next/image";

export default function ARMarkerDisplay() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {/* Floating AR Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.button
          onClick={() => setIsVisible(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl border-4 border-white/20 group relative"
        >
          <Camera className="w-6 h-6" />

          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 bg-red-400 rounded-full -z-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
          >
            AR Marker
          </motion.div>
        </motion.button>
      </motion.div>

      {/* AR Marker Modal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md md:max-w-lg w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Camera className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      AR Marker
                    </h3>
                    <p className="text-sm text-gray-600">Hình để scan AR</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* AR Marker Image */}
              <div className="flex flex-col items-center space-y-6">
                <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-red-200 shadow-inner">
                  <div className="w-80 h-80 md:w-96 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/vr-image.jpg"
                      alt="AR Marker - Điện Biên Phủ"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 w-full">
                  <div className="flex items-center space-x-2 mb-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <h5 className="font-semibold text-blue-800 text-base md:text-lg">
                      Cách sử dụng:
                    </h5>
                  </div>
                  <ol className="text-sm md:text-base text-blue-700 space-y-2 list-decimal list-inside">
                    <li>Mở AR từ navbar (VR → Quét QR)</li>
                    <li>Cho phép truy cập camera</li>
                    <li>Hướng camera về phía hình này</li>
                    <li>Thưởng thức video AR!</li>
                  </ol>
                </div>

                <p className="text-sm md:text-base text-gray-500 text-center">
                  Lưu hình này hoặc để màn hình mở để scan AR
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
