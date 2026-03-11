"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import TiltedCard from "../../../../components/card/tiltedcard";

export default function OriginalWork({
  lang,
  onBack,
}: {
  lang: string;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  // KITA HANYA MENGGUNAKAN 1 MESIN: VIDEO (Yang sudah ada audionya)
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0,
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // =========================================
  // DATA PORTOFOLIO
  // =========================================
  const works = [
    {
      id: 1,
      title: "Samidare (cover)",
      imageSrc: "/samidare.jpeg",
      imageLayers: [
        "/portfolio/original/samidare/1.png",
        "/portfolio/original/samidare/2.png",
        "/portfolio/original/samidare/3.png",
        "/portfolio/original/samidare/4.png",
      ],
      videoSrcDesktop: "/portfolio/original/samidare/desktop.webm",
      videoSrcMobile: "/portfolio/original/samidare/mobile.webm",
      category:
        lang === "id" ? "Aransemen & Komposisi" : "Arrangement & Composition",
      desc:
        lang === "id"
          ? "Aransemen ulang, murni cover dari Budapes."
          : "Re-arrangement, a pure cover by Budapes.",
    },
    {
      id: 2,
      title: "We Wish You A Merry Christmas (cover)",
      imageSrc:
        "/portfolio/original/we-wish-you-a-merry-christmas/we-wish-you-a-merry-christmas.jpeg",
      imageLayers: [
        "/portfolio/original/we-wish-you-a-merry-christmas/1.png",
        "/portfolio/original/we-wish-you-a-merry-christmas/2.png",
        "/portfolio/original/we-wish-you-a-merry-christmas/3.png",
        "/portfolio/original/we-wish-you-a-merry-christmas/4.png",
      ],
      videoSrcDesktop:
        "/portfolio/original/we-wish-you-a-merry-christmas/desktop.webm",
      videoSrcMobile:
        "/portfolio/original/we-wish-you-a-merry-christmas/mobile.webm",
      category:
        lang === "id" ? "Aransemen & Komposisi" : "Arrangement & Composition",
      desc:
        lang === "id"
          ? "Aransemen ulang dalam rangka Natal, murni cover dari Budapes."
          : "Christmas-themed re-arrangement, a pure cover by Budapes.",
    },
    {
      id: 3,
      title: "Fatality",
      imageSrc: "/portfolio/original/fatality/fatality.jpeg",
      imageLayers: [
        "/portfolio/original/fatality/1.png",
        "/portfolio/original/fatality/2.png",
        "/portfolio/original/fatality/3.png",
        "/portfolio/original/fatality/4.png",
      ],
      videoSrcDesktop: "/portfolio/original/fatality/desktop.mp4",
      videoSrcMobile: "/portfolio/original/fatality/mobile.mp4",
      category:
        lang === "id"
          ? "Aransemen & Desain Suara"
          : "Arrangement & Sound Design",
      desc:
        lang === "id"
          ? "Aransemen penggabungan antara dua genre musik yang berbeda."
          : "An arrangement combining two completely different music genres.",
    },
    {
      id: 4,
      title: "The Seeds of Your Sorrow - Splitting Ibex",
      imageSrc: "/other/budapes-logo/logo/budapeslogo.png",
      imageLayers: [],
      videoSrcDesktop:
        "/portfolio/original/the-seeds-of-your-sorrow/desktop.mp4",
      videoSrcMobile: "/portfolio/original/the-seeds-of-your-sorrow/mobile.mp4",
      category:
        lang === "id" ? "Remix & Remastering" : "Remixing & Remastering",
      desc:
        lang === "id"
          ? "Remix dan remastering dari lagu 'The Seeds of Your Sorrow' oleh Splitting Ibex (kontes dari LEWITT)."
          : "Remix and remastering of 'The Seeds of Your Sorrow' by Splitting Ibex (LEWITT contest entry).",
    },
    {
      id: 5,
      title: "Home - Avec",
      imageSrc: "/other/budapes-logo/logo/budapeslogo.png",
      imageLayers: [],
      videoSrcDesktop: "/portfolio/original/home/desktop.mp4",
      videoSrcMobile: "/portfolio/original/home/mobile.mp4",
      category:
        lang === "id" ? "Remix & Remastering" : "Remixing & Remastering",
      desc:
        lang === "id"
          ? "Remix dan remastering dari lagu 'Home' oleh Avec (kontes dari LEWITT)."
          : "Remix and remastering of 'Home' by Avec (LEWITT contest entry).",
    },
  ];

  const t = {
    id: { back: "Kembali ke Menu Utama", title: "KARYA ORIGINAL" },
    en: { back: "Back to Main Menu", title: "ORIGINAL WORKS" },
  }[lang as "id" | "en"];

  // =========================================
  // RESET LOGIC
  // =========================================
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);

    // PERBAIKAN: Set agar overlay kembali muncul (false) setiap kali lagu diganti!
    setHasInteracted(false);
  }, [currentIndex]);

  // =========================================
  // KONTROL MEDIA MURNI PADA 1 VIDEO
  // =========================================
  const togglePlay = () => {
    setHasInteracted(true); // Hapus overlay jika tombol play ditekan
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBackward = () => {
    setHasInteracted(true); // Hapus overlay jika tombol mundur ditekan
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 5,
      );
    }
  };

  const skipForward = () => {
    setHasInteracted(true); // Hapus overlay jika tombol maju ditekan
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  const cardSizeProps = isMobile
    ? {
        containerHeight: "clamp(150px, 35vh, 220px)",
        containerWidth: "clamp(150px, 35vh, 220px)",
        imageHeight: "clamp(150px, 35vh, 220px)",
        imageWidth: "clamp(150px, 35vh, 220px)",
      }
    : {
        containerHeight: "clamp(150px, 35vh, 280px)",
        containerWidth: "clamp(150px, 35vh, 280px)",
        imageHeight: "clamp(150px, 35vh, 280px)",
        imageWidth: "clamp(150px, 35vh, 280px)",
      };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] bg-black overflow-hidden z-50 flex flex-col">
      {/* =========================================
          BACKGROUND VIDEO (Sekaligus sebagai pemutar Audio)
          ========================================= */}
      <div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-black"
        style={{ transform: "translateZ(0)" }}
      >
        <video
          ref={videoRef}
          key={`${currentIndex}-${isMobile ? "mobile" : "desktop"}`}
          src={
            isMobile
              ? works[currentIndex].videoSrcMobile
              : works[currentIndex].videoSrcDesktop
          }
          preload="auto"
          playsInline
          onEnded={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover opacity-50 will-change-transform"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* =========================================
          LAYER 1: HEADER
          ========================================= */}
      <div className="w-full pt-6 md:pt-8 pb-4 px-8 md:px-20 shrink-0 bg-gradient-to-b from-black/90 to-transparent relative z-30">
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-white leading-none drop-shadow-lg">
          {t.title}
        </h2>
        <div className="w-8 md:w-12 h-1 bg-white mt-3 drop-shadow-lg" />
      </div>

      {/* =========================================
          LAYER 2: KARTU TENGAH
          ========================================= */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center z-10 min-h-0">
        <div className="w-full max-w-4xl h-full mx-auto flex items-center justify-center relative px-6 z-20 shrink-0">
          <div className="absolute left-2 md:-left-12 z-20">
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => {
                    setCurrentIndex((prev) => prev - 1);
                    // PERBAIKAN: Hapus setHasInteracted(true) dari sini agar overlay tidak hilang!
                  }}
                  className="p-3 md:p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] pointer-events-auto"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={works[currentIndex].id}
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onMouseEnter={() => setHasInteracted(true)}
                onTouchStart={() => setHasInteracted(true)}
                className="w-full flex flex-col items-center gap-3 pointer-events-auto"
              >
                <TiltedCard
                  imageSrc={works[currentIndex].imageSrc}
                  imageLayers={works[currentIndex].imageLayers}
                  altText={works[currentIndex].title}
                  captionText={works[currentIndex].title}
                  {...cardSizeProps}
                  rotateAmplitude={isMobile ? 25 : 15}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <>
                      <div className="absolute top-0 left-0 w-full h-full p-2 md:p-3 flex items-start justify-start pointer-events-none z-10">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl px-2 py-1 md:px-3 md:py-1.5 border border-white/20 shadow-lg">
                          <p className="text-white font-black text-[9px] md:text-xs text-left uppercase tracking-tighter drop-shadow-md">
                            {works[currentIndex].title}
                          </p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {!hasInteracted && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-black/70 backdrop-blur-[2px] rounded-[15px] flex items-center justify-center pointer-events-none z-20"
                          >
                            <div className="text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 uppercase tracking-[0.3em] animate-pulse drop-shadow-2xl border border-white/20 rounded-full bg-black/40">
                              {isMobile ? "Drag Me" : "Hover Me"}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  }
                />

                <div className="text-center space-y-1 max-w-md px-4 shrink-0 mt-1 drop-shadow-lg">
                  <span className="text-[8px] md:text-[9px] text-zinc-300 font-bold uppercase tracking-[0.4em]">
                    {works[currentIndex].category}
                  </span>
                  <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white">
                    {works[currentIndex].title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-zinc-300 font-medium leading-snug">
                    {works[currentIndex].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute right-2 md:-right-12 z-20">
            <AnimatePresence>
              {currentIndex < works.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    // PERBAIKAN: Hapus setHasInteracted(true) dari sini agar overlay tidak hilang!
                  }}
                  className="p-3 md:p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)] pointer-events-auto"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* =========================================
          LAYER 3: FOOTER
          ========================================= */}
      <div className="w-full shrink-0 flex flex-col items-center pt-6 pb-3 md:pb-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent relative z-30">
        <div className="mt-0 mb-3 pointer-events-auto shrink-0 z-10 flex items-center gap-6 md:gap-10">
          <button
            onClick={skipBackward}
            className="text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>

          <button
            onClick={togglePlay}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-[600ms] flex items-center justify-center shadow-2xl group/play
              ${isPlaying ? "border-white bg-white text-black scale-110" : "border-white bg-transparent text-white hover:border-black hover:bg-black hover:scale-105"}
            `}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" />
            ) : (
              <Play
                className="w-5 h-5 md:w-7 md:h-7 translate-x-0.5"
                fill="currentColor"
              />
            )}
          </button>

          <button
            onClick={skipForward}
            className="text-zinc-400 hover:text-white transition-colors active:scale-90"
          >
            <RotateCw className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex gap-2 mb-3 pointer-events-auto">
          {works.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 transition-all duration-500 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-zinc-600"}`}
            />
          ))}
        </div>

        <button
          onClick={onBack}
          className="w-full pt-3 pb-2 md:pb-3 border-t border-white/10 text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-400 hover:text-white transition-colors text-center pointer-events-auto"
        >
          {t.back}
        </button>
      </div>

      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .touch-action-none { touch-action: none; } 
      `}</style>
    </div>
  );
}
