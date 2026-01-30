"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import Lenis from "lenis";
import {
  motion,
  AnimatePresence,
  Variants,
  useScroll,
  useTransform,
} from "framer-motion";
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
const Navbar = ({ lang, onToggle, onBack, isMobile, navRef }: any) => {
  // Kita simpan perhitungan warna dalam variabel agar kode bersih
  // Saat --nav-theme 0 (Putih), saat 1 (Hitam)
  const dynamicColor =
    "rgb(calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))))";

  return (
    <nav
      ref={navRef}
      style={{ "--nav-theme": "0" } as any}
      className="fixed top-0 left-0 w-full p-8 z-[100] flex justify-between items-start pointer-events-none"
    >
      <div className="pointer-events-auto">
        <button
          onClick={onBack}
          style={{ color: dynamicColor } as any}
          className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase transition-all"
        >
          <ArrowLeft size={14} /> {lang === "in" ? "Kembali" : "Back"}
        </button>
      </div>

      <div className="pointer-events-auto">
        <div
          style={
            {
              backgroundColor:
                "rgba(255, 255, 255, calc(0.05 * (1 - var(--nav-theme))))",
              borderColor:
                "rgba(255, 255, 255, calc(0.1 + (0.1 * var(--nav-theme))))",
            } as any
          }
          className="relative flex items-center border rounded-full p-1 h-9 sm:h-10 backdrop-blur-md transition-colors"
        >
          <motion.div
            style={{ backgroundColor: dynamicColor } as any}
            className="absolute rounded-full h-[80%] my-auto"
            animate={{
              x: lang === "in" ? 2 : isMobile ? 34 : 42,
              width: isMobile ? "32px" : "40px",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              mass: 0.8,
            }}
          />

          <button
            onClick={() => onToggle("in")}
            className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold transition-colors duration-300 ${
              lang === "in" ? "active-txt-theme" : "inactive-txt-theme"
            }`}
            style={{ color: lang === "in" ? "black" : "rgba(255,255,255,0.5)" }}
          >
            ID
          </button>

          <button
            onClick={() => onToggle("en")}
            className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold transition-colors duration-300 ${
              lang === "en" ? "active-txt-theme" : "inactive-txt-theme"
            }`}
            style={{ color: lang === "en" ? "black" : "rgba(255,255,255,0.5)" }}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};
