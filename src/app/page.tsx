"use client";

import Link from "next/link";
import Lenis from "lenis";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  AnimatePresence,
} from "framer-motion";
import { MoveRight } from "lucide-react";

// Data Konten
const content: Record<string, any> = {
  id: [
    {
      id: "01",
      title: "SILENCE",
      headline: "Hening Yang \nMemekakkan.",
      body: "Kualitas tak pernah berteriak. Ia merambat pelan, menyusup di antara detak jantung yang ragu.",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
    },
    {
      id: "02",
      title: "DISTORT",
      headline: "Jujur Dalam \nKekacauan.",
      body: "Di sela distorsi melodi di bar reruntuhan, kita menemukan satu-satunya kebenaran yang tidak dimanipulasi.",
      theme: "text-red-600",
      bg: "bg-black",
    },
    {
      id: "03",
      title: "REBEL",
      headline: "Tradisi Bukan \nPenjara.",
      body: "List tidak menulis untuk menenangkanmu. Dia menulis untuk membakar apa yang kamu kira kamu tahu.",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
    },
    {
      id: "04",
      title: "ANALOG",
      headline: "Sentuhan \nYang Hilang.",
      body: "Di dunia digital yang sempurna, ketidaksempurnaan jarum di atas piringan hitam adalah nyawa.",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
    },
    {
      id: "05",
      title: "RAW",
      headline: "Jujur Tanpa \nKompromi.",
      body: "Kemewahan sejati tidak butuh polesan. Ia hadir dalam bentuk murni yang menentang definisi biasa.",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
    },
    {
      id: "06",
      title: "ECHOES",
      headline: "Gema Yang \nMenolak Mati.",
      body: "Waktu berlalu, getaran tetap tinggal. Kita adalah perpanjangan dari setiap suara yang abadi.",
      theme: "text-red-600",
      bg: "bg-black",
    },
    {
      id: "07",
      title: "FLUX",
      headline: "Abadi Dalam \nPerubahan.",
      body: "Satu-satunya yang tetap adalah gerak. Mengalirlah tanpa kehilangan arah dan jati diri.",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
    },
    {
      id: "08",
      title: "ORIGIN",
      headline: "Kembali Ke \nTitik Mula.",
      body: "Perjalanan terjauh adalah ke dalam diri. Temukan suara asli Anda di balik lapisan ekspektasi.",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
    },
  ],
  en: [
    {
      id: "01",
      title: "SILENCE",
      headline: "The \nDeafening Silence.",
      body: "Quality never screams. It crept slowly, slipping between the hesitant heartbeats.",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
    },
    {
      id: "02",
      title: "DISTORT",
      headline: "Honesty in \nChaos.",
      body: "In the midst of melodic distortion in the bar of ruins, we find the only truth that is not manipulated.",
      theme: "text-red-600",
      bg: "bg-black",
    },
    {
      id: "03",
      title: "REBEL",
      headline: "Tradition is not \nthe Prison.",
      body: "List does not write to calm you. He writes to burn what you think you know.",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
    },
    {
      id: "04",
      title: "ANALOG",
      headline: "The \nLost Touch.",
      body: "In a perfect digital world, the imperfection of the needle on a vinyl record is life.",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
    },
    {
      id: "05",
      title: "RAW",
      headline: "Jujur Tanpa \nKompromi.",
      body: "Kemewahan sejati tidak butuh polesan. Ia hadir dalam bentuk murni yang menentang definisi biasa.",
      theme: "text-amber-500",
      bg: "bg-zinc-950",
    },
    {
      id: "06",
      title: "ECHOES",
      headline: "Echoes That \nRefuse to Die.",
      body: "Time passes, vibrations remain. We are the extension of every immortal sound.",
      theme: "text-red-600",
      bg: "bg-black",
    },
    {
      id: "07",
      title: "FLUX",
      headline: "Eternal In \nChange.",
      body: "The only constant is motion. Flow without losing direction and identity.",
      theme: "text-emerald-500",
      bg: "bg-zinc-900",
    },
    {
      id: "08",
      title: "ORIGIN",
      headline: "Return To \nStarting Point.",
      body: "The furthest journey is within yourself. Find your authentic voice beneath the layers of expectations.",
      theme: "text-orange-500",
      bg: "bg-neutral-950",
    },
  ],
};

