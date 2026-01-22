"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import styles from "./not-found.module.css";

const content = {
  in: {
    label: "LIHAT DIRIMU",
    title: "DI LUAR\nBATAS NORMAL",
    desc: "Terkadang tersesat adalah bagian dari perjalanan. Namun, di sini hanya ada ruang hampa dan angka yang bisu. Mari kembali ke jalan ninjamu.",
    home: "Beranda",
    help: "Bantuan",
    game: "Mainkan Mini Game",
    studio: "BUDAPES STUDIO • LOSS OF CONNECTION",
  },
  en: {
    label: "LOOK AT YOURSELF",
    title: "OUTSIDE\nNORMAL LIMITS",
    desc: "Getting lost is part of the journey, they said. Well, they didn't mention this silent void. Go on, get back to your ninja path before it gets weirder.",
    home: "Home",
    help: "Help",
    game: "Play Mini Game",
    studio: "BUDAPES STUDIO • LOSS OF CONNECTION",
  },
};

const Blob = ({ color, size, initialPos }: any) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-[40px] opacity-[0.15] ${color}`}
      style={{
        width: size,
        height: size,
        left: initialPos.x,
        top: initialPos.y,
      }}
      animate={{
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default function App() {
  const [lang, setLang] = useState<keyof typeof content>("in");
  type BlobItem = {
    id: number;
    color: string;
    size: number;
    initialPos: { x: string; y: string };
  };
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const t = content[lang];

  useEffect(() => {
    const colors = ["bg-indigo-600", "bg-rose-600", "bg-cyan-600"];
    const newBlobs = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      color: colors[i % 3],
      size: Math.random() * 300 + 200,
      initialPos: {
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
      },
    }));
    setBlobs(newBlobs);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 100 }; // Damping lebih tinggi = lebih tenang
  const rotateX = useSpring(
    useTransform(y, [-300, 300], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-300, 300], [-15, 15]),
    springConfig,
  );

  type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
  interface Point {
    x: number;
    y: number;
  }

  function handleMouseMove(event: DivMouseEvent): void {
    const rect: DOMRect = event.currentTarget.getBoundingClientRect();
    const centerX: number = rect.left + rect.width / 2;
    const centerY: number = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative flex flex-row items-stretch"
    >
      {/* Latar Belakang Animasi */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {blobs.map((blob) => (
          <Blob
            key={blob.id}
            color={blob.color}
            size={blob.size}
            initialPos={blob.initialPos}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Switcher Bahasa */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute top-10 right-10 z-[100] flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/5"
      >
        <button
          onClick={() => setLang("in")}
          className={`text-[8px] font-black uppercase transition-all tracking-[0.2em] ${lang === "in" ? "text-white" : "text-white/20 hover:text-white/50"}`}
        >
          IN
        </button>
        <span className="text-[8px] text-white/10 font-light">|</span>
        <button
          onClick={() => setLang("en")}
          className={`text-[8px] font-black uppercase transition-all tracking-[0.2em] ${lang === "en" ? "text-white" : "text-white/20 hover:text-white/50"}`}
        >
          EN
        </button>
      </motion.div>

      {/* Bagian Kiri: 404 Visual */}
      <section className="flex-[0.7] flex items-center justify-center relative z-20 border-r border-white/5 bg-transparent">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full scale-150 pointer-events-none" />
          <h1 className="text-[5rem] md:text-[7rem] font-black leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.03)]">
            404
          </h1>
        </motion.div>
      </section>

      {/* Bagian Kanan: Konten Teks */}
      <section className="flex-[1.3] relative z-10 flex flex-col justify-start items-start p-12 md:p-32 justify-center bg-white/[0.03] backdrop-blur-[40px] border-l border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-8 h-[1px] bg-indigo-500/50" />
              <span className="text-[9px] tracking-[0.6em] font-bold text-indigo-400/80 uppercase">
                {t.label}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-8 uppercase whitespace-pre-line text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-cyan-400 animateTextGradient`}
              style={{ backgroundSize: "200% auto" }}
            >
              {t.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-neutral-400 text-[11px] md:text-[13px] font-medium leading-relaxed tracking-wide mb-14 max-w-sm border-l border-white/20 pl-8"
            >
              {t.desc}
            </motion.p>

            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/")}
                  className="relative group px-8 py-3 border border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:border-white/60 bg-white/5"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-600 via-rose-600 to-cyan-600 animateCardGradient`}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <span className="relative z-10 text-[11px] md:text-[13px] font-black tracking-[0.3em] uppercase">
                    {t.home}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/help")}
                  className="relative group px-8 py-3 border border-white/20 rounded-full overflow-hidden transition-all duration-500 hover:border-white/60 bg-white/5"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-600 via-rose-600 to-cyan-600 ${styles.animateCardGradient}`}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <span className="relative z-10 text-[11px] md:text-[13px] font-black tracking-[0.3em] uppercase">
                    {t.help}
                  </span>
                </motion.button>
              </motion.div>

              {/* Tautan Mini Game */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ opacity: 1, x: 10 }}
                onClick={() => (window.location.href = "/game")}
                className="flex items-center gap-4 group cursor-pointer w-fit"
              >
                <div className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-rose-500 group-hover:w-16 transition-all duration-500" />
                <span className="text-[10px] md:text-[12px] font-black tracking-[0.4em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 to-neutral-500 group-hover:from-white group-hover:to-indigo-300 transition-all duration-300">
                  {t.game}
                </span>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-auto relative z-10 pt-24"
        >
          <p className="text-neutral-600 text-[7px] tracking-[0.6em] uppercase font-bold">
            {t.studio}
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}
