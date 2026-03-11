"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export default function ClientWork({
  lang,
  onBack,
}: {
  lang: string;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // =========================================
  // DATA KLIEN (Ganti dengan data aslimu)
  // Pastikan gambar klien beresolusi tinggi (landscape/16:9)
  // =========================================
  const clients = [
    {
      id: 1,
      clientName: "EPIC RECORDS",
      projectName: "The Symphony of Silence",
      role: "MIXING & MASTERING",
      imageSrc: "/portfolio/client/client1.jpg",
      desc:
        lang === "id"
          ? "Membentuk lanskap suara yang epik untuk album debut yang menduduki puncak tangga lagu, memastikan setiap instrumen bernapas dalam harmoni yang sempurna."
          : "Sculpting an epic soundscape for a chart-topping debut album, ensuring every instrument breathes in perfect harmony.",
      year: "2024",
    },
    {
      id: 2,
      clientName: "NEXUS FILMS",
      projectName: "Echoes of Tomorrow",
      role: "SOUND DESIGN & SCORING",
      imageSrc: "/portfolio/client/client2.jpg",
      desc:
        lang === "id"
          ? "Menciptakan desain suara futuristik dan komposisi orkestra hibrida untuk kampanye sinematik pemenang penghargaan."
          : "Crafting futuristic sound design and hybrid orchestral compositions for an award-winning cinematic campaign.",
      year: "2023",
    },
    {
      id: 3,
      clientName: "AURORA MUSIC",
      projectName: "Midnight Reverie EP",
      role: "MUSIC PRODUCTION",
      imageSrc: "/portfolio/client/client3.jpg",
      desc:
        lang === "id"
          ? "Eksplorasi berani yang memadukan kehangatan instrumen analog dengan ketajaman elemen elektronik modern."
          : "A bold exploration blending the warmth of analog instruments with the sharpness of modern electronic elements.",
      year: "2023",
    },
  ];

  const t = {
    id: {
      back: "Kembali ke Menu Utama",
      title: "KARYA KLIEN",
      viewProject: "Lihat Proyek",
    },
    en: {
      back: "Back to Main Menu",
      title: "CLIENT WORKS",
      viewProject: "View Project",
    },
  }[lang as "id" | "en"];

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === clients.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? clients.length - 1 : prev - 1));
  };

  // Varian animasi untuk gambar latar belakang (Parallax Geser)
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "20%" : "-20%",
        opacity: 0,
        scale: 1.1,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "20%" : "-20%",
        opacity: 0,
        scale: 1.1,
      };
    },
  };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] bg-black overflow-hidden z-50 flex flex-col font-sans">
      {/* =========================================
          LAYER 1: HEADER MENGAMBANG
          ========================================= */}
      <div className="absolute top-0 left-0 w-full pt-8 md:pt-12 px-8 md:px-20 z-40 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl">
            {t.title}
          </h2>
          <div className="w-8 md:w-12 h-1 bg-white mt-3 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Tombol Back di Kanan Atas untuk gaya Modern Minimalist */}
        <button
          onClick={onBack}
          className="pointer-events-auto group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-colors">
            {t.back}
          </span>
        </button>
      </div>

      {/* =========================================
          LAYER 2: CINEMATIC FULL-BLEED SLIDER
          ========================================= */}
      <div className="relative flex-1 w-full h-full bg-black overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.6 },
              scale: { duration: 0.8 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* GAMBAR KLIEN */}
            <div className="absolute inset-0 bg-zinc-900">
              <img
                src={clients[currentIndex].imageSrc}
                alt={clients[currentIndex].clientName}
                className="w-full h-full object-cover opacity-60 md:opacity-80"
              />
            </div>

            {/* GRADIENT GELAP: Fokuskan visual ke bawah agar teks dominan */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

            {/* EFEK NOISE (Bintik Kamera Film) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* KONTEN TEKS CINEMATIC (Diposisikan di Kiri Bawah) */}
            <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-24 md:pb-32 z-20 pointer-events-none">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="max-w-5xl"
              >
                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 mb-3">
                  <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                    {clients[currentIndex].clientName}
                  </h1>
                  <span className="text-zinc-400 text-lg md:text-4xl font-light italic mb-2 md:mb-6 shrink-0">
                    {clients[currentIndex].year}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[2px] w-12 bg-indigo-500" />
                  <p className="text-indigo-400 text-[10px] md:text-sm font-bold tracking-[0.4em] md:tracking-[0.6em] uppercase drop-shadow-lg">
                    {clients[currentIndex].role}
                  </p>
                </div>

                <div className="max-w-2xl">
                  <h3 className="text-xl md:text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                    {clients[currentIndex].projectName}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium line-clamp-3 md:line-clamp-none drop-shadow-md">
                    {clients[currentIndex].desc}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =========================================
            NAVIGASI SLIDER (Diposisikan Melayang di Kanan Bawah)
            ========================================= */}
        <div className="absolute bottom-8 md:bottom-20 right-8 md:right-20 flex gap-4 z-30">
          <button
            onClick={prevSlide}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/30 bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all shadow-2xl group"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/30 bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all shadow-2xl group"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Indikator Garis (Line Pagination) */}
        <div className="absolute bottom-10 left-8 md:left-20 flex gap-2 z-30">
          {clients.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 transition-all duration-500 rounded-full ${
                idx === currentIndex
                  ? "w-16 md:w-24 bg-white"
                  : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
      `}</style>
    </div>
  );
}
