"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Rewind,
  FastForward,
} from "lucide-react";
import TiltedCard from "./tiltedcard";

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

  // State untuk menyimpan intensitas bass (0-255)
  const [bassIntensity, setBassIntensity] = useState(0);

  // Referensi Audio & Visualizer
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State untuk melacak titik awal sentuhan jari
  const initialTouchRef = useRef<{ x: number; y: number } | null>(null);
  const dragRotateX = useMotionValue(0);
  const dragRotateY = useMotionValue(0);

  // Deteksi Mobile
  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      setBassIntensity(0);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current,
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      // Menggunakan 4096 untuk resolusi frekuensi ~10.7Hz per bin
      analyserRef.current.fftSize = 4096;
    }

    const analyser = analyserRef.current!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      analyser.getByteFrequencyData(dataArray);

      // FOKUS NARROW: Hanya mengambil rentang 3 bin (Indeks 8, 9, 10)
      // Ini mengunci area ~86Hz sampai ~118Hz (pusat 90-100Hz)
      let targetSum = 0;
      const targetBins = [7];
      targetBins.forEach((i) => {
        targetSum += dataArray[i];
      });

      const averageTarget = targetSum / targetBins.length;

      // SENSITIVITAS & THRESHOLD:
      // Multiplier dinaikkan ke 1.8 agar lebih "nyentak" (Sensitive)
      // Threshold 50 agar background tetap polos/hitam jika tidak ada kick yang dominan
      const sensitiveBass = averageTarget > 70 ? averageTarget * 0.5 : 0;

      setBassIntensity(Math.min(255, sensitiveBass));
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Data Portofolio (Path audio 100% UTUH sesuai kodinganmu)
  const works = [
    {
      id: 1,
      title: "Samidare (cover)",
      image: "/samidare.jpeg",
      audioSrc: "/samidare.flac",
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
      image: "/we-wish-you-a-merry-christmas.jpeg",
      audioSrc: "/we-wish-you-a-merry-christmas.mp3",
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
      image: "/fatality.jpeg",
      audioSrc: "/fatality.wav",
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
      image: "/budapeslogo.png",
      audioSrc: "/the-seeds-of-your-sorrow-splitting-ibex.wav",
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
      image: "/budapeslogo.png",
      audioSrc: "/home-avec.flac",
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

  // Handle Tilt Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    initialTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || !initialTouchRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - initialTouchRef.current.x;
    const deltaY = touch.clientY - initialTouchRef.current.y;
    const clampedDeltaX = Math.max(-100, Math.min(100, deltaX));
    const clampedDeltaY = Math.max(-100, Math.min(100, deltaY));
    dragRotateY.set((clampedDeltaX / 100) * 25);
    dragRotateX.set(-(clampedDeltaY / 100) * 25);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    dragRotateX.set(0);
    dragRotateY.set(0);
    initialTouchRef.current = null;
  };

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [currentIndex]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Penting: Resume AudioContext karena browser memblokir audio otomatis
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime -= 5;
  };
  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 5;
  };

  const cardSizeProps = isMobile
    ? {
        containerHeight: "calc(80vw * 1.1)",
        containerWidth: "80vw",
        imageHeight: "calc(80vw * 1.1)",
        imageWidth: "80vw",
        className: "max-w-[280px] max-h-[308px]",
      }
    : {
        containerHeight: "350px",
        containerWidth: "350px",
        imageHeight: "350px",
        imageWidth: "350px",
      };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 w-full h-[100dvh] bg-black overflow-x-hidden overflow-y-auto z-50 scrollbar-hide flex flex-col items-center"
    >
      {/* =========================================
          RADIAL BACKGROUND (BASS REACTIVE)
          ========================================= */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isPlaying ? 1 : 0,
          background: `radial-gradient(circle at center, rgba(255,255,255,${(bassIntensity / 255) * 0.2}) 0%, transparent ${40 + (bassIntensity / 255) * 40}%)`,
        }}
      />
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          scale: 1 + (bassIntensity / 255) * 0.3,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,${(bassIntensity / 255) * 0.1}) 0%, transparent 70%)`,
        }}
      />

      <audio
        ref={audioRef}
        src={works[currentIndex].audioSrc}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="min-h-full w-full flex flex-col text-white pb-4 z-10">
        {/* HEADER */}
        <div className="w-full pt-20 md:pt-24 pb-2 px-8 md:px-20 shrink-0">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white leading-none">
            {t.title}
          </h2>
          <div className="w-12 h-1 bg-white mt-4" />
        </div>

        {/* SLIDER AREA */}
        <div className="flex-1 w-full max-w-4xl mx-auto flex items-center justify-center relative px-6 py-4 shrink-0 z-0">
          <div className="absolute left-2 md:-left-12 z-20">
            <AnimatePresence>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="p-3 md:p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div
            className="w-full flex flex-col items-center"
            style={{ perspective: "1000px" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={works[currentIndex].id}
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  rotateX: isMobile ? dragRotateX : 0,
                  rotateY: isMobile ? dragRotateY : 0,
                  transformStyle: "preserve-3d",
                }}
                className="w-full flex flex-col items-center gap-4 md:gap-6 pointer-events-auto"
              >
                <TiltedCard
                  imageSrc={works[currentIndex].image}
                  altText={works[currentIndex].title}
                  captionText={works[currentIndex].title}
                  {...cardSizeProps}
                  rotateAmplitude={isMobile ? 0 : 15}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="flex items-center justify-center w-full h-full bg-black/50 p-4">
                      <p className="text-white font-black text-xl text-center uppercase tracking-tighter shadow-black drop-shadow-md">
                        {works[currentIndex].title}
                      </p>
                    </div>
                  }
                />

                <div className="text-center space-y-2 max-w-md px-4 mt-2 shrink-0">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">
                    {works[currentIndex].category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
                    {works[currentIndex].title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed">
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
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="p-3 md:p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full shrink-0 flex flex-col items-center mt-auto pt-2">
          <div className="mt-0 mb-4 pointer-events-auto shrink-0 z-10 flex items-center gap-6 md:gap-10">
            <button
              onClick={skipBackward}
              className="text-zinc-500 hover:text-white transition-colors active:scale-90"
            >
              <Rewind className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 transition-all duration-[600ms] flex items-center justify-center shadow-2xl group/play
                ${isPlaying ? "border-white bg-white text-black scale-110" : "border-white bg-transparent text-white hover:border-black hover:bg-black hover:scale-105"}
              `}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
              ) : (
                <Play
                  className="w-6 h-6 md:w-8 md:h-8 translate-x-0.5"
                  fill="currentColor"
                />
              )}
            </button>

            <button
              onClick={skipForward}
              className="text-zinc-500 hover:text-white transition-colors active:scale-90"
            >
              <FastForward
                className="w-6 h-6 md:w-8 md:h-8"
                fill="currentColor"
              />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {works.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 transition-all duration-500 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-zinc-800"}`}
              />
            ))}
          </div>

          <button
            onClick={onBack}
            className="w-full pt-4 pb-4 md:pb-6 border-t border-zinc-900 text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-colors text-center"
          >
            {t.back}
          </button>
        </div>
      </div>

      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
