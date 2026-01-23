"use client";

import Link from "next/link";
import Lenis from "lenis";
import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
      body: "Quality never screams. It creeps slowly, slipping between the hesitant heartbeats.",
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
      headline: "Honest Without \nCompromise.",
      body: "True luxury does not need polishing. It arrives in the form of pureness that defies ordinary definitions.",
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

const Section = ({ data, index }: { data: any; index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isLeft = index % 2 === 0;
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isLeft ? ["-10%", "0%", "10%"] : ["10%", "0%", "-10%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.6, 0.9],
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.9]);
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.05, 0.2, 0.05],
  );

  return (
    <section
      ref={ref}
      className={`relative h-[120vh] md:h-[180vh] snap-section flex items-center justify-center overflow-hidden ${data.bg}`}
    >
      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <h1 className="text-[35vw] font-black uppercase text-transparent stroke-text whitespace-nowrap select-none">
          {data.title}
        </h1>
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ x, opacity, scale }}
          className={`container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${isLeft ? "text-left" : "text-right md:flex-row-reverse"}`}
        >
          <div className={`md:col-span-8 ${!isLeft ? "md:col-start-5" : ""}`}>
            <div
              className={`flex items-center gap-4 mb-4 ${!isLeft ? "justify-end" : ""}`}
            >
              <span
                className={`text-5xl md:text-7xl font-serif italic ${data.theme}`}
              >
                {data.id}
              </span>
              <div className="h-[1px] w-12 md:w-24 bg-white/20" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter mb-8 whitespace-pre-line">
              {data.headline}
            </h2>
            <p className="text-lg md:text-2xl font-serif italic text-zinc-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
              "{data.body}"
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<keyof typeof content>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="bg-black text-zinc-100 font-sans selection:bg-amber-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap");
        :root { scroll-behavior: auto !important; }
        .stroke-text { -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.15); }
        .font-serif { font-family: "Playfair Display", serif; }
        @media (max-width: 768px) {
          html { scroll-snap-type: y mandatory; }
          .snap-section { scroll-snap-align: start; scroll-snap-stop: always; }
          .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1); }
        }
        @media (min-width: 769px) {
          html { scroll-snap-type: none !important; }
        }
        body { overflow-x: hidden; background: black; }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* Visual Overlays */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[100] mix-blend-difference"
        style={{ scaleX }}
      />

      {/* Language Switch */}
      <div className="fixed top-8 right-8 z-[100] flex gap-2">
        {["id", "en"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l as any)}
            className={`w-10 h-10 rounded-full text-[10px] font-bold uppercase transition-all flex items-center justify-center border ${lang === l ? "bg-white text-black border-white" : "text-zinc-500 border-white/10 hover:border-white/40"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Hero */}
      <section className="relative h-screen snap-section flex flex-col justify-center items-center bg-zinc-950 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <h1 className="text-[18vw] md:text-[15vw] font-black uppercase leading-[0.8] tracking-tighter">
            Budapest <br />
            <span className="stroke-text text-transparent italic">Echoes</span>
          </h1>
        </motion.div>
      </section>

      {/* Content Sections */}
      <div className="relative">
        {content[lang].map((item: any, idx: number) => (
          <Section key={`${lang}-${idx}`} data={item} index={idx} />
        ))}
      </div>

      {/* FOOTER (VERSI LAMA YANG DIKEMBALIKAN) */}
      <section className="min-h-screen flex flex-col justify-center items-center bg-zinc-100 text-black p-6 md:p-12 text-center relative overflow-hidden snap-section">
        {/* Latar belakang FIN besar */}
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
    </div>
  );
}
