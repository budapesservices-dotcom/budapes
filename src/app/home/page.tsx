"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import SharedLoading from "@/lib/SharedLoading";
function LiquidBackground() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if ("paintWorklet" in CSS) {
      // @ts-ignore
      CSS.paintWorklet.addModule("/liquid-worklet.js");
    }

    let animationFrameId: number;
    const animate = () => {
      setTime((prev) => prev + 0.0025);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={
        {
          // @ts-ignore
          background: "paint(liquid-background)",
          "--fluid-time": time,
          filter: "contrast(1.3)",
        } as any
      }
    />
  );
}

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lang, setLang] = useState<"in" | "en">("in");
  // State Transisi
  const [showLoading, setShowLoading] = useState(true); // Animasi Masuk
  const [isExiting, setIsExiting] = useState(false); // Animasi Keluar
  const [nextUrl, setNextUrl] = useState<string | null>(null); // Tujuan URL
  const router = useRouter();
  const backHandledRef = useRef(false); // prevent duplicate popstate handling
  const [targetUrl, setTargetUrl] = useState(""); // Tambahkan ini agar tidak garis merah
  // --- CONTENT DATA (Tetap Sama) ---
  const content = {
    in: {
      hero: "BUDAPES",
      tagline: "Seni dalam Inovasi, Jiwa dalam Kreasi.",
      navItems: [
        {
          title: "Diskografi",
          href: "/discography",
          description:
            "Berani dalam harmoni, tajam dalam komposisi. Koleksi mahakarya bagi mereka yang memahami arti sebuah kualitas sejati.",
        },
        {
          title: "Portofolio",
          href: "/portfolio",
          description:
            "Hanya untuk mereka yang tidak mengenal kompromi. Jejak kolaborasi global yang mendefinisikan ulang arti sebuah standar.",
        },
        {
          title: "Tentang kami",
          href: "/about-us",
          description:
            "Menatap masa depan dengan keberanian. Menyatukan presisi digital dengan intuisi manusia.",
        },
      ],
      menuLabel: "Layanan & Legal",
      extendedMenu: [
        { label: "Berita", href: "/news" },
        { label: "Konsultasi", href: "/consultation" },
        { label: "Tutorial", href: "/tutorial" },
        { label: "Kebijakan Privasi", href: "/privacy-policy" },
        { label: "Dukungan", href: "/support" },
      ],
      helpText: "Butuh bantuan?",
      ctaText: "Hubungi Kami",
      confirmTap: "Tap lagi untuk masuk →",
    },
    en: {
      hero: "BUDAPES",
      tagline: "The Art of Innovation, The Soul of Creation.",
      navItems: [
        {
          title: "Discography",
          href: "/discography",
          description:
            "Bold in harmony, sharp in composition. A collection of masterpieces for those who truly understand the meaning of authenticity.",
        },
        {
          title: "Portfolio",
          href: "/portfolio",
          description:
            "Reserved for the uncompromising. A trail of global collaborations redefining the very essence of standards.",
        },
        {
          title: "About us",
          href: "/about-us",
          description:
            "Gazing into the future with courage. Fusing digital precision with human intuition.",
        },
      ],
      menuLabel: "Services & Legal",
      extendedMenu: [
        { label: "News", href: "/news" },
        { label: "Consultation", href: "/consultation" },
        { label: "Tutorial", href: "/tutorial" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Support", href: "/support" },
      ],
      helpText: "Need help?",
      ctaText: "Contact Us",
      confirmTap: "Tap again to enter →",
    },
  };

  const t = content[lang];

  useEffect(() => {
    // Cek Mobile & Language
    setIsMobile(window.innerWidth <= 768);
    const savedLang = localStorage.getItem("user-lang");
    if (savedLang === "in" || savedLang === "en") setLang(savedLang);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMenuOpen]);

  // --- LOGIKA TOMBOL BACK BROWSER (POPSTATE) ---
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      // Jika kita sudah sedang proses navigasi, jangan lakukan apa-apa
      if (backHandledRef.current) return;

      e.preventDefault();
      backHandledRef.current = true;

      // Mulai animasi transisi keluar
      setIsExiting(true);

      // Gunakan replace agar history yang berantakan tertimpa dengan halaman tujuan
      setTimeout(() => {
        router.replace("/."); // Kembali ke Welcome Page
      }, 3000);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      backHandledRef.current = false;
    };
  }, [router]);

  const changeLanguage = (newLang: "in" | "en") => {
    setLang(newLang);
    localStorage.setItem("user-lang", newLang);
  };

  // Fungsi navigasi manual untuk menu items agar ada animasinya
  const handleNavigation = (url: string) => {
    setNextUrl(url); // Simpan tujuan
    setIsExiting(true); // Mulai SharedLoading (Normal/Menggambar)
  };

  const menuVariants: Variants = {
    closed: {
      width: "40px",
      height: "40px",
      borderRadius: "999px",
      backgroundColor: "rgba(255, 255, 255, 0)", // Transparan saat tertutup
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
    open: {
      width: isMobile ? "230px" : "280px",
      height: "auto",
      minHeight: isMobile ? "350px" : "450px",
      borderRadius: "24px",
      backgroundColor: "rgb(255, 255, 255)", // NEGATIF: Putih solid saat terbuka
      transition: { type: "spring", stiffness: 120, damping: 20 },
      transformOrigin: "right top",
    },
  };

  return (
    <>
      {/* 1. ANIMASI MASUK (REVERSE / MENGHAPUS) */}
      {/* Perbaikan: Hapus duplikasi, cukup satu AnimatePresence */}
      <AnimatePresence>
        {showLoading && (
          <SharedLoading
            reverse={true}
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* 2. ANIMASI KELUAR (NORMAL / MENGGAMBAR) */}
      {/* Muncul saat tombol back ditekan ATAU menu diklik */}
      <AnimatePresence>
        {isExiting && (
          <div className="fixed inset-0 z-[9999]">
            <SharedLoading
              reverse={false}
              onComplete={() => {
                // close overlay first to avoid it sticking if navigation fails
                setIsExiting(false);
                const url = nextUrl;
                setNextUrl(null);
                if (url) {
                  if (url === "/") router.replace(url);
                  else router.push(url);
                }
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      {/* Tambahkan pointer-events-none saat loading agar user tidak klik sembarangan */}
      <div
        className={`h-screen w-full bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative flex flex-col ${showLoading || isExiting ? "pointer-events-none" : "pointer-events-auto"}`}
      >
        {/* --- BACKGROUND --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505]">
          {/* Cukup panggil komponennya di sini, garis merah akan hilang */}
          <LiquidBackground />

          {/* Vignette Gelap agar teks tajam */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_rgba(0,0,0,0.8)_100%)] opacity-100" />

          {/* Vignette Gelap (Tetap dipertahankan agar teks tajam) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_rgba(0,0,0,0.8)_100%)] opacity-100" />
        </div>

        {/* --- NAVBAR --- */}
        <nav className="relative z-[100] w-full flex justify-between items-center px-6 sm:px-12 py-8 shrink-0">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
            {/* Logo Video */}
            <video
              src="/logo-transparan.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-4">
            {/* Lang Switch - Versi Pill yang Bergeser */}
            <div className="absolute left-1/2 -translate-x-1/2 sm:relative sm:left-0 sm:translate-x-0 sm:ml-auto sm:mr-4">
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-9 sm:h-10 backdrop-blur-md">
                {/* Pill Background yang Bergeser */}
                <motion.div
                  className="absolute bg-white rounded-full h-[80%] my-auto"
                  initial={false}
                  animate={{
                    x: lang === "in" ? 0 : isMobile ? 32 : 40, // Sesuaikan jarak geser
                    width: isMobile ? "32px" : "40px",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                <button
                  onClick={() => changeLanguage("in")}
                  className={`relative z-10 w-8 sm:w-10 text-[9px] sm:text-[10px] font-bold tracking-widest transition-colors duration-300 ${
                    lang === "in"
                      ? "text-black"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  ID
                </button>

                <button
                  onClick={() => changeLanguage("en")}
                  className={`relative z-10 w-8 sm:w-10 text-[9px] sm:text-[10px] font-bold tracking-widest transition-colors duration-300 ${
                    lang === "en"
                      ? "text-black"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Menu Toggle */}
            <div className="relative w-14 h-14">
              <motion.div
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
                variants={menuVariants}
                className={`absolute top-0 right-0 border flex flex-col overflow-hidden ${isMenuOpen ? "border-white/10 shadow-2xl backdrop-blur-3xl" : "border-transparent"}`}
              >
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center z-[110] focus:outline-none"
                >
                  <AnimatePresence mode="wait">
                    {!isMenuOpen ? (
                      <motion.div
                        key="hamburger"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-[3.5px] items-end"
                      >
                        {/* Saat tertutup: Garis tetap Putih */}
                        <span className="h-[1.5px] w-4 bg-white rounded-full" />
                        <span className="h-[1.5px] w-5 bg-white rounded-full" />
                        <span className="h-[1.5px] w-3 bg-white rounded-full" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        className="relative w-4 h-4 flex items-center justify-center"
                      >
                        {/* Saat terbuka: Garis berubah jadi Hitam agar terlihat di BG Putih */}
                        <span className="absolute w-4 h-[1.5px] bg-black rounded-full rotate-45" />
                        <span className="absolute w-4 h-[1.5px] bg-black rounded-full -rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Isi Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-12 px-8 pb-8 w-full flex flex-col gap-2"
                    >
                      <div className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 mb-4 px-1">
                        {t.menuLabel}
                      </div>
                      {t.extendedMenu.map((menu, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5, color: "#000000" }}
                          onClick={() => {
                            // Tutup menu hamburger
                            setIsMenuOpen(false);
                            // Jalankan navigasi dengan transisi
                            const targetHref = `${menu.href}?lang=${lang}`;
                            handleNavigation(targetHref);
                          }}
                          className="w-full text-left py-4 px-2 border-b border-black/5 text-sm font-semibold text-neutral-600 hover:text-black transition-colors flex justify-between items-center group"
                        >
                          <span>{menu.label}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                            →
                          </span>
                        </motion.button>
                      ))}

                      {/* Box Kontak - Latar Hitam, Teks Abu & Hitam */}
                      <div
                        onClick={() => {
                          setIsMenuOpen(false); // Tutup menu agar tidak menghalangi transisi
                          handleNavigation(`/contact?lang=${lang}`); // Panggil fungsi transisi
                        }}
                        className="mt-8 p-4 bg-black rounded-2xl border border-white/10 text-center transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group relative z-[120]"
                      >
                        <p className="text-[8px] text-neutral-400 leading-relaxed uppercase tracking-widest group-hover:text-neutral-300 transition-colors pointer-events-none">
                          {t.helpText}
                          <br />
                          <span className="text-white font-black text-[10px]">
                            {t.ctaText}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* --- MAIN --- */}
        <main className="relative z-10 grow flex flex-col items-center justify-start sm:justify-center px-6 text-center pt-4 sm:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="max-w-full w-full mx-auto flex flex-col items-center mt-4 sm:-mt-10"
            >
              <div className="relative z-50">
                <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-black leading-tight sm:leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {t.hero}
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-neutral-600 font-bold tracking-[0.4em] uppercase text-[8px] md:text-xs mt-1 mb-4 sm:mb-10"
              >
                {t.tagline}
              </motion.p>

              <div className="relative w-full max-w-4xl mx-auto px-4 h-32.5 flex items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-5 w-full">
                  {t.navItems.map((item, index) => (
                    <motion.div
                      key={`${lang}-${index}`}
                      onMouseEnter={() => {
                        if (!window.matchMedia("(pointer: coarse)").matches)
                          setHoveredIndex(index);
                      }}
                      onMouseLeave={() => {
                        if (!window.matchMedia("(pointer: coarse)").matches)
                          setHoveredIndex(null);
                      }}
                      onClick={() => {
                        const isTouchDevice =
                          typeof window !== "undefined" &&
                          window.matchMedia("(pointer: coarse)").matches;
                        const targetHref = `${item.href.toLowerCase()}?lang=${lang}`;
                        if (isTouchDevice) {
                          if (clickedIndex === index)
                            handleNavigation(targetHref);
                          else setClickedIndex(index);
                        } else {
                          handleNavigation(targetHref);
                        }
                      }}
                      style={{
                        height:
                          hoveredIndex === index || clickedIndex === index
                            ? "140px"
                            : "60px",
                      }}
                      className={`relative backdrop-blur-3xl border rounded-4xl overflow-hidden cursor-pointer p-4 flex flex-col items-center justify-center transition-all duration-500 
      ${
        clickedIndex === index || hoveredIndex === index
          ? "bg-white border-white z-30 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          : "bg-transparent border-white/5 z-20"
      }`}
                    >
                      {/* Teks Tombol (Berubah jadi hitam saat hover/negatif) */}
                      <motion.span
                        className={`relative z-10 font-black tracking-[0.2em] uppercase transition-all duration-500 
        ${
          clickedIndex === index || hoveredIndex === index
            ? "text-[12px] text-black" // NEGATIF: Teks Hitam
            : "text-[9px] text-neutral-500"
        }`}
                      >
                        {item.title}
                      </motion.span>

                      <AnimatePresence>
                        {(hoveredIndex === index || clickedIndex === index) && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10 w-full flex flex-col items-center mt-2"
                          >
                            {/* Garis pemisah jadi hitam agar kontras di atas BG putih */}
                            <div className="w-10 h-[2px] mb-3 rounded-full bg-black/20" />

                            <p className="text-black font-bold text-[9px] leading-relaxed text-center px-2">
                              {item.description}
                            </p>

                            {clickedIndex === index && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 text-[7px] text-neutral-500 tracking-widest uppercase animate-pulse sm:hidden"
                              >
                                {t.confirmTap}
                              </motion.span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="relative z-[100] w-full pb-8 pt-4 text-center shrink-0">
          <p className="text-neutral-700 text-[8px] tracking-[0.3em] uppercase font-bold">
            © {new Date().getFullYear()} Budapes Studio
          </p>
        </footer>
        <AnimatePresence>
          {isExiting && (
            <SharedLoading onComplete={() => router.push(targetUrl)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