function DiscographyContent() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();
  // 1. Inisialisasi State Bahasa & Mobile
  const [lang, setLang] = useState<"in" | "en">("in");
  const [isMobile, setIsMobile] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const heroSectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null); // TAMBAHKAN INI

  // 2. Setup Scroll Logic
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    // 'center start' memastikan warna sudah full amber saat hero baru naik setengah layar
    offset: ["start start", "center start"],
  });

  const bgPosLeft = useTransform(scrollYProgress, [0, 0.1], ["100% 0", "0% 0"]);

  // Baris 2: Mulai dari 0.1 sampai 0.6 scroll (sedikit lebih lambat/delay)
  const bgPosRight = useTransform(
    scrollYProgress,
    [0.03, 0.1],
    ["100% 0", "0% 0"],
  );

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
    const style = document.createElement("style");
    style.innerHTML = `::-webkit-scrollbar { display: none; } html, body { -ms-overflow-style: none; scrollbar-width: none; }`;
    document.head.appendChild(style);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      const windowH = window.innerHeight;

      // --- PARALLAX MANAGER ---
      if (parallaxElementsRef.current) {
        parallaxElementsRef.current.forEach((el: any) => {
          if (!el || !document.body.contains(el)) return;
          const speed = parseFloat(
            el.getAttribute("data-parallax-speed") || "0",
          );
          const rect = el.getBoundingClientRect();
          if (rect.top < windowH + 100 && rect.bottom > -100) {
            if (speed !== 0) {
              const shift =
                (windowH / 2 - (rect.top + rect.height / 2)) * speed;
              el.style.transform =
                el.getAttribute("data-parallax-direction") === "x"
                  ? `translate3d(${shift}px, 0, 0)`
                  : `translate3d(0, ${shift}px, 0)`;
            }
            const glossEl = el.querySelector("[data-gloss-line]");
            if (glossEl) {
              const progress = (windowH - rect.top) / (windowH + rect.height);
              const move = progress * 300 - 150;
              glossEl.style.transform = `translateX(${move}%) rotate(45deg)`;
            }
          }
        });
      }

      // --- ALL SONG MANAGER ---
      const { section, container, left, right, overlay } = allSongRefs;
      if (
        section.current &&
        container.current &&
        left.current &&
        right.current &&
        overlay.current
      ) {
        const el = section.current;
        const rect = el.getBoundingClientRect();
        const scrollableH = rect.height - windowH;
        if (scrollableH > 0 && rect.top <= windowH && rect.bottom >= 0) {
          const progress = Math.min(Math.max(-rect.top / scrollableH, 0), 1);
          let xL = 0,
            xR = 0,
            op = 0,
            sc = 1,
            amber = 0;

          if (progress <= 0.3) {
            const ease = 1 - Math.pow(1 - progress / 0.3, 3);
            xL = -20 + 20 * ease;
            xR = 20 - 20 * ease;
            op = ease;
          } else {
            xL = 0;
            xR = 0;
            op = 1;
          }

          if (progress > 0.3) {
            const zProg = (progress - 0.3) / 0.7;
            sc = 1 + Math.pow(zProg, 3) * 120;
            amber = zProg;
            const overlayStart = 0.65;
            if (progress > overlayStart) {
              const oVal = Math.min(
                (progress - overlayStart) / (1 - overlayStart),
                1,
              );
              overlay.current.style.opacity = oVal.toString();

              if (navRef.current) {
                navRef.current.style.setProperty(
                  "--nav-theme",
                  oVal.toString(),
                );

                // --- LOGIKA PENGUBAH WARNA TOGGLE ---
                const activeTexts =
                  navRef.current.querySelectorAll(".active-txt-theme");
                const inactiveTexts = navRef.current.querySelectorAll(
                  ".inactive-txt-theme",
                );

                if (oVal > 0.5) {
                  // Saat background Amber & Pill Hitam -> Teks Aktif jadi PUTIH
                  activeTexts.forEach((el: any) => (el.style.color = "white"));
                  inactiveTexts.forEach(
                    (el: any) => (el.style.color = "rgba(255,255,255,0.4)"),
                  );
                } else {
                  // Kembali ke normal saat background Hitam
                  activeTexts.forEach((el: any) => (el.style.color = "black"));
                  inactiveTexts.forEach(
                    (el: any) => (el.style.color = "rgba(255,255,255,0.5)"),
                  );
                }
              }
            } else {
              overlay.current.style.opacity = "0";
              if (navRef.current) {
                navRef.current.style.setProperty("--nav-theme", "0");
                // Reset manual saat scroll balik ke atas
                const activeTexts =
                  navRef.current.querySelectorAll(".active-txt-theme");
                activeTexts.forEach((el: any) => (el.style.color = "black"));
              }
            }
            left.current.style.transform = `translate3d(${xL}vw, 0, 0)`;
            right.current.style.transform = `translate3d(${xR}vw, 0, 0)`;
            container.current.style.transform = `scale(${sc}) translate3d(0,0,0)`;
            container.current.style.opacity = op.toString();
            const g = 255 - 95 * amber;
            const b = 255 - 255 * amber;
            container.current.style.color = `rgb(255, ${Math.floor(g)}, ${Math.floor(b)})`;
          }
        }

        // Pindahkan ini ke sini agar loop animasi tidak berhenti jika elemen All Song tidak ada
        requestAnimationFrame(raf);
      } // <--- KURUNG 1: Menutup if (section.current && ...)
    } // <--- KURUNG 2: INI YANG HILANG! Menutup function raf(time)

    const rafId = requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Jangan pakai window.scrollTo(0, 0) agar tidak macet saat di posisi bawah
    const timer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.resize(); // Beritahu Lenis konten berubah
      }
      updateParallaxElements(); // Update data-parallax
    }, 150);
    return () => clearTimeout(timer);
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
        className="fixed inset-0 bg-amber-500 z-[80] pointer-events-none opacity-0 will-change-opacity"
      />

      <Navbar
        navRef={navRef} // Masukkan ref di sini
        lang={lang}
        isMobile={isMobile}
        onToggle={(l: "in" | "en") => changeLanguage(l)}
        onBack={() => {
          setTargetUrl(`/?lang=${lang}`);
          setIsExiting(true);
        }}
      />

      <div ref={heroSectionRef as any}>
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            onAnimationComplete={updateParallaxElements}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 2. HERO SECTION: Hapus ref={heroSectionRef} dari sini agar tidak bentrok */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="w-full px-6 md:pl-12 relative z-10 flex flex-col items-start">
                <span className="text-[10px] tracking-[1em] text-amber-500 font-black uppercase mb-6 ml-2">
                  {lang === "in" ? "Katalog Musik" : "Music Catalog"}
                </span>

                {/* BARIS 1: PILIHAN (Parallax ke kanan) */}
                <div
                  data-parallax-speed="0.2"
                  data-parallax-direction="x"
                  className="will-change-transform italic md:-ml-6"
                >
                  <motion.h1
                    // Tambahkan 'px-4' (padding kiri-kanan) dan 'py-2' (padding atas-bawah)
                    className="text-6xl md:text-[12rem] font-black leading-[0.9] tracking-tighter uppercase text-transparent bg-clip-text bg-[length:200%_100%] px-4 py-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #f59e0b 50%, white 50%)",
                      backgroundPosition: bgPosLeft,
                      WebkitBackgroundClip: "text",
                      // Tambahkan ini untuk memastikan box-sizing tidak merusak ukuran
                      boxSizing: "content-box",
                    }}
                  >
                    {animText[lang].heroLeft}
                  </motion.h1>
                </div>

                {/* BARIS 2: MUTLAK (Parallax ke kiri + Menyilang) */}
                <div
                  data-parallax-speed="-0.2"
                  data-parallax-direction="x"
                  className="will-change-transform italic md:ml-32 mt-2"
                >
                  <motion.h1
                    // Tambahkan 'px-4' (padding kiri-kanan) dan 'py-2' (padding atas-bawah)
                    className="text-6xl md:text-[12rem] font-black leading-[0.9] tracking-tighter uppercase text-transparent bg-clip-text bg-[length:200%_100%] px-4 py-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #f59e0b 50%, white 50%)",
                      backgroundPosition: bgPosRight,
                      WebkitBackgroundClip: "text",
                      // Tambahkan ini untuk memastikan box-sizing tidak merusak ukuran
                      boxSizing: "content-box",
                    }}
                  >
                    {animText[lang].heroRight}
                  </motion.h1>
                </div>
              </div>

              {/* Background DISCOGRAPHY */}
              <div
                data-parallax-speed="0.05"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] whitespace-nowrap text-[30rem] font-black italic uppercase select-none pointer-events-none"
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
                  rotateY: 0, // Kita akan buat ini bergoyang di bawah
                  rotateX: 0,
                  scale: 1,
                  y: [0, -15, 0], // Menambahkan keyframe y di sini
                  filter: "blur(0px)",
                  transition: {
                    // Animasi masuk utama
                    x: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 1.5 },
                    // Animasi goyang (hanya berjalan setelah masuk)
                    y: {
                      duration: 2, // Dipercepat sedikit agar terasa pas
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
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
                      <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
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
                        // TAMBAHKAN 'z-20' DI SINI
                        className="will-change-transform md:ml-20 relative z-20"
                        style={{ perspective: "2000px" }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                      >
                        {/* 1. KOTAK 3D */}
                        <motion.div
                          variants={box3DVariants}
                          data-parallax-speed="0"
                          className="relative w-64 h-64 md:w-96 md:h-96 z-20 rounded-[6px] overflow-hidden bg-zinc-900"
                          style={{
                            transformStyle: "preserve-3d",
                            // SHADOW KOMPLEKS: Memberikan kesan massa dan elevasi
                            boxShadow: `
      0 0 0 1px rgba(255,255,255,0.1), 
      0 30px 60px -12px rgba(0,0,0,0.9), 
      0 18px 36px -18px rgba(0,0,0,1)
    `,
                          }}
                        >
                          {/* LAPISAN A: FRAME PLASTIK (BEVEL TEPI) */}
                          <div className="absolute inset-0 z-40 rounded-[6px] pointer-events-none border-[1.5px] border-t-white/30 border-l-white/30 border-b-black/70 border-r-black/70" />

                          {/* LAPISAN B: KEDALAMAN (INNER SHADOW) */}
                          <div className="absolute inset-[5px] z-35 rounded-[3px] pointer-events-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] border border-black/40" />

                          {/* LAPISAN C: GARIS KILAUAN (SCROLL-SYNCED) */}
                          <div
                            data-gloss-line
                            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] z-30 pointer-events-none"
                            style={{
                              // 1. Kita pertebal opasitas dari 0.3 menjadi 0.7 atau 0.8
                              // 2. Kita buat gradien sedikit lebih lebar agar pantulan cahayanya jelas
                              background:
                                "linear-gradient(to right, transparent 45%, rgba(255,255,255,0.5) 35%, transparent 55%)",
                              transform: "translateX(-150%) rotate(45deg)",
                              // 3. Menggunakan 'screen' agar kilauan lebih bersinar (glow) di atas warna gelap
                              mixBlendMode: "screen",
                            }}
                          />

                          {/* LAPISAN D: GAMBAR UTAMA DENGAN PADDING TEBAL */}
                          <motion.img
                            src={item.cover}
                            alt={item.title}
                            variants={imageVariants}
                            // p-[3px] membuat gambar seolah berada di dalam frame plastik
                            className="relative z-10 w-full h-full object-cover select-none p-[3px] rounded-[5px]"
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                          />

                          {/* Pelindung Klik Kanan */}
                          <div className="absolute inset-0 z-50 bg-transparent cursor-default rounded-[6px]" />
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
      </div>

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
