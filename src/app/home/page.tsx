"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import SharedLoading from "@/lib/SharedLoading";

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
        { label: "Berita" },
        { label: "Konsultasi" },
        { label: "Tutorial" },
        { label: "Kebijakan Privasi" },
        { label: "Dukungan" },
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
        { label: "News" },
        { label: "Consultation" },
        { label: "Tutorial" },
        { label: "Privacy Policy" },
        { label: "Support" },
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
    // Push state agar browser punya history untuk di-pop
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      if (backHandledRef.current) return; // sudah sedang diproses
      backHandledRef.current = true;

      // Jalankan exit animation lalu navigasi
      setNextUrl("/");
      setIsExiting(true);

      // Lepaskan listener agar tidak tertrigger lagi
      window.removeEventListener("popstate", handleBackButton);
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  const changeLanguage = (newLang: "in" | "en") => {
    setLang(newLang);
    localStorage.setItem("user-lang", newLang);
  };

  // Fungsi navigasi manual untuk menu items agar ada animasinya
  const handleNavigation = (url: string) => {
    setNextUrl(url);
    setIsExiting(true); // Pemicu SharedLoading Normal
  };

  const menuVariants: Variants = {
    closed: {
      width: "40px",
      height: "40px",
      borderRadius: "999px",
      backgroundColor: "rgba(255, 255, 255, 0)",
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
    open: {
      width: isMobile ? "230px" : "280px",
      height: "auto",
      minHeight: isMobile ? "350px" : "450px",
      borderRadius: "24px",
      backgroundColor: "rgba(10, 10, 10, 0.98)",
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
        {/* --- BACKGROUND MESH --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "50% 50%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(at 0% 0%, #6366f1 0px, transparent 80%), radial-gradient(at 100% 0%, #f43f5e 0px, transparent 50%), radial-gradient(at 50% 100%, #06b6d4 0px, transparent 50%)",
              backgroundSize: "300% 300%",
              filter: "blur(60px)",
            }}
          />
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
            {/* Lang Switch */}
            <div className="absolute left-1/2 -translate-x-1/2 sm:relative sm:left-0 sm:translate-x-0 sm:ml-auto sm:mr-4">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-10 backdrop-blur-md transition-all">
                <button
                  onClick={() => changeLanguage("in")}
                  className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] transition-colors cursor-pointer ${lang === "in" ? "text-indigo-400" : "text-neutral-500 hover:text-neutral-300"}`}
                >
                  ID
                </button>
                <span className="mx-1.5 sm:mx-2 text-neutral-800 text-[8px] sm:text-[10px] select-none">
                  |
                </span>
                <button
                  onClick={() => changeLanguage("en")}
                  className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] transition-colors cursor-pointer ${lang === "en" ? "text-indigo-400" : "text-neutral-500 hover:text-neutral-300"}`}
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
                        <span className="absolute w-4 h-[1.5px] bg-white rounded-full rotate-45" />
                        <span className="absolute w-4 h-[1.5px] bg-white rounded-full -rotate-45" />
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
                      <div className="text-[9px] tracking-[0.3em] uppercase text-neutral-600 mb-4 px-1">
                        {t.menuLabel}
                      </div>
                      {t.extendedMenu.map((menu, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 5, color: "#6366f1" }}
                          className="w-full text-left py-4 px-2 border-b border-white/5 text-sm font-semibold text-neutral-400 hover:text-white transition-colors flex justify-between items-center group"
                        >
                          <span>{menu.label}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                            →
                          </span>
                        </motion.button>
                      ))}
                      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <p className="text-[8px] text-neutral-600 leading-relaxed uppercase tracking-widest">
                          {t.helpText} <br />
                          <span className="text-indigo-400 font-black">
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
                <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-black leading-tight sm:leading-none px-4 sm:px-12">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-cyan-400 animate-gradient-text">
                    {t.hero}
                  </span>
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
                      whileHover={{
                        scale: 1.01,
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        transition: { duration: 0.3 },
                      }}
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
                          if (clickedIndex === index) {
                            handleNavigation(targetHref); // Gunakan handler animasi
                          } else {
                            setClickedIndex(index);
                          }
                        } else {
                          handleNavigation(targetHref); // Gunakan handler animasi
                        }
                      }}
                      style={{
                        height:
                          hoveredIndex === index || clickedIndex === index
                            ? "140px"
                            : "60px",
                        backgroundImage:
                          clickedIndex === index || hoveredIndex === index
                            ? "linear-gradient(135deg, #6366f1, #f43f5e, #06b6d4, #6366f1)"
                            : "none",
                        backgroundColor:
                          clickedIndex === index || hoveredIndex === index
                            ? "transparent"
                            : "rgba(255, 255, 255, 0.02)",
                        boxShadow:
                          clickedIndex === index || hoveredIndex === index
                            ? "0 0 40px rgba(99, 102, 241, 0.3)"
                            : "none",
                        backgroundSize: "200% 200%",
                      }}
                      className={`relative backdrop-blur-3xl border rounded-4xl overflow-hidden cursor-pointer p-4 flex flex-col items-center justify-center transition-all duration-500 ${clickedIndex === index || hoveredIndex === index ? "animate-card-gradient border-white/50 z-30" : "border-white/5 z-20"}`}
                    >
                      <motion.span
                        className={`relative z-10 font-black tracking-[0.2em] uppercase transition-all duration-300 ${clickedIndex === index ? "text-[12px] text-white" : "text-[9px] text-neutral-500"}`}
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
                            <div
                              className={`w-10 h-[2px] mb-3 rounded-full ${clickedIndex === index ? "bg-white" : "bg-white/40"}`}
                            />
                            <p className="text-white font-bold text-[9px] leading-relaxed text-center px-2">
                              {item.description}
                            </p>
                            {clickedIndex === index && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 text-[7px] text-indigo-300 tracking-widest uppercase animate-pulse sm:hidden"
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
      </div>
    </>
  );
}
