"use client";

import Link from "next/link";
import Lenis from "lenis";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Music,
  Play,
  Pause,
  ArrowDown,
  MoveRight,
  Radio,
  Disc,
  Mic2,
  X,
} from "lucide-react";

// Data Konten
const content: Record<string, any> = {
  id: [
    {
      id: "01",
      title: "SILENCE",
      headline: "Hening Yang \nMemekakkan.",
      body: "Kualitas tak pernah berteriak. Ia merambat pelan, menyusup di antara detak jantung yang ragu.",
      meta: "Kualitas musik • I",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
      align: "left",
    },
    {
      id: "02",
      title: "DISTORT",
      headline: "Jujur Dalam \nKekacauan.",
      body: "Di sela distorsi melodi di bar reruntuhan, kita menemukan satu-satunya kebenaran yang tidak dimanipulasi.",
      meta: "Kebenaran musik • II",
      theme: "text-red-600",
      bg: "bg-black",
      align: "right",
    },
    {
      id: "03",
      title: "REBEL",
      headline: "Tradisi Bukan \nPenjara.",
      body: "List tidak menulis untuk menenangkanmu. Dia menulis untuk membakar apa yang kamu kira kamu tahu.",
      meta: "Musik itu luas • III",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
      align: "left",
    },
    {
      id: "04",
      title: "ANALOG",
      headline: "Sentuhan \nYang Hilang.",
      body: "Di dunia digital yang sempurna, ketidaksempurnaan jarum di atas piringan hitam adalah nyawa.",
      meta: "Nyawa dari musik • IV",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
      align: "right",
    },
    {
      id: "05",
      title: "RAW",
      headline: "Jujur Tanpa \nKompromi.",
      body: "Kemewahan sejati tidak butuh polesan. Ia hadir dalam bentuk murni yang menentang definisi biasa.",
      meta: "Bentuk dari musik • V",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
      align: "left",
    },
    {
      id: "06",
      title: "ECHOES",
      headline: "Gema Yang \nMenolak Mati.",
      body: "Waktu berlalu, getaran tetap tinggal. Kita adalah perpanjangan dari setiap suara yang abadi.",
      meta: "Jiwa Musik • VI",
      theme: "text-red-600",
      bg: "bg-black",
      align: "right",
    },
    {
      id: "07",
      title: "FLUX",
      headline: "Abadi Dalam \nPerubahan.",
      body: "Satu-satunya yang tetap adalah gerak. Mengalirlah tanpa kehilangan arah dan jati diri.",
      meta: "Musik itu abadi • VII",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
      align: "left",
    },
    {
      id: "08",
      title: "ORIGIN",
      headline: "Kembali Ke \nTitik Mula.",
      body: "Perjalanan terjauh adalah ke dalam diri. Temukan suara asli Anda di balik lapisan ekspektasi.",
      meta: "Dalam suara musik • IX",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
      align: "right",
    },
  ],
  en: [
    {
      id: "01",
      title: "SILENCE",
      headline: "The \nDeafening Silence.",
      body: "Quality never screams. It crept slowly, slipping between the hesitant heartbeats.",
      meta: "Music quality • I",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
      align: "left",
    },
    {
      id: "02",
      title: "DISTORT",
      headline: "Honesty in \nChaos.",
      body: "In the midst of melodic distortion in the bar of ruins, we find the only truth that is not manipulated.",
      meta: "Music truth • II",
      theme: "text-red-600",
      bg: "bg-black",
      align: "right",
    },
    {
      id: "03",
      title: "REBEL",
      headline: "Tradition is not \nthe Prison.",
      body: "List does not write to calm you. He writes to burn what you think you know.",
      meta: "Music is wide • III",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
      align: "left",
    },
    {
      id: "04",
      title: "ANALOG",
      headline: "The \nLost Touch.",
      body: "In a perfect digital world, the imperfection of the needle on a vinyl record is life.",
      meta: "Life of music • IV",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
      align: "right",
    },
    {
      id: "05",
      title: "RAW",
      headline: "Honest Without \nCompromise.",
      body: "True luxury does not need polishing. It arrives in the form of pureness that defies ordinary definitions.",
      meta: "Form of music • V",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
      align: "left",
    },
    {
      id: "06",
      title: "ECHOES",
      headline: "Echoes That \nRefuse to Die.",
      body: "Time passes, vibrations remain. We are the extension of every immortal sound.",
      meta: "Soul of Music • VI",
      theme: "text-red-600",
      bg: "bg-black",
      align: "right",
    },
    {
      id: "07",
      title: "FLUX",
      headline: "Eternal In \nChange.",
      body: "The only constant is motion. Flow without losing direction and identity.",
      meta: "Music is eternal • VII",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
      align: "left",
    },
    {
      id: "08",
      title: "ORIGIN",
      headline: "Return To \nStarting Point.",
      body: "The furthest journey is within yourself. Find your authentic voice beneath the layers of expectations.",
      meta: "In the sound of music • IX",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
      align: "right",
    },
  ],
};
const Grain = () => (
  <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Vignette = () => (
  <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
);

const Section = ({ data, index }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isLeft = index % 2 === 0;
  const xInput = isLeft ? ["-50%", "0%", "50%"] : ["50%", "0%", "-50%"];
  const x = useTransform(scrollYProgress, [0, 0.5, 1], xInput);

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 1, 1, 1, 0],
  );

  const blurVal = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["10px", "0px", "10px"],
  );
  const filter = useTransform(blurVal, (v) => `blur(${v})`);

  // --- HANYA GUNAKAN SATU DEKLARASI SCALE DI BAWAH INI ---
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  // ------------------------------------------------------

  const bgXInput = isLeft ? ["20%", "-20%"] : ["-20%", "20%"];
  const bgX = useTransform(scrollYProgress, [0, 1], bgXInput);

  return (
    <section
      ref={ref}
      className={`relative h-[110vh] md:h-[150vh] flex items-center justify-center overflow-hidden ${data.bg}`}
    >
      <motion.div
        style={{ x: bgX, opacity: 0.15 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <h1 className="text-[30vw] md:text-[35vw] font-black uppercase leading-none tracking-tighter text-transparent stroke-text whitespace-nowrap will-change-transform">
          {data.title}
        </h1>
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ x, opacity, filter, scale }}
          className={`relative z-10 container mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center will-change-transform ${isLeft ? "text-left" : "text-right md:flex-row-reverse"}`}
        >
          <div className={`md:col-span-8 ${!isLeft ? "md:col-start-5" : ""}`}>
            <div
              className={`flex items-center gap-4 mb-6 ${!isLeft ? "justify-end" : ""} overflow-hidden`}
            >
              <span className={`text-6xl font-serif italic ${data.theme}`}>
                {data.id}
              </span>
              <div className="h-[1px] w-20 bg-white/30" />
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                {data.meta}
              </span>
            </div>
            <h2 className="text-4xl md:text-9xl font-black uppercase leading-[0.9] tracking-tighter whitespace-pre-line mb-6 mix-blend-difference">
              {data.headline}
            </h2>
            <div
              className={`flex flex-col ${!isLeft ? "items-end" : "items-start"}`}
            >
              <p className="text-lg md:text-xl font-serif leading-relaxed text-zinc-300 italic max-w-lg">
                "{data.body}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<keyof typeof content>("id");

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const cursorX = useSpring(0, { stiffness: 500, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 50 });

  const t = content[lang];
  useEffect(() => {
    const moveCursor = (e: any) => {
      cursorX.set(e.clientX - 24);
      cursorY.set(e.clientY - 24);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("user-lang");
    // Validasi apakah nilainya benar-benar "id" atau "en"
    if (savedLang === "id" || savedLang === "en") {
      setLang(savedLang as keyof typeof content);
    }
  }, []);

  const changeLanguage = (newLang: "id" | "en") => {
    setLang(newLang);
    localStorage.setItem("user-lang", newLang); // Ini kuncinya agar sinkron ke 404
  };

  return (
    <div className="bg-black text-zinc-100 font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      <Grain />
      <Vignette />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      {/* Language Toggle */}
      <div className="fixed top-8 right-8 z-[100] flex gap-3 text-[10px] font-black tracking-[0.2em] mix-blend-difference uppercase">
        <button
          onClick={() => changeLanguage("id")}
          className={`transition-colors duration-300 ${lang === "id" ? "text-white" : "text-zinc-500"}`}
        >
          IN
        </button>
        <span className="text-zinc-500">/</span>
        <button
          onClick={() => changeLanguage("en")}
          className={`transition-colors duration-300 ${lang === "en" ? "text-white" : "text-zinc-500"}`}
        >
          EN
        </button>
      </div>

      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-white/50 backdrop-blur-[2px] pointer-events-none z-[100] hidden md:flex items-center justify-center mix-blend-difference pointer-events-none"
        style={{ x: cursorX, y: cursorY }}
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </motion.div>

      <section className="relative h-[120vh] flex flex-col justify-center items-center p-6 bg-zinc-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white opacity-[0.03] rounded-full blur-[150px] animate-pulse" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative z-10 text-center mix-blend-difference"
        >
          <h1 className="text-[18vw] md:text-[15vw] font-black uppercase leading-[0.8] tracking-tighter italic text-white mix-blend-difference">
            Budapes <br />
            <span className="stroke-text text-transparent relative">
              Echoes
              <motion.span
                className="absolute -top-4 -right-4 text-2xl md:text-4xl text-white font-serif not-italic tracking-normal"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              >
                *
              </motion.span>
            </span>
          </h1>
        </motion.div>
      </section>

      <div className="relative z-10">
        {content[lang].map((item: any, idx: number) => (
          <Section key={`${lang}-${idx}`} data={item} index={idx} />
        ))}
      </div>

      {/* Bagian Akhir yang Diperbarui */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-zinc-100 text-black p-6 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none">
          <h1 className="text-[45vw] md:text-[35vw] font-black leading-none -translate-x-1/4 translate-y-1/4 text-zinc-400">
            FIN
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h2 className="text-5xl md:text-9xl font-black uppercase leading-[0.9] tracking-tight whitespace-pre-line mb-6 mix-blend-difference">
              {lang === "id" ? "Inilah Budapest," : "This is Budapest,"}
            </h2>

            <p className="text-base md:text-xl font-serif leading-relaxed text-zinc-600 italic max-w-lg mb-12">
              {lang === "id"
                ? '"mahakarya nyata masterpiece dari tangan sang ahli."'
                : '"a true masterpiece from the hands of an expert."'}
            </p>

            {/* Tombol yang sudah diubah menjadi Link ke /home */}
            <Link href="/home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                  <MoveRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={24}
                  />
                </div>
                <span className="uppercase tracking-[0.4em] text-[10px] font-black text-black">
                  {lang === "id" ? "Menuju ke Beranda" : "Go to Home"}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .stroke-text {-webkit-text-stroke: 1px rgba(255,255,255,0.1); }
        .font-serif { font-family: 'Playfair Display', serif; }
        .perspective-container { perspective: 1500px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}
