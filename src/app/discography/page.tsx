"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import SharedLoading from "@/lib/SharedLoading";
import { ArrowLeft, Play } from "lucide-react";

// --- 1. CONFIG DATA ---
const discoContent: Record<string, any> = {
  in: [
    {
      id: "01",
      title: "WANITA SEJATIKU",
      year: "10-2024",
      cover: "/wanita-sejatiku.jpg",
      bg: "bg-zinc-950",
      accent: "text-amber-500",
      accentColor: "#f59e0b", // Amber-500
    },
    {
      id: "02",
      title: "SANDYAKALA",
      year: "12-2024",
      cover: "/sandyakala.jpg",
      bg: "bg-black",
      accent: "text-red-600",
      accentColor: "#dc2626", // Red-600
    },
    {
      id: "03",
      title: "TAK INGIN KU JAUH",
      year: "07-2025",
      cover: "/tak-ingin-ku-jauh.jpg",
      bg: "bg-zinc-950",
      accent: "text-amber-500",
      accentColor: "#f59e0b", // Amber-500
    },
    {
      id: "04",
      title: "PENGEMBARA DIMENSI",
      year: "12-2025",
      cover: "/pengembara-dimensi.jpg",
      bg: "bg-black",
      accent: "text-red-600",
      accentColor: "#dc2626", // Red-600
    },
  ],
  en: [
    {
      id: "01",
      title: "WANITA SEJATIKU",
      year: "10-2024",
      cover: "/wanita-sejatiku.jpg",
      bg: "bg-zinc-950",
      accent: "text-amber-500",
      accentColor: "#f59e0b", // Amber-500
    },
    {
      id: "02",
      title: "SANDYAKALA",
      year: "12-2024",
      cover: "/sandyakala.jpg",
      bg: "bg-black",
      accent: "text-red-600",
      accentColor: "#dc2626", // Red-600
    },
    {
      id: "03",
      title: "TAK INGIN KU JAUH",
      year: "07-2025",
      cover: "/tak-ingin-ku-jauh.jpg",
      bg: "bg-zinc-950",
      accent: "text-amber-500",
      accentColor: "#f59e0b", // Amber-500
    },
    {
      id: "04",
      title: "PENGEMBARA DIMENSI",
      year: "12-2025",
      cover: "/pengembara-dimensi.jpg",
      bg: "bg-black",
      accent: "text-red-600",
      accentColor: "#dc2626", // Red-600
    },
  ],
};

const animText: Record<string, any> = {
  in: {
    heroLeft: "PILIHAN",
    heroRight: "MUTLAK",
    left: "SEMUA",
    right: "LAGU",
    listen: "DENGARKAN", // Tambahkan ini
    viewBoxLeft: "0 0 250 70",
    viewBoxRight: "0 0 190 70",
    origin: "65% 50%",
    height: "h-[16vw]",
  },
  en: {
    heroLeft: "ABSOLUTE",
    heroRight: "CHOICE",
    left: "ALL",
    right: "SONG",
    listen: "LISTEN", // Tambahkan ini
    viewBoxLeft: "0 0 130 70",
    viewBoxRight: "0 0 200 70",
    origin: "62% 50%",
    height: "h-[22vw]",
  },
};