const Section = ({
  data,
  index,
  lang,
}: {
  data: any;
  index: number;
  lang: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const skew = useSpring(useTransform(scrollVelocity, [-1, 1], [-8, 8]), {
    stiffness: 100,
    damping: 30,
  });
  const blurValue = useSpring(
    useTransform(scrollVelocity, [-1, 0, 1], [4, 0, 4]),
    { stiffness: 100, damping: 30 },
  );

  const isLeft = index % 2 === 0;
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isLeft ? ["-20%", "0%", "20%"] : ["20%", "0%", "-20%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.9]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <section
      ref={ref}
      className={`relative h-[120vh] md:h-[180vh] snap-section flex items-center justify-center overflow-hidden ${data.bg}`}
    >
      {/* Background Title (Tidak perlu ikut animasi slide bahasa agar tidak pusing) */}
      <motion.div
        style={{ skewY: skew }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]"
      >
        <h1 className="text-[50vw] md:text-[40vw] font-black uppercase text-transparent stroke-text whitespace-nowrap select-none">
          {data.title}
        </h1>
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <motion.div
          style={{ x, opacity, scale, filter, skewY: skew }}
          className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
        >
          <div
            className={`md:col-span-8 ${!isLeft ? "md:col-start-5 text-right" : "text-left"}`}
          >
            {/* INI KODE BARUNYA */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lang} // Memicu animasi saat bahasa berubah
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLeft ? 20 : -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div
                  className={`flex items-center gap-3 mb-4 ${!isLeft ? "justify-end" : ""}`}
                >
                  <span
                    className={`text-4xl md:text-8xl font-serif italic ${data.theme}`}
                  >
                    {data.id}
                  </span>
                  <div className="h-[1px] w-10 md:w-24 bg-white/30" />
                </div>
                <h2 className="text-4xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-6 md:mb-10 whitespace-pre-line">
                  {data.headline}
                </h2>
                <p className="text-lg md:text-3xl font-serif italic text-zinc-400 leading-snug">
                  "{data.body}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<keyof typeof content>("id");

  type BlobItem = {
    id: number;
    color: string;
    size: number;
    initialPos: { x: string; y: string };
  };
  const [mounted, setMounted] = useState(false);
  const [noiseIntensity, setNoiseIntensity] = useState(0.05); // State untuk mengontrol intensitas noise

  useEffect(() => {
    const savedLang = localStorage.getItem("user-lang") as
      | keyof typeof content
      | null;
    if (savedLang && (savedLang === "id" || savedLang === "en")) {
      setLang(savedLang);
    }

    setMounted(true);

    // AKTIFKAN LENIS HANYA DI DESKTOP
    let lenis: Lenis | null = null;
    if (window.innerWidth > 768) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Animasi denyutan grain
    const interval = setInterval(() => {
      setNoiseIntensity((prev) => {
        // Berdenyut antara 0.04 dan 0.08
        return prev < 0.05 ? 0.07 : 0.05;
      });
    }, 1000); // Setiap 1 detik

    return () => {
      lenis?.destroy();
      clearInterval(interval);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!mounted) return <div className="bg-black min-h-screen" />;

  const handleLangChange = (newLang: keyof typeof content) => {
    setLang(newLang);
    localStorage.setItem("user-lang", newLang);
  };

  return (
    <div className="bg-black text-zinc-100 font-sans selection:bg-amber-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap");
        :root { scroll-behavior: auto !important; }
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1); }
        .font-serif { font-family: "Playfair Display", serif; }

        /* MOBILE SNAP CONFIG */
        @media (max-width: 768px) {
          html { 
            scroll-snap-type: y mandatory; 
            overflow-y: scroll;
          }
          .snap-section { 
            scroll-snap-align: start; 
            scroll-snap-stop: always; 
          }
        }
        
        @media (min-width: 769px) {
          html { scroll-snap-type: none !important; }
          .stroke-text { -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.15); }
        }

        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* SVG Filter untuk Grain Effect */}
      <svg className="fixed w-0 h-0 invisible">
        <filter id="grainy-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6" // Ukuran grain
            numOctaves="3"
            seed="0"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" />{" "}
          {/* Desaturasi untuk hitam-putih */}
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />{" "}
          {/* Gabungkan dengan konten */}
        </filter>
      </svg>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-amber-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Language Switch */}
      <div className="fixed top-6 right-6 z-[100] flex gap-2">
        {["id", "en"].map((l) => (
          <button
            key={l}
            onClick={() => handleLangChange(l as keyof typeof content)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${lang === l ? "bg-white text-black border-white" : "text-zinc-500 border-white/10 backdrop-blur-md"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Hero Section dengan Grain Effect */}
      <section className="relative h-screen snap-section flex flex-col justify-center items-center bg-zinc-950 overflow-hidden">
        {/* Latar Belakang Grain */}
        <motion.div
          className="absolute inset-0 z-0 opacity-100"
          style={{ filter: "url(#grainy-noise)", opacity: noiseIntensity }} // Terapkan filter dan opacity berdenyut
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-4 relative z-10"
        >
          {" "}
          {/* Pastikan teks di atas grain */}
          <h1 className="text-[18vw] md:text-[15vw] font-black uppercase leading-[0.8] tracking-tighter">
            Budapest <br />
            <span className="stroke-text text-transparent italic">Echoes</span>
          </h1>
        </motion.div>
      </section>

      {/* Sections */}
      <div className="relative">
        {(content[lang] ?? []).map((item: any, idx: number) => (
          <Section
            key={idx} // Gunakan idx agar tidak remount seluruh section, hanya kontennya
            data={item}
            index={idx}
            lang={lang} // Tambahkan ini
          />
        ))}
      </div>

      {/* Footer FIN (Versi Lama yang diperkecil untuk Mobile) */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-zinc-100 text-black p-6 text-center relative overflow-hidden snap-section">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none">
          <h1 className="text-[60vw] md:text-[35vw] font-black leading-none -translate-x-1/4 translate-y-1/4 text-zinc-400">
            FIN
          </h1>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-9xl font-black uppercase leading-[0.9] tracking-tight mb-6 mix-blend-difference">
              {lang === "id" ? "Inilah Budapest," : "This is Budapest,"}
            </h2>
            <p className="text-lg md:text-3xl font-serif leading-relaxed text-zinc-600 italic max-w-xl mb-12 px-4">
              {lang === "id"
                ? '"mahakarya nyata dari tangan sang ahli."'
                : '"a true masterpiece from the hands of an expert."'}
            </p>
            <Link href="/home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <MoveRight
                    size={28}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
                <span className="uppercase tracking-[0.4em] text-[10px] font-black">
                  {lang === "id" ? "Ke Beranda" : "Go Home"}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
