"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight } from "lucide-react";

export default function Portfolio({
  onClose,
  lang,
}: {
  onClose: () => void;
  lang: string;
}) {
  // STATE
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Deteksi Mobile vs Desktop untuk membedakan Timing Animasi
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Cek saat pertama kali dimuat
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Kamus Bahasa
  const t = {
    id: {
      close: "Tutup Portofolio",
      original: "KARYA ORIGINAL",
      client: "KARYA KLIEN",
      originalSub: "Eksplorasi idealisme dan visi murni Budapes Studio.",
      clientSub: "Kolaborasi profesional dan eksekusi komersial.",
      confirmTap: "Tap lagi untuk masuk →",
    },
    en: {
      close: "Close Portfolio",
      original: "ORIGINAL WORKS",
      client: "CLIENT WORKS",
      originalSub: "Exploration of pure idealism and Budapes vision.",
      clientSub: "Professional collaborations and commercial execution.",
      confirmTap: "Tap again to enter →",
    },
  }[lang as "id" | "en"];

  // LOGIKA INTERAKSI
  const handleAction = (type: string) => {
    console.log("Membuka Galeri:", type);
    // TODO: Nanti kita tambahkan state untuk memunculkan Grid Kartu di sini
  };

  const handleInteraction = (sectionId: string) => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      if (clickedSection === sectionId) {
        handleAction(sectionId);
      } else {
        setClickedSection(sectionId);
      }
    } else {
      handleAction(sectionId);
    }
  };

  const handleMouseEnter = (sectionId: string) => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches
    ) {
      setHoveredSection(sectionId);
    }
  };

  const handleMouseLeave = () => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches
    ) {
      setHoveredSection(null);
    }
  };

  // KOMPONEN REUSABLE UNTUK SESI
  const renderSection = (
    id: string,
    title: string,
    subtitle: string,
    videoFile: string,
  ) => {
    const isActive = hoveredSection === id || clickedSection === id;

    return (
      <section
        onClick={() => setClickedSection(null)}
        className={`relative w-full h-screen shrink-0 snap-start flex flex-col justify-center px-8 md:px-20 transition-all duration-[800ms] ease-in-out overflow-hidden
          ${isActive ? "bg-white text-black" : "bg-black/80 backdrop-blur-sm text-white"}
        `}
      >
        {/* =========================================
            EFEK VIDEO TINTA
            ========================================= */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              // TIMING MAKIN CEPAT DI HP: isMobile delay cuma 0.1s
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: isMobile ? 0.1 : 0.8, duration: 0.3 },
              }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              // POSISI HP NAIK: dari bottom-12 menjadi bottom-28
              className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[95%] md:left-auto md:translate-x-0 md:right-0 md:bottom-0 md:w-3/5 md:max-w-7xl z-0 aspect-[16/10] overflow-hidden pointer-events-none md:origin-bottom-right"
            >
              <div className="absolute inset-0 z-10 bg-transparent w-full h-full" />

              <video
                src={videoFile}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain opacity-100 pointer-events-none select-none"
                onContextMenu={(e) => e.preventDefault()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOMBOL TUTUP */}
        {id === "original" && (
          <button
            onClick={onClose}
            className={`absolute top-10 md:top-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 group/btn transition-all duration-700
              ${isActive ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
            `}
          >
            <span className="text-[9px] md:text-[11px] font-black tracking-[0.6em] text-white/50 group-hover/btn:text-white uppercase transition-colors text-center">
              {t.close}
            </span>
            <div className="w-1 h-[2px] bg-white/20 group-hover/btn:w-16 group-hover/btn:bg-white transition-all duration-500" />
          </button>
        )}

        {/* KONTEN UTAMA */}
        <div className="relative z-10 flex flex-col items-start -mt-12 md:-mt-24 pointer-events-none">
          <h2 className="text-[11vw] md:text-[7rem] lg:text-[9rem] font-display font-black uppercase leading-[0.85] tracking-tighter drop-shadow-lg">
            {title}
          </h2>

          <div className="mt-6 md:mt-10 flex items-center gap-4 md:gap-6 min-h-[60px] md:min-h-[80px] pointer-events-auto">
            <div
              onMouseEnter={() => !isMobile && setHoveredSection(id)}
              onMouseLeave={() => !isMobile && setHoveredSection(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleInteraction(id);
              }}
              className={`w-12 h-12 md:w-20 md:h-20 rounded-full border transition-all duration-[600ms] cursor-pointer flex items-center justify-center shrink-0 shadow-2xl
                ${isActive ? "border-black bg-black text-white md:scale-110" : "border-white/20 bg-transparent text-white"}
              `}
            >
              <MoveRight
                className={`w-5 h-5 md:w-8 md:h-8 transition-transform duration-500 ${isActive ? "translate-x-1 md:translate-x-2" : ""}`}
              />
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: -20 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden flex flex-col justify-center pl-2"
                >
                  <div className="whitespace-normal w-[200px] md:w-auto md:whitespace-nowrap pl-2 space-y-1 md:space-y-2 relative z-10 text-left pointer-events-none">
                    <span
                      className={`text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase leading-relaxed block transition-colors duration-[800ms]
                      ${isActive ? "text-black font-semibold" : "text-zinc-400"}
                    `}
                    >
                      {subtitle}
                    </span>
                    {clickedSection === id && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-[8px] md:text-[10px] font-bold tracking-widest uppercase animate-pulse block sm:hidden
                          ${isActive ? "text-black" : "text-white"}
                        `}
                      >
                        {t.confirmTap}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* INDIKATOR SCROLL */}
        {id === "original" && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30 transition-opacity duration-500 pointer-events-none">
            <div className="w-[1px] h-12 bg-white mx-auto"></div>
          </div>
        )}
      </section>
    );
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col font-sans overflow-y-auto overflow-x-hidden snap-y snap-mandatory scrollbar-hide"
      style={{ scrollBehavior: "smooth" }}
    >
      {renderSection(
        "original",
        t.original,
        t.originalSub,
        "/originalworkintro.mp4",
      )}
      {renderSection("client", t.client, t.clientSub, "/clientworkintro.mp4")}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