// --- 2. SUB-COMPONENTS ---
const Navbar = ({ lang, onToggle, onBack, isMobile }: any) => (
  <nav className="fixed top-0 left-0 w-full p-8 z-[100] flex justify-between items-start pointer-events-none">
    <div className="pointer-events-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition-all"
      >
        <ArrowLeft size={14} /> {lang === "in" ? "Kembali" : "Back"}
      </button>
    </div>

    {/* TOGGLE BAHASA DENGAN ANIMASI PILL */}
    <div className="pointer-events-auto">
      <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-9 sm:h-10 backdrop-blur-md">
        {/* Sliding Pill (Latar Putih) */}
        <motion.div
          className="absolute bg-white rounded-full h-[80%] my-auto"
          animate={{
            // Menambahkan sedikit offset agar pill tidak terlalu mepet ke pinggir
            x: lang === "in" ? 2 : isMobile ? 34 : 42,
            width: isMobile ? "32px" : "40px",
          }}
          transition={{
            type: "spring",
            stiffness: 500, // Semakin tinggi, semakin cepat gerakannya
            damping: 15, // Semakin rendah, semakin banyak pantulannya (bouncing)
            mass: 0.8, // Memberikan kesan beban pada objek
          }}
          style={{ willChange: "transform, width" }}
        />

        {/* Tombol ID */}
        <button
          onClick={() => onToggle("in")}
          className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold transition-colors duration-300 ${
            lang === "in" ? "text-black" : "text-neutral-500"
          }`}
        >
          ID
        </button>

        {/* Tombol EN */}
        <button
          onClick={() => onToggle("en")}
          className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold transition-colors duration-300 ${
            lang === "en" ? "text-black" : "text-neutral-500"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  </nav>
);

function DiscographyContent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();
  // 1. Inisialisasi State Bahasa & Mobile
  const [lang, setLang] = useState<"in" | "en">("in");
  const [isMobile, setIsMobile] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");

  // 2. Logic yang Anda inginkan: Cek Mobile & Load dari LocalStorage
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const savedLang = localStorage.getItem("user-lang");
    // Validasi agar hanya 'in' atau 'en' yang bisa masuk ke state
    if (savedLang === "in" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  // 3. Logic Change Language dengan throttle requestAnimationFrame
  const changeLanguage = (newLang: "in" | "en") => {
    requestAnimationFrame(() => {
      setLang(newLang);
      localStorage.setItem("user-lang", newLang);
    });
  };

  // REFS UNTUK ANIMASI
  const parallaxElementsRef = useRef<NodeListOf<Element> | null>(null);
  const allSongRefs = {
    section: useRef<HTMLDivElement>(null),
    container: useRef<HTMLDivElement>(null),
    left: useRef<HTMLDivElement>(null),
    right: useRef<HTMLDivElement>(null),
    overlay: useRef<HTMLDivElement>(null),
  };

  const updateParallaxElements = () => {
    parallaxElementsRef.current = document.querySelectorAll(
      "[data-parallax-speed]",
    );
  };
  useEffect(() => {
    if (allSongRefs.container.current) {
      // Kunci titik pusat zoom sesuai bahasa agar tidak melompat saat mulai zoom
      allSongRefs.container.current.style.transformOrigin =
        animText[lang].origin;
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const style = document.createElement("style");
    style.innerHTML = `::-webkit-scrollbar { display: none; } html, body { -ms-overflow-style: none; scrollbar-width: none; }`;
    document.head.appendChild(style);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      const windowH = window.innerHeight;

      // PARALLAX MANAGER
      if (parallaxElementsRef.current) {
        parallaxElementsRef.current.forEach((el: any) => {
          if (!el || !document.body.contains(el)) return;
          const speed = parseFloat(
            el.getAttribute("data-parallax-speed") || "0",
          );
          const rect = el.getBoundingClientRect();
          if (rect.top < windowH + 100 && rect.bottom > -100) {
            const shift = (windowH / 2 - (rect.top + rect.height / 2)) * speed;
            el.style.transform =
              el.getAttribute("data-parallax-direction") === "x"
                ? `translate3d(${shift}px, 0, 0)`
                : `translate3d(0, ${shift}px, 0)`;
          }
        });
      }

      // ALL SONG MANAGER (Integrated Loop)
      const { section, container, left, right, overlay } = allSongRefs;

      if (
        section.current &&
        container.current &&
        left.current &&
        right.current &&
        overlay.current
      ) {
        const el = section.current; // Berikan variabel lokal untuk mempermudah TS
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowH && rect.bottom >= 0) {
          const progress = Math.min(
            Math.max(-rect.top / (rect.height - windowH), 0),
            1,
          );
          let xL = 0,
            xR = 0,
            op = 0,
            sc = 1,
            amber = 0;

          if (progress <= 0.3) {
            // Dipercepat dari 0.4 ke 0.3
            const ease = 1 - Math.pow(1 - progress / 0.3, 3);
            xL = -20 + 20 * ease;
            xR = 20 - 20 * ease;
            op = ease;
          } else {
            xL = 0;
            xR = 0;
            op = 1;
          }

          if (progress > 0.4) {
            // Dipercepat dari 0.6 ke 0.4
            // Jarak zoom sekarang lebih panjang (dari 0.4 ke 1.0) sehingga lebih smooth
            const zProg = Math.min((progress - 0.4) / 0.6, 0.96);
            sc = 1 + Math.pow(zProg, 4) * 150;
            amber = zProg;

            container.current.style.transformOrigin = animText[lang].origin;
            overlay.current.style.opacity =
              progress > 0.82
                ? Math.min((progress - 0.82) / 0.15, 1).toString()
                : "0";
          }

          left.current.style.transform = `translate3d(${xL}vw, 0, 0)`;
          right.current.style.transform = `translate3d(${xR}vw, 0, 0)`;
          container.current.style.transform = `scale(${sc}) translate3d(0,0,0)`;
          container.current.style.opacity = op.toString();
          const g = 255 - 64 * amber,
            b = 255 - 255 * amber;
          container.current.style.color = `rgba(255, ${Math.floor(g)}, ${Math.floor(b)}, ${0.2 + amber * 0.8})`;
        }
      }
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, [lang]);

  return (
    <div className="bg-black text-white selection:bg-amber-500 selection:text-black">
      {isInitialLoading && (
        <SharedLoading
          isEntry={true}
          onComplete={() => setIsInitialLoading(false)}
        />
      )}
      <div
        id="yellow-overlay"
        ref={allSongRefs.overlay}
        className="fixed inset-0 bg-amber-500 z-[60] pointer-events-none opacity-0 will-change-opacity"
      />

      <Navbar
        lang={lang}
        isMobile={isMobile} // Tambahkan baris ini
        onToggle={(l: "in" | "en") => changeLanguage(l)}
        onBack={() => {
          setTargetUrl(`/?lang=${lang}`);
          setIsExiting(true);
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          // 1. Initial: Muncul dari bawah (y: 20) dan transparan
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          // 2. Animate: Ke posisi normal dan solid
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          // 3. Exit: Menghilang ke atas (y: -20) dan transparan
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          onAnimationComplete={updateParallaxElements}
          // 4. Transition: Buat durasi sedikit lebih lama untuk kesan mewah
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier (Expo out)
          }}
        >
          {/* HERO SECTION */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="container px-8 md:px-24 mt-20 relative z-10 flex flex-col items-center md:items-start">
              <span className="text-[10px] tracking-[1em] text-amber-500 font-black uppercase mb-6">
                {lang === "in" ? "Katalog Musik" : "Music Catalog"}
              </span>

              {/* Menggunakan heroLeft dari Config */}
              <div
                data-parallax-speed="0.3"
                data-parallax-direction="x"
                className="will-change-transform italic"
              >
                <h1 className="text-7xl md:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase">
                  {animText[lang].heroLeft}
                </h1>
              </div>

              {/* Menggunakan heroRight dari Config */}
              <div
                data-parallax-speed="-0.3"
                data-parallax-direction="x"
                className="will-change-transform italic md:ml-40 mt-4"
              >
                <h1 className="text-7xl md:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase">
                  {animText[lang].heroRight}
                </h1>
              </div>
            </div>

            <div
              data-parallax-speed="0.05"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] whitespace-nowrap text-[30rem] font-black italic uppercase"
            >
              DISCOGRAPHY
            </div>
          </section>

          {/* ALBUM LIST */}
          {discoContent[lang].map((item: any) => {
            // --- 1. DEFINISI VARIANTS DENGAN TYPE EXPLICIT ---
            // Menambahkan ': Variants' akan menghilangkan garis merah karena TS tahu ini adalah aset Framer Motion

            const box3DVariants: Variants = {
              hidden: {
                opacity: 0,
                x: 150,
                rotateY: -65,
                rotateX: 5,
                scale: 0.85,
                filter: "blur(10px)",
              },
              visible: {
                opacity: 1,
                x: 0,
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            };

            const imageVariants: Variants = {
              hidden: { filter: "grayscale(100%)" },
              visible: {
                filter: "grayscale(0%)",
                transition: { duration: 2.0, ease: "easeOut" },
              },
            };

            const glowVariants: Variants = {
              hidden: { opacity: 0.1 },
              visible: {
                opacity: 0.5,
                transition: { duration: 2.0, ease: "easeOut" },
              },
            };

            return (
              <section
                key={item.id}
                className={`relative h-screen w-full ${item.bg} flex items-center justify-center border-b border-white/5 overflow-hidden`}
              >
                <div className="container px-8 md:px-24 z-10 flex flex-col justify-center min-h-[80vh]">
                  <div
                    data-parallax-speed="-0.15"
                    className="will-change-transform relative z-30" // Tambahkan 'relative z-30'
                  >
                    <span
                      className={`text-[10px] tracking-[0.8em] font-bold mb-4 block ${item.accent}`}
                    >
                      {item.year} RELEASE
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.8]">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-10 mt-8">
                    {/* Tombol Listen dengan Parallax dan Dua Bahasa */}
                    <button
                      data-parallax-speed="-0.1" // Menambahkan efek parallax (negatif agar searah dengan judul)
                      className="bg-white text-black px-10 py-5 rounded-full font-black text-[11px] uppercase hover:bg-amber-500 transition-all flex items-center gap-3 shrink-0 z-30 relative will-change-transform"
                    >
                      <Play size={14} fill="currentColor" />
                      {animText[lang].listen}
                    </button>

                    {/* --- ORCHESTRATOR --- */}
                    <motion.div
                      data-parallax-speed="0.15"
                      data-parallax-direction="y"
                      className="will-change-transform md:ml-20 relative"
                      style={{ perspective: "2000px" }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.3 }}
                    >
                      {/* 1. KOTAK 3D */}
                      <motion.div
                        variants={box3DVariants}
                        className="relative w-64 h-64 md:w-96 md:h-96 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden z-10"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/20 z-10 pointer-events-none" />

                        {/* 2. GAMBAR COVER DENGAN PROTEKSI */}
                        <motion.img
                          src={item.cover}
                          alt={item.title}
                          variants={imageVariants}
                          className="w-full h-full object-cover select-none"
                          // PROTEKSI: Mencegah Klik Kanan & Drag & Drop
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                        />

                        {/* 3. GHOST OVERLAY: Mencegah Inspect Element langsung ke gambar */}
                        <div className="absolute inset-0 z-20 bg-transparent cursor-default" />

                        <div className="absolute inset-4 border border-white/0 z-20 pointer-events-none" />
                      </motion.div>

                      {/* 4. GLOW BACKGROUND */}
                      <motion.div
                        className="absolute -inset-10 blur-[120px] -z-10"
                        style={{ backgroundColor: item.accentColor }}
                        variants={glowVariants}
                      />
                    </motion.div>
                  </div>

                  {/* Angka Background */}
                  <div
                    data-parallax-speed="0.3"
                    className="absolute right-10 md:right-20 top-1/2 -translate-y-1/2 opacity-[0.03] text-[30rem] md:text-[45rem] font-black italic pointer-events-none select-none z-0"
                  >
                    {item.id}
                  </div>
                </div>
              </section>
            );
          })}

          {/* ALL SONG SECTION */}
          <section
            id="allsong-section"
            ref={allSongRefs.section}
            className="relative h-[300vh] md:h-[500vh] bg-[#050505] w-full"
          >
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
              <div
                ref={allSongRefs.container}
                className="relative flex items-center justify-center gap-0 z-10 will-change-transform"
                style={{ opacity: 0, color: "rgba(255,255,255,0.2)" }}
              >
                {/* LEFT WORD */}
                <div
                  ref={allSongRefs.left}
                  className="will-change-transform flex items-center justify-end"
                >
                  <svg
                    viewBox={animText[lang].viewBoxLeft}
                    className={`${animText[lang].height} w-auto overflow-visible`} // Gunakan dynamic height
                  >
                    <text
                      x="50%"
                      y="50%"
                      dy=".35em"
                      textAnchor="middle"
                      className="font-black italic tracking-tighter uppercase"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke" // <--- TAMBAHKAN BARIS INI
                      style={{ fontSize: "60px" }}
                    >
                      {animText[lang].left}
                    </text>
                  </svg>
                </div>

                {/* RIGHT WORD */}
                <div
                  ref={allSongRefs.right}
                  className="will-change-transform flex items-center justify-start"
                >
                  <svg
                    viewBox={animText[lang].viewBoxRight}
                    className={`${animText[lang].height} w-auto overflow-visible`} // Gunakan dynamic height
                  >
                    <text
                      x="50%"
                      y="50%"
                      dy=".35em"
                      textAnchor="middle"
                      className="font-black italic tracking-tighter uppercase"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke" // <--- TAMBAHKAN BARIS INI
                      style={{ fontSize: "60px" }}
                    >
                      {animText[lang].right}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isExiting && (
          <SharedLoading onComplete={() => router.push(targetUrl)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DiscographyPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <DiscographyContent />
    </Suspense>
  );
}
