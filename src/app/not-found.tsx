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
import styles from "./not-found.module.css";

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
  const toggleLanguage = (newLang: "id" | "en") => {
    setLang(newLang);
  };

  // Parallax Mouse Effect untuk angka 404
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };

  // Transform pergerakan mouse menjadi pergerakan angka (range -15px sampai 15px)
  const dx = useSpring(
    useTransform(mouseX, [0, 1920], [-15, 15]),
    springConfig,
  );
  const dy = useSpring(
    useTransform(mouseY, [0, 1080], [-15, 15]),
    springConfig,
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

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
        <div className="fixed top-8 right-8 z-[120] flex items-center gap-4">
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-10 backdrop-blur-md">
            {/* Slider Latar Belakang Putih */}
            <motion.div
              className="absolute bg-white rounded-full h-[80%] my-auto"
              initial={false}
              animate={{
                // Sesuaikan posisi x agar pas di tengah tombol
                x: lang === "id" ? 0 : 40,
              }}
              style={{ width: "40px" }}
              transition={{
                type: "spring",
                stiffness: 400, // Lebih tinggi agar gerakan lebih cepat/bertenaga
                damping: 15, // Lebih rendah agar ada efek "bounce" atau membal di akhir
                mass: 0.8, // Membuat slider terasa lebih ringan saat membal
              }}
            />

            {/* Tombol ID */}
            <button
              onClick={() => setLang("id")}
              className={`relative z-10 w-10 text-[9px] font-black transition-colors duration-300 ${
                lang === "id" ? "text-black" : "text-white/50"
              }`}
            >
              ID
            </button>

            {/* Tombol EN */}
            <button
              onClick={() => setLang("en")}
              className={`relative z-10 w-10 text-[9px] font-black transition-colors duration-300 ${
                lang === "en" ? "text-black" : "text-white/50"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* KONTEN UTAMA */}
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center h-full pt-20 md:pt-0">
          {/* BAGIAN KIRI: VISUAL 404 (Parallax Stroke Text) */}
          <div className="md:col-span-7 flex flex-col justify-center items-center md:items-start relative h-[40vh] md:h-auto">
            <motion.div
              onMouseMove={handleMouseMove}
              style={{ x: dx, y: dy }}
              className={styles.glitchContainer}
            >
              <h1 className={styles.glitchText}>404</h1>
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
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-serif italic text-lg md:text-xl text-zinc-400 leading-relaxed max-w-md mx-auto mb-4" // Tambahkan max-w-md dan kurangi mb
                >
                  {t.desc}
                </motion.p>

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
                    whileHover={{ opacity: 1, y: -2 }}
                    onClick={() => handleNavigation("/welcome")}
                    className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-zinc-500 hover:text-amber-500 transition-all mt-2"
                  >
                    <ArrowLeft size={12} />
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
