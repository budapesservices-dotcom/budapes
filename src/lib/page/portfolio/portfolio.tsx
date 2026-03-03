"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight } from "lucide-react";
import OriginalWork from "./original/originalwork";

export default function Portfolio({
  onClose,
  lang,
}: {
  onClose: () => void;
  lang: string;
}) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // STATE ANIMASI & GALERI
  const [exitingSection, setExitingSection] = useState<string | null>(null);
  const [openedGallery, setOpenedGallery] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    id: {
      close: "Tutup Portofolio",
      original: "KARYA ORIGINAL",
      client: "KARYA KLIEN",
      originalSub: "Eksplorasi idealisme dan visi murni Budapes Studio.",
      clientSub: "Kolaborasi profesional dan eksekusi komersial.",
      confirmTap: "Tap lagi untuk masuk →",
      scrollDown: "Scroll ke bawah",
    },
    en: {
      close: "Close Portfolio",
      original: "ORIGINAL WORKS",
      client: "CLIENT WORKS",
      originalSub: "Exploration of pure idealism and Budapes vision.",
      clientSub: "Professional collaborations and commercial execution.",
      confirmTap: "Tap again to enter →",
      scrollDown: "Scroll down",
    },
  }[lang as "id" | "en"];

  // LOGIKA MASUK KE GALERI
  const handleAction = (sectionId: string) => {
    if (exitingSection) return;
    setExitingSection(sectionId);
    setTimeout(() => {
      setOpenedGallery(sectionId);
    }, 800);
  };

  const handleInteraction = (sectionId: string) => {
    if (exitingSection) return;
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      if (clickedSection === sectionId) handleAction(sectionId);
      else setClickedSection(sectionId);
    } else {
      handleAction(sectionId);
    }
  };

  const handleMouseEnter = (sectionId: string) => {
    if (exitingSection) return;
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches
    ) {
      setHoveredSection(sectionId);
    }
  };

  const handleMouseLeave = () => {
    if (exitingSection) return;
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: coarse)").matches
    ) {
      setHoveredSection(null);
    }
  };

  const renderSection = (
    id: string,
    title: string,
    subtitle: string,
    videoFile: string,
  ) => {
    const isActive = hoveredSection === id || clickedSection === id;
    const isThisExiting = exitingSection === id;

    // Background putih section
    const bgClass =
      isActive || isThisExiting
        ? "bg-white text-black"
        : "bg-black/80 backdrop-blur-sm text-white";

    // LOGIKA PARALLAX
    const parallaxY = id === "original" ? -80 : 80;

    return (
      <section
        onClick={() => !exitingSection && setClickedSection(null)}
        className={`relative w-full h-screen shrink-0 snap-start flex flex-col justify-center px-8 md:px-20 transition-all duration-[800ms] ease-in-out overflow-hidden ${bgClass}`}
      >
        {/* =========================================
            VIDEO TINTA (REVISI HILANG INSTAN)
            ========================================= */}
        <AnimatePresence>
          {isActive && !exitingSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: isMobile ? 0.1 : 0.8, duration: 0.3 },
              }}
              // PERBAIKAN DI SINI: duration diubah menjadi 0 agar hilang seketika saat hover dilepas
              exit={{ opacity: 0, transition: { duration: 0 } }}
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
              ${exitingSection ? "opacity-0 -translate-y-10 pointer-events-none" : isActive ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
            `}
          >
            <span className="text-[9px] md:text-[11px] font-black tracking-[0.6em] text-white/50 group-hover/btn:text-white uppercase transition-colors text-center">
              {t.close}
            </span>
            <div className="w-1 h-[2px] bg-white/20 group-hover/btn:w-16 group-hover/btn:bg-white transition-all duration-500" />
          </button>
        )}

        {/* KONTEN UTAMA DENGAN EFEK PARALLAX */}
        <motion.div
          initial={{ opacity: 0, y: parallaxY }}
          whileInView={
            isThisExiting ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-start -mt-12 md:-mt-24 pointer-events-none"
        >
          <h2 className="text-[11vw] md:text-[7rem] lg:text-[9rem] font-display font-black uppercase leading-[0.85] tracking-tighter drop-shadow-lg">
            {title}
          </h2>

          <div className="mt-6 md:mt-10 flex items-center gap-4 md:gap-6 min-h-[60px] md:min-h-[80px] pointer-events-auto">
            <div
              onMouseEnter={() =>
                !isMobile && !exitingSection && setHoveredSection(id)
              }
              onMouseLeave={() =>
                !isMobile && !exitingSection && setHoveredSection(null)
              }
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
                    {clickedSection === id && !exitingSection && (
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
        </motion.div>

        {/* INDIKATOR SCROLL DENGAN TEKS ABU-ABU */}
        {id === "original" && (
          <motion.div
            animate={
              exitingSection ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }
            }
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-500 pointer-events-none"
          >
            <div className="w-[1px] h-10 md:h-12 bg-white mx-auto animate-bounce opacity-30"></div>
            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase text-zinc-500 opacity-80">
              {t.scrollDown}
            </span>
          </motion.div>
        )}
      </section>
    );
  };

  // KANVAS INDUK (WRAPPER)
  const rootBgClass =
    exitingSection || openedGallery ? "bg-white" : "bg-transparent";

  return (
    <div
      className={`relative w-full h-screen font-sans overflow-hidden ${rootBgClass}`}
    >
      {/* 1. LAYER MENU */}
      {!openedGallery && (
        <div
          className={`w-full h-full flex flex-col snap-y snap-mandatory scrollbar-hide overflow-x-hidden ${exitingSection ? "overflow-y-hidden pointer-events-none" : "overflow-y-auto"}`}
          style={{ scrollBehavior: "smooth" }}
        >
          {renderSection(
            "original",
            t.original,
            t.originalSub,
            "/portfolio/original/other/originalworkintro.mp4",
          )}
          {renderSection(
            "client",
            t.client,
            t.clientSub,
            "/portfolio/client/other/clientworkintro.mp4",
          )}
        </div>
      )}

      {/* 2. LAYER GALERI */}
      {openedGallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full z-50"
        >
          {openedGallery === "original" ? (
            <OriginalWork
              lang={lang}
              onBack={() => {
                // Fungsi untuk mereset semua state dan menutup galeri
                setOpenedGallery(null);
                setExitingSection(null);
                setHoveredSection(null);
                setClickedSection(null);
              }}
            />
          ) : (
            // Placeholder untuk Karya Klien (nanti kita buat terpisah)
            <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
              <h2 className="text-4xl font-display uppercase">Karya Klien</h2>
              <p className="text-zinc-500 mt-4 uppercase tracking-widest text-xs">
                Segera Hadir
              </p>
              <button
                onClick={() => {
                  setOpenedGallery(null);
                  setExitingSection(null);
                  setHoveredSection(null);
                  setClickedSection(null);
                }}
                className="mt-8 text-[10px] font-bold tracking-[0.3em] uppercase border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Kembali ke Menu
              </button>
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
