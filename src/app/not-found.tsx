"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { MoveRight, ArrowLeft } from "lucide-react"; // Pastikan install lucide-react
import SharedLoading from "@/lib/SharedLoading"; // Sesuaikan path jika perlu

const content = {
  id: {
    label: "LIHAT DIRIMU",
    title: "DI LUAR\nBATAS NORMAL",
    desc: "Terkadang tersesat adalah bagian dari perjalanan. Namun, di sini hanya ada ruang hampa dan angka yang bisu. Mari kembali ke jalan ninjamu.",
    home: "beranda",
    help: "Bantuan",
    welcome: "Kembali ke Selamat Datang",
    studio: "BUDAPES STUDIO • LOSS OF CONNECTION",
  },
  en: {
    label: "LOOK AT YOURSELF",
    title: "OUTSIDE\nNORMAL LIMITS",
    desc: "Getting lost is part of the journey, they said. Well, they didn't mention this silent void. Go on, get back to your ninja path before it gets weirder.",
    home: "Home",
    help: "Help",
    welcome: "Back to Welcome",
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
        willChange: "transform",
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

export default function NotFound() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [targetUrl, setTargetUrl] = useState("");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [mounted, setMounted] = useState(false);

  // Parallax Mouse Effect untuk angka 404
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 100 };
  const rotateX = useSpring(
    useTransform(y, [-300, 300], [5, -5]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-300, 300], [-5, 5]),
    springConfig,
  );

  const t = content[lang];

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("user-lang") as "id" | "en";
    if (savedLang && (savedLang === "id" || savedLang === "en")) {
      setLang(savedLang);
    }
  }, []);

  const handleNavigation = (url: string) => {
    setTargetUrl(url);
    setIsExiting(true);
  };

  const handleLangChange = (newLang: "id" | "en") => {
    setLang(newLang);
    localStorage.setItem("user-lang", newLang);
  };

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  if (!mounted) return <div className="bg-zinc-950 min-h-screen" />;

  return (
    <>
      {/* Styles Injection (Disamakan dengan page.tsx) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap");
        
        .font-serif { font-family: "Playfair Display", serif; }
        
        /* Style untuk Text Stroke (Transparan dengan garis tepi) */
        .stroke-text { 
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15); 
          color: transparent; 
        }
        
        /* Pattern Bintang */
        .stars-bg {
            background-image: 
            radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 90px 40px, #fff, rgba(0,0,0,0));
            background-size: 200px 200px;
            opacity: 0.2;
        }
      `,
        }}
      />

      {/* SVG Filter Grain (Disalin dari page.tsx) */}
      <svg className="fixed w-0 h-0 invisible">
        <filter id="grainy-noise-404">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      {/* Loading Screen / Curtain */}
      <AnimatePresence mode="wait">
        {isEntering && (
          <SharedLoading
            reverse={true}
            onComplete={() => setIsEntering(false)}
          />
        )}
        {isExiting && (
          <SharedLoading onComplete={() => router.push(targetUrl || "/")} />
        )}
      </AnimatePresence>

      {/* Container Utama */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onMouseMove={handleMouseMove}
        className={`relative min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden flex flex-col items-center justify-center selection:bg-amber-500 selection:text-black ${
          isEntering || isExiting ? "pointer-events-none" : ""
        }`}
      >
        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Grain Effect */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ filter: "url(#grainy-noise-404)" }}
          />
          {/* Stars */}
          <div className="absolute inset-0 stars-bg" />
          {/* Glow Atmosfer Bawah */}
          <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-zinc-900/50 to-transparent opacity-60" />
        </div>

        {/* LANGUAGE SWITCHER (Pojok Kanan Atas - Style Minimalis) */}
        <div className="absolute top-8 right-8 z-50 flex gap-2 mix-blend-difference">
          {["id", "en"].map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l as "id" | "en")}
              className={`px-3 py-1 text-[10px] font-bold uppercase border transition-all duration-300 rounded-full ${
                lang === l
                  ? "bg-zinc-100 text-black border-zinc-100"
                  : "text-zinc-500 border-zinc-800 hover:border-zinc-600 backdrop-blur-md"
              }`}
            >
              {l === "id" ? "ID" : "EN"}
            </button>
          ))}
        </div>

        {/* KONTEN UTAMA */}
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center h-full pt-20 md:pt-0">
          {/* BAGIAN KIRI: VISUAL 404 (Parallax Stroke Text) */}
          <div className="md:col-span-7 flex flex-col justify-center items-center md:items-start relative h-[40vh] md:h-auto">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative"
            >
              {/* Layer Utama (Stroke) */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-[8rem] md:text-[16rem] font-black leading-none tracking-tighter stroke-text select-none opacity-50"
              >
                404
              </motion.h1>

              {/* Layer Glow/Blur di belakang */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white mix-blend-overlay blur-sm pointer-events-none"
              >
                <h1 className="text-[8rem] md:text-[16rem] font-black leading-none tracking-tighter opacity-10">
                  404
                </h1>
              </motion.div>
            </motion.div>
          </div>

          {/* BAGIAN KANAN: TEKS & NAVIGASI */}
          <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left pb-20 md:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Label Kecil */}
                <div className="mb-6 flex items-center gap-4 justify-center md:justify-start">
                  <div className="h-[1px] w-8 bg-amber-500" />
                  <span className="text-[10px] tracking-[0.4em] font-bold text-amber-500 uppercase">
                    {t.label}
                  </span>
                </div>

                {/* Judul Besar */}
                <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-8 text-zinc-100">
                  {t.title}
                </h2>

                {/* Deskripsi (Serif Italic) */}
                <p className="font-serif italic text-lg md:text-xl text-zinc-400 leading-relaxed mb-12 max-w-md mx-auto md:mx-0 border-l border-zinc-800 pl-0 md:pl-6">
                  "{t.desc}"
                </p>

                {/* TOMBOL NAVIGASI (Gaya Footer Welcome Page) */}
                <div className="flex flex-col gap-6 items-center md:items-start">
                  {/* Tombol Utama: Lingkaran Panah */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="group flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                    onClick={() => handleNavigation("/home")}
                  >
                    <motion.div
                      whileTap={{
                        scale: 0.9,
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      className="w-16 h-16 rounded-full border border-zinc-600 flex items-center justify-center bg-transparent text-white group-hover:bg-zinc-100 group-hover:text-black transition-all duration-300"
                    >
                      <MoveRight
                        size={24}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </motion.div>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-300 group-hover:text-white transition-colors">
                      {t.home}
                    </span>
                  </motion.div>

                  {/* Tombol Sekunder: Kembali ke Welcome */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1, x: -5 }}
                    onClick={() => handleNavigation("/.")}
                    className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-amber-500 transition-colors mt-4"
                  >
                    <ArrowLeft size={14} />
                    {t.welcome}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* FOOTER TEXT (Studio Label) */}
        <div className="absolute bottom-6 md:bottom-8 left-0 w-full text-center pointer-events-none opacity-50">
          <p className="text-[8px] text-zinc-600 font-bold tracking-[0.5em] uppercase">
            {t.studio}
          </p>
        </div>
      </motion.div>
    </>
  );
}
