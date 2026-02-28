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
import ColorBends from "@/components/colorbends";
import Discography from "@/components/discography";
import SharedLoading from "@/lib/SharedLoading"; // <-- Import SharedLoading kembali

// Memoized NavItem
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

  const [lang, setLang] = useState<"id" | "en">("id");
  const [activeView, setActiveView] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // STATE BARU: Untuk Shared Loading saat pertama kali masuk ke Home
  const [showInitialLoading, setShowInitialLoading] = useState<boolean>(true);

  const content = {
    id: {
      hero: "BUDAPES",
      tagline: "Seni dalam Inovasi, Jiwa dalam Kreasi.",
      navItems: [
        {
          title: "Diskografi",
          href: "/discography",
          description: "Berani dalam harmoni, tajam dalam komposisi.",
        },
        {
          title: "Portofolio",
          href: "/portfolio",
          description: "Hanya untuk mereka yang tidak mengenal kompromi.",
        },
        {
          title: "Tentang kami",
          href: "/about-us",
          description: "Menyatukan presisi digital dengan intuisi manusia.",
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
          description: "Bold in harmony, sharp in composition.",
        },
        {
          title: "Portfolio",
          href: "/portfolio",
          description: "Reserved for the uncompromising.",
        },
        {
          title: "About us",
          href: "/about-us",
          description: "Fusing digital precision with human intuition.",
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
    setIsMobile(window.innerWidth <= 768);
    const savedLang = localStorage.getItem("user-lang");
    if (savedLang === "id" || savedLang === "en") setLang(savedLang);
  }, []);

  const changeLanguage = (newLang: "id" | "en") => {
    requestAnimationFrame(() => {
      setLang(newLang);
      localStorage.setItem("user-lang", newLang);
    });
  };

  useEffect(() => {
    if (isMenuOpen || activeView) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMenuOpen, activeView]);

  const handleNavigation = (url: string) => {
    setHoveredIndex(null);
    setClickedIndex(null);
    setTimeout(() => {
      if (url.includes("discography")) setActiveView("discography");
      else if (url.includes("portfolio")) setActiveView("portfolio");
      else if (url.includes("about-us")) setActiveView("about-us");
    }, 350);
  };

  const menuVariants: Variants = {
    closed: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      clipPath: "circle(0% at calc(100% - 20px) 20px)",
      width: isMobile ? "230px" : "280px",
      height: "40px",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        clipPath: { duration: 0.4 },
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
        when: "beforeChildren",
      },
    },
  };

  return (
    <div
      // Matikan pointer-events saat loading agar user tidak klik sembarangan saat animasi pembuka berjalan
      className={`h-screen w-full bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative flex flex-col ${showInitialLoading ? "pointer-events-none" : "pointer-events-auto"}`}
    >
      {/* --- ANIMASI SHARED LOADING (HANYA MUNCUL SEKALI SAAT MASUK) --- */}
      <AnimatePresence>
        {showInitialLoading && (
          <SharedLoading
            reverse={true}
            onComplete={() => setShowInitialLoading(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-auto">
        <ColorBends
          colors={["#3c3939", "#1a1a1a", "#050505"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.8}
          noise={0.1}
          transparent
          autoRotate={0}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_rgba(5,5,5,0.95)_100%)] pointer-events-none" />
      </div>

      <nav
        className={`relative z-[100] w-full flex justify-between items-center px-6 sm:px-12 py-8 shrink-0 pointer-events-none transition-all duration-700 ease-in-out ${isMusicPlaying ? "opacity-0 -translate-y-10" : "opacity-100 translate-y-0"}`}
      >
        <div className="w-16 h-16 flex items-center justify-center overflow-hidden pointer-events-auto">
          <video
            src="/logo-transparan.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <motion.div
            layout
            className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-9 sm:h-10 backdrop-blur-md"
          >
            <motion.div
              className="absolute bg-white rounded-full h-[80%] my-auto"
              animate={{
                x: lang === "id" ? 0 : isMobile ? 32 : 40,
                width: isMobile ? "32px" : "40px",
              }}
              style={{ willChange: "transform, width" }}
            />
            <button
              onClick={() => changeLanguage("id")}
              className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold ${lang === "id" ? "text-black" : "text-neutral-500"}`}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`relative z-10 w-8 sm:w-10 text-[9px] font-bold ${lang === "en" ? "text-black" : "text-neutral-500"}`}
            >
              EN
            </button>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {!activeView && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative w-10 h-10"
              >
                <motion.div
                  initial="closed"
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={menuVariants}
                  className="absolute top-0 right-0 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
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
                              setIsMenuOpen(false);
                              // Handle menu links di sini (jika ingin dipisah jadi komponen juga bisa)
                            }}
                            className="text-left py-4 text-sm font-semibold text-neutral-600 border-b border-black/5 hover:text-black transition-colors"
                          >
                            {menu.label}
                          </button>
                        ))}
                        <div className="mt-6 pt-6 flex flex-col gap-3">
                          <p className="text-[10px] text-neutral-400 font-medium">
                            {t.helpText}
                          </p>
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                            }}
                            className="w-full bg-black text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-800 transition-colors"
                          >
                            {t.ctaText}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center z-[110] focus:outline-none"
                >
                  <AnimatePresence mode="wait">
                    {!isMenuOpen ? (
                      <motion.div
                        key="ham"
                        className="flex flex-col gap-[4px] items-end p-1"
                        exit={{ opacity: 0 }}
                      >
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
                        <span className="absolute w-5 h-[2px] bg-black rounded-full rotate-45" />
                        <span className="absolute w-5 h-[2px] bg-black rounded-full -rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="relative z-50 grow flex flex-col items-center justify-start px-6 text-center pt-[5vh] sm:pt-[10vh] pointer-events-none">
        <div className="relative z-50 w-full pointer-events-auto">
          <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-black leading-tight sm:leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {t.hero}
          </h1>
        </div>

        <div className="relative w-full mt-1 sm:mt-3 pointer-events-auto">
          <AnimatePresence mode="wait">
            {!activeView && (
              <motion.div
                key={`content-${lang}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="max-w-full w-full mx-auto flex flex-col items-center"
              >
                <motion.p className="text-neutral-600 font-bold tracking-[0.4em] uppercase text-[8px] md:text-xs mb-4 sm:mb-10">
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
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {!activeView && (
          <motion.footer
            exit={{ opacity: 0, y: 20 }}
            className="relative z-[100] w-full pb-8 pt-4 text-center shrink-0 pointer-events-none"
          >
            <p className="text-neutral-700 text-[8px] tracking-[0.3em] uppercase font-bold">
              © {new Date().getFullYear()} Budapes Studio
            </p>
          </motion.footer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeView && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/5 backdrop-blur-sm overflow-hidden"
          >
            {activeView === "discography" && (
              <Discography
                lang={lang}
                onPlayStateChange={setIsMusicPlaying}
                onClose={() => {
                  setActiveView(null);
                  setIsMusicPlaying(false);
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
