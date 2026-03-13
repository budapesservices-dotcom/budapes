"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientWork({
  lang,
  onBack,
}: {
  lang: string;
  onBack: () => void;
}) {
  // =========================================
  // 1. DATA KLIEN (DIPERBARUI)
  // =========================================
  const originalClients = [
    {
      id: 0,
      clientName: "EVAN NAGAO",
      projectName: "Modern Monk Album",
      role: "MIXING & MASTERING • HONOLULU, HAWAII",
      imageSrc: "/portfolio/client/evannagao.png",
      desc:
        lang === "id"
          ? "Melakukan proses mixing dan mastering untuk lagu 'The Best Place' (Soul Session) dari album Modern Monk."
          : "Mixed and mastered the track 'The Best Place' (Soul Session) for the Modern Monk album.",
    },
    {
      id: 1,
      clientName: "DEANNA YUSOFF",
      projectName: "Secret of Serenity",
      role: "SOUND EDITOR & COMPOSER • MALAYSIA",
      imageSrc: "/portfolio/client/deannayusoff.png",
      desc:
        lang === "id"
          ? "Bertanggung jawab atas pembersihan dialog, penataan audio, dan pengaransemen soundtrack untuk e-book 'Deanna's Secret of Serenity'."
          : "Responsible for dialogue cleanup, audio arrangement, and soundtrack composition for the e-book 'Deanna's Secret of Serenity'.",
    },
    {
      id: 2,
      clientName: "BILLY PISSIOS",
      projectName: "Billy Photography",
      role: "MUSIC COMPOSER • CHICAGO",
      imageSrc: "/portfolio/client/billyphotography.png",
      desc:
        lang === "id"
          ? "Mengaransemen musik latar belakang (background music) khusus untuk konten motion photography di situs web Billy Photography."
          : "Arranged and composed custom background music for motion photography content on the Billy Photography website.",
    },
  ];

  const clients = [...originalClients, ...originalClients];
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeOriginalIndex = clients[currentIndex].id;

  const t = {
    id: { back: "Kembali", more: "Selengkapnya" },
    en: { back: "Back", more: "View Details" },
  }[lang as "id" | "en"];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % clients.length);
  };

  const getOffset = (index: number) => {
    let diff = index - currentIndex;
    if (diff < -2) diff += clients.length;
    if (diff > 3) diff -= clients.length;
    return diff;
  };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] bg-[#050505] overflow-hidden z-50 flex font-sans">
      {/* Background Gelap */}
      <div className="absolute inset-0 bg-[#050505] z-0">
        <div className="absolute inset-0 opacity-[0.04] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* =========================================
          LAYER 1: TOMBOL KEMBALI
          ========================================= */}
      <div className="absolute top-11 right-[114px] sm:right-[154px] z-50 pointer-events-auto">
        <button
          onClick={onBack}
          className="h-9 sm:h-10 px-4 sm:px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-[9px] font-bold tracking-[0.2em] uppercase group"
        >
          <ChevronLeft
            className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform"
            strokeWidth={2}
          />
          {t.back}
        </button>
      </div>

      {/* =========================================
          LAYER 2: TEKS ANCHOR 
          ========================================= */}
      <div className="absolute left-0 bottom-[15vh] md:top-1/2 md:bottom-auto md:-translate-y-1/2 w-full md:w-[50%] flex flex-col pl-6 md:pl-20 pr-[80px] md:pr-0 z-40 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeOriginalIndex}
            initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 30, filter: "blur(5px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
              <div className="w-8 md:w-10 h-[1px] bg-white/20" />
              <p className="text-white/50 text-[8px] md:text-[12px] font-bold tracking-[0.6em] uppercase">
                {originalClients[activeOriginalIndex].role}
              </p>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-1 md:mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-display">
              {originalClients[activeOriginalIndex].clientName}
            </h1>

            <h3 className="text-lg sm:text-xl md:text-3xl font-light text-white/90 mb-2 md:mb-6 tracking-wide drop-shadow-md">
              — {originalClients[activeOriginalIndex].projectName}
            </h3>

            {/* hidden md:block: Sembunyikan deskripsi di HP */}
            <p className="hidden md:block text-[10px] md:text-base text-zinc-400 leading-relaxed font-light max-w-[90%] md:max-w-sm drop-shadow-md">
              {originalClients[activeOriginalIndex].desc}
            </p>

            <div className="mt-4 md:mt-10 pointer-events-auto inline-block">
              <button className="h-10 md:h-14 px-6 md:px-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase group">
                {t.more}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================
          LAYER 3: SHADOW PELINDUNG TEKS
          ========================================= */}
      <div className="absolute left-0 bottom-0 md:top-0 w-full md:w-[60%] h-[55%] md:h-full bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-[#050505]/95 md:via-[#050505]/80 to-transparent z-30 pointer-events-none" />

      {/* =========================================
          LAYER 4: CAROUSEL GAMBAR 
          ========================================= */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center overflow-hidden">
        {clients.map((client, index) => {
          const offset = getOffset(index);

          let targetLeft = "130%";
          let targetScale = 0.5;
          let targetOpacity = 0;
          let targetFilter = "grayscale(100%) blur(10px)";
          let targetZIndex = 10;

          if (offset === 0) {
            targetLeft = "50%";
            targetScale = 1.25;
            targetOpacity = 1;
            targetFilter = "grayscale(0%) blur(0px)";
            targetZIndex = 50;
          } else if (offset === 1) {
            targetLeft = "88%";
            targetScale = 1.15;
            targetOpacity = 0.5;
            targetFilter = "grayscale(100%) blur(0px)";
            targetZIndex = 40;
          } else if (offset === 2) {
            targetLeft = "115%";
            targetScale = 0.95;
            targetOpacity = 0.15;
            targetFilter = "grayscale(100%) blur(0px)";
            targetZIndex = 30;
          } else if (offset === -1) {
            targetLeft = "10%";
            targetScale = 1.1;
            targetOpacity = 0;
            targetFilter = "grayscale(100%) blur(10px)";
            targetZIndex = 45;
          }

          return (
            <motion.div
              key={`${client.id}-${index}`}
              animate={{
                left: targetLeft,
                x: "-50%",
                scale: targetScale,
                opacity: targetOpacity,
                filter: targetFilter,
                zIndex: targetZIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 22,
                mass: 0.8,
              }}
              className="absolute bottom-[20vh] md:bottom-0 h-[50vh] md:h-[90vh] w-[140vw] md:w-full origin-bottom flex justify-center items-end"
            >
              <div
                className="w-full h-full flex justify-center"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
              >
                <img
                  src={client.imageSrc}
                  alt={client.clientName}
                  className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#050505] to-transparent z-25 pointer-events-none" />

      {/* =========================================
          LAYER 5: TOMBOL NEXT AREA KANAN
          ========================================= */}
      <div className="absolute right-6 md:right-12 bottom-[13vh] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none">
        <button
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 group shadow-2xl"
        >
          <ChevronRight
            className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform"
            strokeWidth={1.5}
          />
        </button>
      </div>

      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
      `}</style>
    </div>
  );
}
