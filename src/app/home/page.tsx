"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import SharedLoading from "@/lib/SharedLoading";
function LiquidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("paintWorklet" in CSS) {
      // @ts-ignore
      CSS.paintWorklet.addModule("/liquid-worklet.js");
    }

    let time = 0;
    let animationFrameId: number;
    let frame = 0; // throttle updates to reduce style writes

    const animate = () => {
      time += 0.0025;
      // only write CSS variable every other frame (~30fps on 60Hz)
      if (containerRef.current && frame % 2 === 0) {
        containerRef.current.style.setProperty("--fluid-time", time.toString());
      }
      frame++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={
        {
          background: "paint(liquid-background)",
          "--fluid-time": "0",
          filter: "contrast(1.3)",
          willChange: "background", // Optimasi GPU
        } as any
      }
    />
  );
}

// Memoized NavItem to avoid re-rendering all items when hover state changes
const NavItem = React.memo(function NavItem({
  item,
  index,
  lang,
  hoveredIndex,
  clickedIndex,
  setHoveredIndex,
  setClickedIndex,
  handleNavigation,
  confirmTap,
}: any) {
  const isActive = hoveredIndex === index || clickedIndex === index;

  const style = useMemo(
    () => ({
      height: isActive ? "140px" : "60px",
      willChange: "height, transform, opacity",
    }),
    [isActive],
  );

  const onMouseEnter = useCallback(() => {
    if (!window.matchMedia("(pointer: coarse)").matches)
      requestAnimationFrame(() => setHoveredIndex(index));
  }, [index, setHoveredIndex]);

  const onMouseLeave = useCallback(() => {
    requestAnimationFrame(() => setHoveredIndex(null));
  }, [setHoveredIndex]);

  const onClick = useCallback(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const targetHref = `${item.href.toLowerCase()}?lang=${lang}`;
    if (isTouchDevice) {
      if (clickedIndex === index) handleNavigation(targetHref);
      else setClickedIndex(index);
    } else {
      handleNavigation(targetHref);
    }
  }, [clickedIndex, handleNavigation, index, item.href, lang, setClickedIndex]);

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative border rounded-4xl overflow-hidden cursor-pointer p-4 flex flex-col items-center justify-center transition-all duration-500 transform-gpu
  ${isActive ? "bg-white border-white z-30 shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-transparent border-white/5 z-20"}`}
    >
      <motion.span
        className={`relative z-10 font-black tracking-[0.2em] uppercase transition-all duration-500 
        ${isActive ? "text-[12px] text-black" : "text-[9px] text-neutral-500"}`}
      >
        {item.title}
      </motion.span>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full flex flex-col items-center mt-2"
          >
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
                {confirmTap}
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lang, setLang] = useState<"in" | "en">("in");
  // State Transisi
  const [showLoading, setShowLoading] = useState(true); // Animasi Masuk
  const [isExiting, setIsExiting] = useState(false); // Animasi Keluar
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

  // throttle language change to next frame to avoid heavy synchronous re-renders
  const changeLanguage = (newLang: "in" | "en") => {
    requestAnimationFrame(() => {
      setLang(newLang);
      localStorage.setItem("user-lang", newLang);
    });
  };
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

  // Fungsi navigasi manual untuk menu items agar ada animasinya
  const handleNavigation = (url: string) => {
    setTargetUrl(url); // Mengisi targetUrl agar terbaca oleh SharedLoading di bawah
    setIsExiting(true); // Mulai animasi tirai
  };

  const menuVariants: Variants = {
    closed: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      clipPath: "circle(0% at calc(100% - 20px) 20px)",
      // Jangan ubah width/height terlalu drastis jika menggunakan clip-path
      width: isMobile ? "230px" : "280px", // Samakan dengan state open
      height: "40px",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        clipPath: { duration: 0.4 }, // Fokuskan kecepatan pada clipPath
      },
    },
    open: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      clipPath: "circle(150% at calc(100% - 20px) 20px)",
      width: isMobile ? "230px" : "280px",
      height: "auto",
      minHeight: isMobile ? "350px" : "450px",
      borderRadius: "24px",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        // Berikan sedikit jeda agar background muncul dulu baru konten
        when: "beforeChildren",
      },
    },
  };

  return (
    <>
      {/* 1. ANIMASI MASUK (REVERSE / MENGHAPUS) */}
      {/* Perbaikan: Hapus duplikasi, cukup satu AnimatePresence */}
      <AnimatePresence>
        {showLoading && (
          <SharedLoading
            reverse={true} // HARUS TRUE agar tirai menarik ke atas (membuka)
            onComplete={() => {
              setShowLoading(false); // Sembunyikan loading setelah terbuka
            }}
          />
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
          {/* Vignette Gelap (Tetap dipertahankan agar teks tajam) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_rgba(0,0,0,0.8)_100%)] opacity-100" />
        </div>

        {/* --- NAVBAR --- */}
        <nav className="relative z-[100] w-full flex justify-between items-center px-6 sm:px-12 py-8 shrink-0">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
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
            {/* Language Switcher Tetap Sama */}
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-9 sm:h-10 backdrop-blur-md">
              <motion.div
                className="absolute bg-white rounded-full h-[80%] my-auto"
                animate={{
                  x: lang === "in" ? 0 : isMobile ? 32 : 40,
                  width: isMobile ? "32px" : "40px",
                }}
                style={{ willChange: "transform, width" }}
              />
              <button
                onClick={() => changeLanguage("in")}
                className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold ${lang === "in" ? "text-black" : "text-neutral-500"}`}
              >
                ID
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold ${lang === "en" ? "text-black" : "text-neutral-500"}`}
              >
                EN
              </button>
            </div>

            {/* MENU TOGGLE AREA */}
            <div className="relative w-10 h-10">
              {/* 1. Panel Background Menu */}
              <motion.div
                initial="closed"
                animate={isMenuOpen ? "open" : "closed"}
                variants={menuVariants}
                className="absolute top-0 right-0 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
                style={{ willChange: "transform, opacity" }}
              >
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-14 px-8 pb-8 flex flex-col gap-2"
                    >
                      <div className="text-[9px] tracking-widest uppercase text-neutral-400 mb-4">
                        {t.menuLabel}
                      </div>
                      {t.extendedMenu.map((menu, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsMenuOpen(false); // Tutup menu dulu
                            handleNavigation(`${menu.href}?lang=${lang}`); // Pindah halaman
                          }}
                          className="text-left py-4 text-sm font-semibold text-neutral-600 border-b border-black/5"
                        >
                          {menu.label}
                        </button>
                      ))}
                      {/* TAMBAHKAN BLOK INI UNTUK MEMUNCULKAN CONTACT US */}
                      <div className="mt-6 pt-6 flex flex-col gap-3">
                        <p className="text-[10px] text-neutral-400 font-medium">
                          {t.helpText}
                        </p>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleNavigation(`/contact?lang=${lang}`); // Arahkan ke halaman kontak
                          }}
                          className="w-full bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl"
                        >
                          {t.ctaText}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 2. Tombol Hamburger (Ikon Garis) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center z-[110] focus:outline-none"
              >
                <AnimatePresence mode="wait">
                  {!isMenuOpen ? (
                    <motion.div
                      key="ham"
                      className="flex flex-col gap-[4px] items-end p-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Tiga Garis Presisi */}
                      <span className="h-[2px] w-6 bg-white rounded-full transition-all" />
                      <span className="h-[2px] w-4 bg-white rounded-full transition-all" />
                      <span className="h-[2px] w-5 bg-white rounded-full transition-all" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="close"
                      className="relative w-5 h-5 flex items-center justify-center"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                    >
                      {/* Simbol X yang simetris */}
                      <span className="absolute w-5 h-[2px] bg-black rounded-full rotate-45" />
                      <span className="absolute w-5 h-[2px] bg-black rounded-full -rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* --- MAIN --- */}
        <main className="relative z-10 grow flex flex-col items-center justify-start sm:justify-center px-6 text-center pt-4 sm:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

              <div className="relative w-full max-w-4xl mx-auto px-4 min-h-[140px] flex items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full">
                  {t.navItems.map((item, index) => (
                    <NavItem
                      key={`${lang}-${index}`}
                      item={item}
                      index={index}
                      lang={lang}
                      hoveredIndex={hoveredIndex}
                      clickedIndex={clickedIndex}
                      setHoveredIndex={setHoveredIndex}
                      setClickedIndex={setClickedIndex}
                      handleNavigation={handleNavigation}
                      confirmTap={t.confirmTap}
                    />
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
            <SharedLoading
              // reverse={false} (Defaultnya sudah false, jadi tirai akan menutup)
              onComplete={() => {
                router.push(targetUrl);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
