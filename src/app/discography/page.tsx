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
  const dynamicColor =
    "rgb(calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))))";

  return (
    <nav
      ref={navRef}
      style={
        { "--nav-theme": "0", "--back-move": "0px", "--logo-op": "0" } as any
      }
      className="fixed top-0 left-0 w-full p-8 z-[100] flex justify-between items-center pointer-events-none"
    >
      {/* SISI KIRI: Area Logo & Tombol Kembali */}
      <div className="relative flex items-center h-9 sm:h-10">
        {/* LOGO BUDAPES ©: absolute agar tidak mendorong tombol back di awal */}
        <div
          className="logo-budapes absolute left-0 flex items-center gap-1 transition-opacity duration-300 shrink-0 pointer-events-none"
          style={
            {
              opacity: "var(--logo-op)",
              color: "black",
              height: "100%", // Mengikuti tinggi parent (h-9/h-10)
            } as any
          }
        >
          <span className="text-[20px] font-black tracking-[0.2em] uppercase">
            Budapes
          </span>
          <span className="text-[14px] font-bold">©</span>
        </div>

        {/* Tombol Kembali: Relative agar berada di pojok kiri saat logo 'gaib' */}
        <div
          className="pointer-events-auto back-btn-container transition-transform duration-75 ease-out flex items-center"
          style={{ transform: "translateX(var(--back-move))" } as any}
        >
          <button
            onClick={onBack}
            style={{ color: dynamicColor } as any}
            className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase transition-all"
          >
            <ArrowLeft size={14} /> {lang === "in" ? "Kembali" : "Back"}
          </button>
        </div>
      </div>

      {/* SISI KANAN: Toggle Bahasa */}
      <div className="pointer-events-auto toggle-wrapper">
        <div
          style={
            {
              backgroundColor:
                "rgba(255, 255, 255, calc(0.05 * (1 - var(--nav-theme))))",
              // UBAH BAGIAN INI:
              // Kita gunakan calc untuk RGB agar berubah dari 255 (putih) ke 0 (hitam)
              borderColor:
                "rgba(calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))), calc(255 * (1 - var(--nav-theme))), 0.2)",
            } as any
          }
          className="relative flex items-center border rounded-full p-1 h-9 sm:h-10 backdrop-blur-md transition-colors"
        >
          {/* ... isi toggle (motion.div dan button ID/EN) tetap sama seperti kode Anda ... */}
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
              lang === "in"
                ? "active-txt-theme text-black"
                : "inactive-txt-theme text-neutral-500"
            }`}
          >
            ID
          </button>
          <button
            onClick={() => onToggle("en")}
            className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold transition-colors duration-300 ${
              lang === "en"
                ? "active-txt-theme text-black"
                : "inactive-txt-theme text-neutral-500"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};

function DiscographyContent() {
  const smoothVelocity = useRef(0);
  const isRectReady = useRef(false);
  const currentX = useRef(0);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const [showSymbol, setShowSymbol] = useState(false);
  const showSymbolRef = useRef(false);
  const [showCenterRect, setShowCenterRect] = useState(false);
  useEffect(() => {
    if (showSymbol) {
      const menuTimer = setTimeout(() => setIsMenuOpen(true), 1500);
      // Pemicu Persegi Panjang: Muncul 1 detik setelah menu mulai terbuka
      const rectTimer = setTimeout(() => setShowCenterRect(true), 2500);

      return () => {
        clearTimeout(menuTimer);
        clearTimeout(rectTimer);
      };
    } else {
      setIsMenuOpen(false);
      setShowCenterRect(false);
    }
  }, [showSymbol]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = {
    in: ["Portofolio", "Tentang Kami", "Dukungan", "Hubungi Kami"],
    en: ["Portfolio", "About Us", "Support", "Contact Us"],
  };

  useEffect(() => {
    if (showSymbol) {
      // Menunggu animasi (+) -> (|) selesai sebelum membuka menu
      const timer = setTimeout(() => setIsMenuOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsMenuOpen(false);
    }
  }, [showSymbol]);

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

      // --- PARALLAX MANAGER (KEMBALIKAN KODE INI) ---
      if (parallaxElementsRef.current) {
        parallaxElementsRef.current.forEach((el) => {
          // Ambil kecepatan dari atribut data-parallax-speed
          const speed = parseFloat(
            el.getAttribute("data-parallax-speed") || "0",
          );
          const direction = el.getAttribute("data-parallax-direction") || "y";

          const rect = el.getBoundingClientRect();
          const center = windowH / 2;

          // Rumus Parallax: Jarak elemen dari tengah layar * kecepatan
          const dist = (rect.top + rect.height / 2 - center) * speed;

          // Terapkan transformasi
          if (direction === "x") {
            (el as HTMLElement).style.transform =
              `translate3d(${dist}px, 0, 0)`;
          } else {
            (el as HTMLElement).style.transform =
              `translate3d(0, ${dist}px, 0)`;
          }
        });
      }

      // --- TEMPATKAN KODE BARU DI SINI (GANTIKAN ALL SONG MANAGER LAMA) ---
      const { section, container, left, right, overlay } = allSongRefs;
      if (
        section.current &&
        container.current &&
        left.current &&
        right.current &&
        overlay.current
      ) {
        const rect = section.current.getBoundingClientRect();
        const scrollableH = rect.height - windowH;

        if (scrollableH > 0 && rect.top <= windowH && rect.bottom >= 0) {
          const progress = Math.min(Math.max(-rect.top / scrollableH, 0), 1);

          // 1. TIMELINE: 0.0 - 0.2 (Fade Text)
          let op = progress <= 0.2 ? progress / 0.2 : 1;

          // 2. TIMELINE: 0.2 - 0.4 (Zooming & Amber Fade)
          const oVal = Math.min(Math.max((progress - 0.2) / 0.2, 0), 1);

          const zProg = oVal;
          const sc = 1 + Math.pow(zProg, 3) * 120;
          const amber = zProg;

          overlay.current.style.opacity = oVal.toString();

          if (navRef.current) {
            navRef.current.style.setProperty("--nav-theme", oVal.toString());
            navRef.current.style.setProperty("--logo-op", oVal.toString());

            const backBtn = navRef.current.querySelector(
              ".back-btn-container",
            ) as HTMLElement;
            const toggleWrap = navRef.current.querySelector(
              ".toggle-wrapper",
            ) as HTMLElement;

            if (backBtn && toggleWrap) {
              const navWidth = navRef.current.offsetWidth;
              // Hitung jarak: Lebar Nav - Padding (64px) - Lebar Toggle - Lebar Back - Gap (24px)
              const moveDist =
                navWidth -
                64 -
                toggleWrap.offsetWidth -
                backBtn.offsetWidth -
                24;

              // Terapkan nilai geser berdasarkan progress zooming (oVal)
              navRef.current.style.setProperty(
                "--back-move",
                `${moveDist * oVal}px`,
              );
            }

            const shouldShow = oVal > 0.95;
            if (shouldShow !== showSymbolRef.current) {
              showSymbolRef.current = shouldShow;
              setShowSymbol(shouldShow);
            }

            // --- LOGIKA HORIZONTAL SCROLL (Hanya Aktif Jika Ready) ---
            if (horizontalContainerRef.current) {
              // 1. TAMBAHKAN DEKLARASI INI:
              let targetX = 0;

              if (isRectReady.current && progress > 0.4) {
                const hProg = (progress - 0.4) / 0.6;
                // 2. Beri nilai ke variabel yang sudah dideklarasikan
                targetX = hProg * -3800;
              }

              horizontalContainerRef.current.style.transform = `translate3d(${targetX}px, 0, 0)`;

              // --- LOGIKA EFEK OMBAK (SMOOTH WAVE) ---
              const boxItems =
                horizontalContainerRef.current.querySelectorAll(".box-item");
              const vCenter = window.innerWidth / 2;

              // 1. Ambil kecepatan asli
              const targetVel = Math.abs(lenis.velocity);

              // 2. LERP: Menghaluskan kecepatan (0.05 adalah faktor kehalusan)
              // Semakin kecil angkanya (misal 0.02), semakin lambat kotak kembali ke semula.
              smoothVelocity.current +=
                (targetVel - smoothVelocity.current) * 0.04;

              boxItems.forEach((el: any) => {
                const rect = el.getBoundingClientRect();
                const boxCenter = rect.left + rect.width / 2;
                const distToCenter = Math.abs(vCenter - boxCenter);

                // 1. Proximity: Seberapa dekat kotak dengan tengah layar
                const proximity = Math.max(0, 1 - distToCenter / 600);

                // 2. Kecepatan asli (bukan Math.abs) untuk menentukan arah skew
                const rawVel = lenis.velocity;

                // 3. Efek Scale: Memanjang secara vertikal
                const scaleY = 1 + proximity * smoothVelocity.current * 0.003;

                // 4. Efek Skew: Miring searah kecepatan scroll (Ciri khas Aristide)
                // Semakin cepat scroll, semakin miring kotaknya
                const skew = rawVel * 0.01 * proximity;

                // 5. Terapkan transformasi gabungan
                el.style.transform = `scaleY(${scaleY}) skewY(${skew}deg)`;
              });
            }

            const activeTexts =
              navRef.current.querySelectorAll(".active-txt-theme");
            if (oVal > 0.5) {
              activeTexts.forEach((el: any) => (el.style.color = "white"));
            } else {
              activeTexts.forEach((el: any) => (el.style.color = "black"));
            }
          }

          container.current.style.transform = `scale(${sc}) translate3d(0,0,0)`;
          container.current.style.opacity = op.toString();
          const g = 255 - 95 * amber;
          const b = 255 - 255 * amber;
          container.current.style.color = `rgb(255, ${Math.floor(g)}, ${Math.floor(b)})`;
        }
      }
      // --- SELESAI ---

      requestAnimationFrame(raf);
    }

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
              // Ubah dari h-[500vh] menjadi h-[1000vh]
              className="relative h-[400vh] md:h-[1000vh] bg-[#050505] w-full"
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

      {/* LAMBANG (+) KE (|) MORPHING */}
      <AnimatePresence>
        {showSymbol && (
          <div className="fixed bottom-12 right-12 z-[100] flex items-center gap-6">
            {/* ITEM MENU (Muncul dari kiri simbol) */}
            <div className="flex flex-row-reverse items-center gap-6">
              <AnimatePresence>
                {isMenuOpen &&
                  menuItems[lang].map((item: string, i: number) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                      transition={{
                        delay: i * 0.1, // Efek muncul bergantian (stagger)
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-black font-black text-[11px] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity"
                    >
                      {item}
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>

            {/* SIMBOL (+) KE (|) */}
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: 720,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { type: "spring", stiffness: 400, damping: 15 },
                rotate: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.2 },
              }}
              className="w-16 h-16 flex items-center justify-center cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Bisa diklik untuk toggle manual
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Batang Vertikal Tetap */}
                <div className="absolute w-[4px] h-full bg-black rounded-full" />

                {/* Batang Horizontal (Morphing ke Vertikal) */}
                <motion.div
                  initial={{ rotate: 0, scaleX: 1 }}
                  animate={{ rotate: 90, scaleX: 0, opacity: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute w-full h-[4px] bg-black rounded-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCenterRect && (
          <motion.div
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: "0vw", opacity: 1 }}
            exit={{ x: "-100vw", opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              isRectReady.current = true;
            }}
            className="fixed inset-y-0 left-0 w-full z-[95] pointer-events-none flex items-center overflow-hidden"
          >
            <div
              ref={horizontalContainerRef}
              className="flex gap-4 pl-[50vw] will-change-transform"
            >
              {/* Total 16 Kotak (Sudah termasuk kotak utama) */}
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  // HAPUS: transition-transform duration-300 ease-out
                  // HAPUS: style={{ transitionProperty: "transform" }}
                  className="box-item h-[370px] w-24 md:w-32 bg-black shrink-0 shadow-2xl origin-center will-change-transform"
                />
              ))}
            </div>
          </motion.div>
        )}
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
