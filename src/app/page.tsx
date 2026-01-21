"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null); // State baru
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<"in" | "en">("in");

  const content = {
    in: {
      hero: "BUDAPES",
      tagline: "Seni dalam Inovasi, Jiwa dalam Kreasi.",
      navItems: [
        {
          title: "Diskografi",
          description:
            "Berani dalam harmoni, tajam dalam komposisi. Koleksi mahakarya bagi mereka yang memahami arti sebuah kualitas sejati, Inilah bukti dedikasi yang tak lekang oleh waktu.",
        },
        {
          title: "Portofolio",
          description:
            "Hanya untuk mereka yang tidak mengenal kompromi. Jejak kolaborasi global yang mendefinisikan ulang arti sebuah standar. Di sini, kepercayaan adalah mahakarya yang nyata.",
        },
        {
          title: "Tentang kami",
          description:
            "Menatap masa depan dengan keberanian. Menyatukan presisi digital dengan intuisi manusia. Kami adalah para pemimpi yang bekerja dengan nyata, menciptakan standar baru di tengah keriuhan dunia.",
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
          description:
            "Bold in harmony, sharp in composition. A collection of masterpieces for those who truly understand the meaning of authenticity, This is a testament to timeless dedication.",
        },
        {
          title: "Portfolio",
          description:
            "Reserved for the uncompromising. A trail of global collaborations redefining the very essence of standards. Here, trust is the ultimate masterpiece.",
        },
        {
          title: "About us",
          description:
            "Gazing into the future with courage. Fusing digital precision with human intuition. We are dreamers who act, setting new standards amidst the noise of the world.",
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
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const pageTransition = {
    initial: { opacity: 0, y: 15, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -15, filter: "blur(10px)" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
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
      // Gunakan lebar yang lebih kecil untuk mobile
      width: window.innerWidth < 640 ? "220px" : "280px",
      height: "auto",
      // Hapus minHeight yang terlalu besar atau sesuaikan
      minHeight: window.innerWidth < 640 ? "350px" : "450px",
      borderRadius: "24px",
      backgroundColor: "rgba(10, 10, 10, 0.98)",
      transition: { type: "spring", stiffness: 120, damping: 20 },
      transformOrigin: "right top",
    },
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative flex flex-col">
      {/* --- BACKGROUND MESH GRADIENT (Model Baru) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "50% 50%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(at 0% 0%, #6366f1 0px, transparent 50%), radial-gradient(at 100% 0%, #f43f5e 0px, transparent 50%), radial-gradient(at 50% 100%, #06b6d4 0px, transparent 50%)",
            backgroundSize: "200% 200%",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-[100] w-full flex justify-between items-center px-6 sm:px-12 py-8 shrink-0">
        {/* Logo dengan Video WebM */}
        <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
          <video
            src="/logo-transparan.webm" // Pastikan file berada di folder public/logo.webm
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="absolute left-1/2 -translate-x-1/2 sm:relative sm:left-0 sm:translate-x-0 sm:ml-auto sm:mr-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 h-8 sm:h-10 backdrop-blur-md transition-all">
              <button
                onClick={() => setLang("in")}
                className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] transition-colors cursor-pointer ${
                  lang === "in"
                    ? "text-indigo-400"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                IN
              </button>

              <span className="mx-1.5 sm:mx-2 text-neutral-800 text-[8px] sm:text-[10px] select-none">
                |
              </span>

              <button
                onClick={() => setLang("en")}
                className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] transition-colors cursor-pointer ${
                  lang === "en"
                    ? "text-indigo-400"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Menu Wrapper - Ini yang menjaga posisi tetap presisi */}
          <div className="relative w-14 h-14">
            <motion.div
              initial="closed"
              animate={isMenuOpen ? "open" : "closed"}
              variants={menuVariants}
              className={`absolute top-0 right-0 border flex flex-col overflow-hidden ${
                isMenuOpen
                  ? "border-white/10 shadow-2xl backdrop-blur-3xl"
                  : "border-transparent"
              }`}
            >
              {/* Tombol Toggle yang posisinya terkunci di pojok kanan atas box */}
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

              {/* Isi Menu - Hanya muncul jika isMenuOpen true */}
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

      {/* --- MAIN HERO --- */}
      <main className="relative z-10 grow flex flex-col items-center justify-start sm:justify-center px-6 text-center pt-4 sm:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            {...pageTransition}
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
                    /* ... props initial, animate, whileTap tetap sama ... */
                    onMouseEnter={() => {
                      // hanya aktifkan hover di perangkat non-coarse (desktop)
                      if (!window.matchMedia("(pointer: coarse)").matches) {
                        setHoveredIndex(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!window.matchMedia("(pointer: coarse)").matches) {
                        setHoveredIndex(null);
                      }
                    }}
                    onClick={() => {
                      const isTouchDevice =
                        window.matchMedia("(pointer: coarse)").matches;

                      if (isTouchDevice) {
                        if (clickedIndex === index) {
                          // Tap kedua = konfirmasi navigasi
                          console.log("Navigasi ke:", item.title);
                        } else if (clickedIndex === null) {
                          // Tap pertama: buka (glass -> gradient)
                          setClickedIndex(index);
                        } else {
                          // Ada kartu lain aktif -> tutup (revert ke glass)
                          setClickedIndex(null);
                        }
                      } else {
                        // Desktop: klik pertama ubah ke gradient, klik lagi bisa konfirmasi
                        if (clickedIndex === index) {
                          console.log("Navigasi ke:", item.title);
                        } else {
                          setClickedIndex(index);
                        }
                      }
                    }}
                    style={{
                      height:
                        hoveredIndex === index || clickedIndex === index
                          ? "140px"
                          : "60px",
                      backgroundImage:
                        clickedIndex === index
                          ? "linear-gradient(135deg, #6366f1, #f43f5e, #06b6d4, #6366f1)"
                          : hoveredIndex === index
                            ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
                            : "rgba(255, 255, 255, 0.02)",
                      boxShadow:
                        clickedIndex === index
                          ? "0 0 60px 10px rgba(99, 102, 241, 0.6)"
                          : "none",
                      backgroundSize: "200% 200%",
                    }}
                    className={`relative backdrop-blur-3xl border rounded-4xl overflow-hidden cursor-pointer p-4 flex flex-col items-center justify-center transition-all duration-500 ${
                      clickedIndex === index
                        ? "animate-card-gradient border-white/50"
                        : "border-white/5"
                    }`}
                  >
                    <motion.span
                      className={`relative z-10 font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                        clickedIndex === index
                          ? "text-[12px] text-white"
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
                          <div
                            className={`w-10 h-[2px] mb-3 rounded-full ${clickedIndex === index ? "bg-white" : "bg-white/40"}`}
                          />

                          <p className="text-white font-bold text-[9px] leading-relaxed text-center px-2">
                            {item.description}
                          </p>

                          {/* PETUNJUK DINAMIS: Berubah sesuai pilihan bahasa */}
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

      {/* --- FOOTER --- */}
      <footer className="relative z-[100] w-full pb-8 pt-4 text-center shrink-0">
        <p className="text-neutral-700 text-[8px] tracking-[0.3em] uppercase font-bold">
          © {new Date().getFullYear()} Budapes Studio
        </p>
      </footer>
    </div>
  );
}
