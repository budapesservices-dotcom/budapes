"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Rewind,
  FastForward,
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

  const audioValueRaw = useMotionValue(0);

  const smoothAudio = useSpring(audioValueRaw, {
    stiffness: 350,
    damping: 30,
    mass: 0.8,
  });

  const vignetteAlpha = useTransform(smoothAudio, [0, 255], [0, 0.4]);
  const vignetteSize = useTransform(smoothAudio, [0, 255], [100, 0]);
  const vignetteTemplate = useMotionTemplate`radial-gradient(circle at center, transparent ${vignetteSize}%, rgba(255,255,255,${vignetteAlpha}) 100%)`;

  const cardBounce = useTransform(smoothAudio, [0, 255], [1, 1.08]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      audioValueRaw.set(0);
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

      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.1;
    }

    const analyser = analyserRef.current!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualizer = () => {
      analyser.getByteFrequencyData(dataArray);

      const kickPeak = Math.max(dataArray[1], dataArray[2]);
      const normalized = kickPeak / 255;
      const impact = Math.pow(normalized, 4) * 120;

      audioValueRaw.set(impact);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, audioValueRaw]);

  // =========================================
  // DATA PORTOFOLIO DENGAN DUKUNGAN MULTI-LAYER
  // =========================================
  const works = [
    {
      id: 1,
      title: "Samidare (cover)",
      imageSrc: "/samidare.jpeg", // Fallback (jika gagal load)
      imageLayers: [
        "/portfolio/original/samidare/1.png", // Paling Belakang (Background)
        "/portfolio/original/samidare/2.png", // Tengah
        "/portfolio/original/samidare/3.png", // Depan
        "/portfolio/original/samidare/4.png", // Paling Depan
      ],
      audioSrc: "/portfolio/original/samidare/samidare.wav",
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
        "/portfolio/original/we-wish-you-a-merry-christmas/1.png", // Paling Belakang (Background)
        "/portfolio/original/we-wish-you-a-merry-christmas/2.png", // Tengah
        "/portfolio/original/we-wish-you-a-merry-christmas/3.png", // Depan
        "/portfolio/original/we-wish-you-a-merry-christmas/4.png", // Paling Depan
      ],
      audioSrc:
        "/portfolio/original/we-wish-you-a-merry-christmas/we-wish-you-a-merry-christmas.mp3",
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
      imageLayers: [],
      audioSrc: "/portfolio/original/fatality/fatality.wav",
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
      audioSrc:
        "/portfolio/original/the-seeds-of-your-sorrow/the-seeds-of-your-sorrow-splitting-ibex.wav",
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
      audioSrc: "/portfolio/original/home/home-avec.flac",
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
        containerHeight: "260px",
        containerWidth: "260px",
        imageHeight: "260px",
        imageWidth: "260px",
      }
    : {
        containerHeight: "350px",
        containerWidth: "350px",
        imageHeight: "350px",
        imageWidth: "350px",
      };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] bg-black overflow-x-hidden overflow-y-auto z-50 scrollbar-hide flex flex-col items-center">
      <motion.div
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-700"
        style={{
          opacity: isPlaying ? 1 : 0,
          background: vignetteTemplate,
        }}
      />

      <audio
        ref={audioRef}
        src={works[currentIndex].audioSrc}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="min-h-full w-full flex flex-col text-white pb-4 z-10">
        <div className="w-full pt-20 md:pt-24 pb-2 px-8 md:px-20 shrink-0">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white leading-none">
            {t.title}
          </h2>
          <div className="w-12 h-1 bg-white mt-4" />
        </div>

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
                  scale: cardBounce,
                }}
                className="w-full flex flex-col items-center gap-4 md:gap-6 pointer-events-auto"
              >
                <TiltedCard
                  // Masukkan imageSrc biasa & array imageLayers ke dalam komponen
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
                    <div className="absolute top-0 left-0 w-full h-full p-3 md:p-4 flex items-start justify-start pointer-events-none">
                      <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 md:px-4 md:py-2 border border-white/20 shadow-lg">
                        <p className="text-white font-black text-[10px] md:text-sm text-left uppercase tracking-tighter drop-shadow-md">
                          {works[currentIndex].title}
                        </p>
                      </div>
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

        <div className="w-full shrink-0 flex flex-col items-center mt-auto pt-2 z-50">
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
        .touch-action-none { touch-action: none; } 
      `}</style>
    </div>
  );
}
