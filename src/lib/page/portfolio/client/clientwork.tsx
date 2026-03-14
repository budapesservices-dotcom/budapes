"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// =========================================
// KOMPONEN EFEK MESIN TIK (DIOPTIMASI - TANPA BLUR)
// =========================================
const TypewriterText = ({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const letters = Array.from(text);
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: delay }, // Sedikit dipercepat
    },
  };
  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { damping: 15, stiffness: 200 },
    },
    hidden: { opacity: 0, y: 10 }, // Blur dihapus agar HP tidak lag
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap ${className}`}
      style={{ willChange: "opacity" }}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const TypewriterWord = ({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) => {
  const words = text.split(" ");
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: 5 }, // Blur dihapus
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap gap-[0.25em] ${className}`}
      style={{ willChange: "opacity" }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// =========================================
// KOMPONEN UTAMA CLIENT WORK
// =========================================
export default function ClientWork({
  lang,
  onBack,
}: {
  lang: string;
  onBack: () => void;
}) {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const originalClients = [
    {
      id: 0,
      clientName: "EVAN NAGAO",
      projectName: "Modern Monk Album",
      role: "MIXING & MASTERING • HONOLULU, HAWAII",
      imageSrc: "/portfolio/client/evannagao.png",
      themeColor: "from-[#2e1708] via-[#050505] to-[#050505]",
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
      themeColor: "from-[#0a1128] via-[#050505] to-[#050505]",
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
      themeColor: "from-[#1c1f21] via-[#050505] to-[#050505]",
      desc:
        lang === "id"
          ? "Mengaransemen musik latar belakang khusus untuk konten motion photography di situs web Billy Photography."
          : "Arranged and composed custom background music for motion photography content on the Billy Photography website.",
    },
  ];

  const clients = [...originalClients, ...originalClients];
  const activeOriginalIndex = clients[currentIndex].id;

  const t = {
    id: { back: "Kembali", more: "Selengkapnya" },
    en: { back: "Back", more: "View Details" },
  }[lang as "id" | "en"];

  const nextSlide = () => {
    if (isDetailMode) return;
    setCurrentIndex((prev) => (prev + 1) % clients.length);
  };

  const handleBack = () => {
    if (isDetailMode) {
      setIsDetailMode(false);
    } else {
      onBack();
    }
  };

  const getOffset = (index: number) => {
    let diff = index - currentIndex;
    if (diff < -2) diff += clients.length;
    if (diff > 3) diff -= clients.length;
    return diff;
  };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] bg-[#050505] overflow-hidden z-50 flex font-sans">
      <motion.div
        className={`absolute inset-0 w-full h-full bg-gradient-to-br ${isDetailMode ? clients[activeOriginalIndex].themeColor : "from-[#050505] via-[#050505] to-[#050505]"} z-0`}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </motion.div>

      <div className="absolute top-11 right-[114px] sm:right-[154px] z-50 pointer-events-auto">
        <button
          onClick={handleBack}
          className="h-9 sm:h-10 px-4 sm:px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-[9px] font-bold tracking-[0.2em] uppercase group"
        >
          <ChevronLeft
            className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform"
            strokeWidth={2}
          />
          {t.back}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isDetailMode && (
          <motion.div
            key={`giant-${activeOriginalIndex}`}
            initial={{ opacity: 0, x: -30 }} // Blur dihapus
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }} // Blur dihapus
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-0 bottom-[15vh] md:top-1/2 md:bottom-auto md:-translate-y-1/2 w-full md:w-[50%] flex flex-col pl-6 md:pl-20 pr-[80px] md:pr-0 z-40 pointer-events-none"
            style={{ willChange: "transform, opacity" }} // Hardware Acceleration
          >
            <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-4">
              <div className="w-8 md:w-10 h-[1px] bg-white/20" />
              <p className="text-white/50 text-[8px] md:text-[10px] font-bold tracking-[0.6em] uppercase">
                {originalClients[activeOriginalIndex].role}
              </p>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-[0.85] mb-1 md:mb-6 drop-shadow-xl font-display">
              {originalClients[activeOriginalIndex].clientName}
            </h1>

            <h3 className="text-lg sm:text-xl md:text-3xl font-light text-white/90 mb-2 md:mb-6 tracking-wide drop-shadow-md">
              — {originalClients[activeOriginalIndex].projectName}
            </h3>

            <p className="hidden md:block text-[10px] md:text-base text-zinc-400 leading-relaxed font-light max-w-[90%] md:max-w-sm drop-shadow-md">
              {originalClients[activeOriginalIndex].desc}
            </p>

            <div className="mt-4 md:mt-10 pointer-events-auto inline-block">
              <button
                onClick={() => setIsDetailMode(true)}
                className="h-10 md:h-14 px-6 md:px-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase group"
              >
                {t.more}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailMode && (
          <motion.div
            key={`detail-${activeOriginalIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute top-[18vh] md:top-[25vh] left-6 md:left-20 w-[80%] md:w-[45%] z-40 pointer-events-none flex flex-col"
            style={{ willChange: "opacity" }}
          >
            <TypewriterText
              text={originalClients[activeOriginalIndex].clientName}
              delay={0.2}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white font-display mb-1 md:mb-2 drop-shadow-lg"
            />

            <TypewriterText
              text={`— ${originalClients[activeOriginalIndex].projectName}`}
              delay={0.6}
              className="text-lg md:text-2xl font-light text-white/90 mb-6 tracking-wide drop-shadow-md"
            />

            <div className="flex items-center gap-3 md:gap-4 mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "2.5rem" }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="h-[1px] bg-white/30"
              />
              <TypewriterText
                text={originalClients[activeOriginalIndex].role}
                delay={1.0}
                className="text-white/60 text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase"
              />
            </div>

            <TypewriterWord
              text={originalClients[activeOriginalIndex].desc}
              delay={1.4}
              className="text-xs md:text-base text-zinc-300 leading-relaxed font-light md:max-w-md drop-shadow-md"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-0 bottom-0 md:top-0 w-full md:w-[60%] h-[55%] md:h-full bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-[#050505]/95 md:via-[#050505]/80 to-transparent z-30 pointer-events-none" />

      {/* CAROUSEL GAMBAR (DIOPTIMASI) */}
      <div className="absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center overflow-hidden">
        {clients.map((client, index) => {
          const offset = getOffset(index);

          let targetLeft = "130%";
          let targetScale = 0.5;
          let targetOpacity = 0;
          let targetZIndex = 10;

          // Animasi grayscale dan blur pada targetFilter dihapus total demi performa mobile
          if (isDetailMode) {
            if (offset === 0) {
              targetLeft = "75%";
              targetScale = 1.05;
              targetOpacity = 1;
              targetZIndex = 50;
            } else {
              targetLeft = "150%";
              targetOpacity = 0;
            }
          } else {
            if (offset === 0) {
              targetLeft = "50%";
              targetScale = 1.25;
              targetOpacity = 1;
              targetZIndex = 50;
            } else if (offset === 1) {
              targetLeft = "88%";
              targetScale = 1.15;
              targetOpacity = 0.5;
              targetZIndex = 40;
            } else if (offset === 2) {
              targetLeft = "115%";
              targetScale = 0.95;
              targetOpacity = 0.15;
              targetZIndex = 30;
            } else if (offset === -1) {
              targetLeft = "10%";
              targetScale = 1.1;
              targetOpacity = 0;
              targetZIndex = 45;
            }
          }

          return (
            <motion.div
              key={`${client.id}-${index}`}
              animate={{
                left: targetLeft,
                x: "-50%",
                scale: targetScale,
                opacity: targetOpacity,
                zIndex: targetZIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 20,
                mass: 1,
              }}
              // Menambahkan willChange untuk Hardware Acceleration (GPU)
              style={{ willChange: "transform, left, opacity" }}
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
                {/* drop-shadow diturunkan dari 50px ke drop-shadow-2xl standar agar rendering ringan */}
                <img
                  src={client.imageSrc}
                  alt={client.clientName}
                  className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-2xl"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#050505] to-transparent z-25 pointer-events-none" />

      <AnimatePresence>
        {!isDetailMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute right-6 md:right-12 bottom-[13vh] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-none"
            style={{ willChange: "transform, opacity" }}
          >
            <button
              onClick={nextSlide}
              className="pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 group shadow-xl"
            >
              <ChevronRight
                className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
      `}</style>
    </div>
  );
}
