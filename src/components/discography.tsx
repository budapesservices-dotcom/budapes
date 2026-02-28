"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronsDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  Pause,
  SkipBack,
  SkipForward,
  FileText,
  X,
  Info,
  Shuffle,
  Repeat,
  Repeat1,
  RotateCcw,
} from "lucide-react";

const parseLRC = (lrcText: string) => {
  const lines = lrcText.split("\n");
  const lyrics = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const totalSeconds =
        minutes * 60 + seconds + (ms > 99 ? ms / 1000 : ms / 100);
      const text = line.replace(timeRegex, "").trim();
      if (text) lyrics.push({ time: totalSeconds, text });
    }
  }
  return lyrics;
};

const imagesPage2 = [
  {
    url: "/manggaring-katresnan.jpg",
    title: "MANGGARING KATRESNAN",
    titleEn: "MANGGARING KATRESNAN",
    lrcUrl: "/manggaring-katresnan.lrc",
    songUrl: "/manggaring-katresnan.mp3",
    year: "2024",
    genre: "Pop Traditional",
    bgColor: "#FADBD3",
    textColor: "#583936",
  },
  {
    url: "/merindu.jpg",
    title: "MERINDU",
    titleEn: "MERINDU",
    lrcUrl: "/merindu.lrc",
    songUrl: "/merindu.mp3",
    year: "2024",
    genre: "Pop Rock",
    bgColor: "#F494A4",
    textColor: "#C5FED3",
  },
  {
    url: "/wijoyo-kusumo.jpg",
    title: "WIJOYO KUSUMO",
    titleEn: "WIJOYO KUSUMO",
    lrcUrl: "/wijaya-kusuma.lrc",
    songUrl: "/wijaya-kusuma.mp3",
    year: "2024",
    genre: "Pop rock, World",
    bgColor: "#242424",
    textColor: "#E61B1E",
  },
  {
    url: "/biru.jpg",
    title: "BIRU",
    titleEn: "BIRU",
    lrcUrl: "/biru.lrc",
    songUrl: "/biru.mp3",
    year: "2024",
    genre: "Pop, Country",
    bgColor: "#2E1C13",
    textColor: "#E7A146",
  },
  {
    url: "/tirai.jpg",
    title: "TIRAI",
    titleEn: "TIRAI",
    lrcUrl: "/tirai.lrc",
    songUrl: "/tirai.mp3",
    year: "2024",
    genre: "Pop, Ballad",
    bgColor: "#2E894C",
    textColor: "#F9A090",
  },
  {
    url: "/wanita-sejatiku.jpg",
    title: "WANITA SEJATIKU",
    titleEn: "WANITA SEJATIKU",
    lrcUrl: "/wanita-sejatiku.lrc",
    songUrl: "/wanita-sejatiku.mp3",
    year: "2024",
    genre: "Alternative, Rock",
    bgColor: "#110328",
    textColor: "#E8E8FD",
  },
  {
    url: "/sandyakala.jpg",
    title: "SANDYAKALA",
    titleEn: "SANDYAKALA",
    lrcUrl: "/sandyakala.lrc",
    songUrl: "/sandyakala.mp3",
    year: "2024",
    genre: "Pop, Country",
    bgColor: "#110604",
    textColor: "#B94846",
  },
  {
    url: "/kosong.jpg",
    title: "KOSONG",
    titleEn: "KOSONG",
    lrcUrl: "/kosong.lrc",
    songUrl: "/kosong.mp3",
    year: "2025",
    genre: "Rock, Alternative",
    bgColor: "#C1BDBC",
    textColor: "#4E4848",
  },
  {
    url: "/ngopi.jpg",
    title: "NGOPI",
    titleEn: "NGOPI",
    lrcUrl: "/ngopi.lrc",
    songUrl: "/ngopi.mp3",
    year: "2025",
    genre: "Reggae, Pop",
    bgColor: "#555320",
    textColor: "#DADADA",
  },
  {
    url: "/fenomena-jokowi.jpg",
    title: "FENOMENA JOKOWI",
    titleEn: "FENOMENA JOKOWI",
    lrcUrl: "/fenomena-jokowi.lrc",
    songUrl: "/fenomena-jokowi.mp3",
    year: "2025",
    genre: "Electronic, Dupstep",
    bgColor: "#050505",
    textColor: "#ef4444",
  },
  {
    url: "/dua-kekuatan.jpg",
    title: "DUA KEKUATAN",
    titleEn: "DUA KEKUATAN",
    lrcUrl: "/dua-kekuatan.lrc",
    songUrl: "/dua-kekuatan.mp3",
    year: "2025",
    genre: "House, Dupstep",
    bgColor: "#6B8894",
    textColor: "#E3D588",
  },
  {
    url: "/mahligai-yang-retak.jpg",
    title: "MAHLIGAI YANG RETAK",
    titleEn: "MAHLIGAI YANG RETAK",
    lrcUrl: "/mahligai-yang-retak.lrc",
    songUrl: "/mahligai-yang-retak.mp3",
    year: "2025",
    genre: "Pop, Melayu",
    bgColor: "#050505",
    textColor: "#ef4444",
  },
  {
    url: "/mahligai-yang-retak-acoustic.jpg",
    title: "MAHLIGAI YANG RETAK (ACOUSTIC)",
    titleEn: "MAHLIGAI YANG RETAK (ACOUSTIC)",
    lrcUrl: "/mahligai-yang-retak-acoustic.lrc",
    songUrl: "/mahligai-yang-retak-acoustic.mp3",
    year: "2025",
    genre: "Acoustic, Melayu",
    bgColor: "#CCCCCC",
    textColor: "#121212",
  },
  {
    url: "/tak-ingin-ku-jauh.jpg",
    title: "TAK INGIN KU JAUH",
    titleEn: "TAK INGIN KU JAUH",
    lrcUrl: "/tak-ingin-ku-jauh.lrc",
    songUrl: "/tak-ingin-ku-jauh.mp3",
    year: "2025",
    genre: "Alternative, Rock",
    bgColor: "#B2B29B",
    textColor: "#FFFFDD",
  },
  {
    url: "/pengembara-dimensi.jpg",
    title: "PENGEMBARA DIMENSI",
    titleEn: "PENGEMBARA DIMENSI",
    lrcUrl: "/pengembara-dimensi.lrc",
    songUrl: "/pengembara-dimensi.mp3",
    year: "2025",
    genre: "Pop, Electronic",
    bgColor: "#CAC6BF",
    textColor: "#272520",
  },
  {
    url: "/lukisan-dara.jpg",
    title: "LUKISAN DARA",
    titleEn: "LUKISAN DARA",
    lrcUrl: "/lukisan-dara.lrc",
    songUrl: "/lukisan-dara.mp3",
    year: "2025",
    genre: "Pop, Rock",
    bgColor: "#EFE4BE",
    textColor: "#141212",
  },
];

const translationsPage2 = {
  id: {
    playNow: "PUTAR SEKARANG",
    portfolio: "PORTOFOLIO",
    about: "TENTANG KAMI",
    support: "DUKUNGAN",
    contact: "HUBUNGI KAMI",
    back: "KEMBALI",
    lyrics: "LIRIK",
    nowPlaying: "SEDANG DIPUTAR",
    releaseYear: "TAHUN RILIS",
    genre: "GENRE",
    description: "TENTANG LAGU",
  },
  en: {
    playNow: "PLAY NOW",
    portfolio: "PORTFOLIO",
    about: "ABOUT US",
    support: "SUPPORT",
    contact: "CONTACT US",
    back: "BACK",
    lyrics: "LYRICS",
    nowPlaying: "NOW PLAYING",
    releaseYear: "RELEASE YEAR",
    genre: "GENRE",
    description: "ABOUT THE SONG",
  },
};

const ANIM_DURATION = 1000;
const ANIM_BEZIER = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const ANIM_CSS = `${ANIM_DURATION}ms ${ANIM_BEZIER}`;

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

// ==========================================
// 2. DISCOGRAPHY REUSABLE COMPONENT
// ==========================================

export default function Discography({
  onClose,
  lang,
  onPlayStateChange,
}: {
  onClose?: () => void;
  lang: "id" | "en";
  onPlayStateChange?: (isPlaying: boolean) => void;
}) {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [showLyrics, setShowLyrics] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [slideDir, setSlideDir] = useState("next");

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<any[]>([]);

  const scrollData = useRef({ current: 0, target: 0, ease: 0.08 });
  const [staticScroll, setStaticScroll] = useState(0);

  const contentWidthRef = useRef(0);
  const windowWidthRef = useRef(0);
  const [currentLyrics, setCurrentLyrics] = useState<any[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"all" | "one">("all");

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  useEffect(() => {
    if (activeItem !== null) {
      const songData = imagesPage2[activeItem.index];
      fetch(songData.lrcUrl)
        .then((res) => res.text())
        .then((text) => setCurrentLyrics(parseLRC(text)))
        .catch((err) => console.error("Gagal memuat lirik:", err));
    }
  }, [activeItem]);

  useEffect(() => {
    const updateDimensions = () => {
      windowWidthRef.current = window.innerWidth;
      if (containerRef.current)
        contentWidthRef.current = containerRef.current.scrollWidth;
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const handleWheel = (e: any) => {
      if (activeItem !== null || isTransitioning || isPlaying) return;
      const delta = e.deltaY || e.deltaX;
      scrollData.current.target += delta;

      const maxScroll = contentWidthRef.current - windowWidthRef.current;
      scrollData.current.target = Math.max(
        0,
        Math.min(scrollData.current.target, maxScroll > 0 ? maxScroll : 0),
      );
    };
    window.addEventListener("wheel", handleWheel, { passive: true });

    let animationFrameId: number;
    const animate = () => {
      if (!isExpanded && !activeItem && !isTransitioning) {
        scrollData.current.current = lerp(
          scrollData.current.current,
          scrollData.current.target,
          scrollData.current.ease,
        );

        const velocity = scrollData.current.target - scrollData.current.current;
        const skewEffect = velocity * 0.05;
        const clampedSkew = Math.max(-5, Math.min(skewEffect, 5));

        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = `translate3d(${-scrollData.current.current}px, 0, 0) skewX(${clampedSkew}deg)`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeItem, isTransitioning, isExpanded, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isSongPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.log("Auto-play diblokir atau error:", e);
            setIsSongPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isSongPlaying, activeItem?.index]);

  useEffect(() => {
    if (!isPlaying) {
      setIsSongPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setShowLyrics(false);
      setCurrentLyricIndex(0);
      setIsFlipped(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      const progressPercent = (current / total) * 100;

      setProgress(progressPercent || 0);
      setCurrentTime(formatTime(current));
      setDuration(formatTime(total));

      const activeIndex = currentLyrics.findLastIndex(
        (l: any) => l.time <= current,
      );

      if (activeIndex !== -1 && activeIndex !== currentLyricIndex) {
        setCurrentLyricIndex(activeIndex);
      }
    }
  };

  // ----------------------------------------------------------------------
  // PERBAIKAN BUG BOUNCING SCROLL DI SINI:
  // Menggunakan kalkulasi targetScroll manual agar browser tidak
  // menarik (scroll) halaman utama yang ada di baliknya.
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeElement = container.children[
        currentLyricIndex
      ] as HTMLElement;

      if (activeElement) {
        const targetScroll =
          activeElement.offsetTop -
          container.clientHeight / 2 +
          activeElement.clientHeight / 2;

        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [currentLyricIndex, showLyrics]);

  const handleAudioEnded = () => {
    if (!activeItem) return;

    let nextIndex: number;

    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.log("Playback error:", e));
      }
      setIsSongPlaying(true);
      setCurrentLyricIndex(0);
      if (lyricsContainerRef.current) {
        lyricsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    } else if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * imagesPage2.length);
      } while (nextIndex === activeItem.index && imagesPage2.length > 1);
    } else {
      nextIndex = (activeItem.index + 1) % imagesPage2.length;
    }

    setPrevIndex(activeItem.index);
    setSlideDir("next");
    setProgress(0);
    setCurrentTime("0:00");
    setCurrentLyricIndex(0);

    const viewportWidth = window.innerWidth;
    const itemEl = itemRefs.current[nextIndex];
    if (itemEl) {
      const itemWidth = itemEl.offsetWidth;
      const itemCenterInContent = itemEl.offsetLeft + itemWidth / 2;
      const targetScrollPos = itemCenterInContent - viewportWidth / 2;
      setStaticScroll(targetScrollPos);
      scrollData.current.target = targetScrollPos;
      scrollData.current.current = targetScrollPos;
    }

    setActiveItem((prev: any) => ({ ...prev, index: nextIndex }));
    setIsSongPlaying(true);
  };

  useEffect(() => {
    const handleGlobalMove = (e: any) => {
      if (!isDragging || !progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setProgress(percentage);
    };

    const handleGlobalUp = () => {
      if (isDragging && audioRef.current) {
        if (isFinite(audioRef.current.duration)) {
          const newTime = (progress / 100) * audioRef.current.duration;

          if (isFinite(newTime)) {
            audioRef.current.currentTime = newTime;
          }
        }
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("pointermove", handleGlobalMove);
      window.addEventListener("pointerup", handleGlobalUp);
    }

    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
    };
  }, [isDragging, progress]);

  const handleImageClick = (index: number, e: any) => {
    if (isExpanded || isTransitioning || isPlaying) return;
    setIsMenuOpen(false);
    setIsTransitioning(true);
    setSlideDir("next");
    setPrevIndex(null);

    const viewportWidth = window.innerWidth;
    const itemEl = itemRefs.current[index];
    const itemWidth = itemEl.offsetWidth;
    const itemCenterInContent = itemEl.offsetLeft + itemWidth / 2;
    const targetScrollPos = itemCenterInContent - viewportWidth / 2;

    setStaticScroll(targetScrollPos);
    scrollData.current.target = targetScrollPos;
    scrollData.current.current = targetScrollPos;

    const rect = e.currentTarget.getBoundingClientRect();
    setActiveItem({ index, rect });

    setTimeout(() => {
      setIsExpanded(true);
      setTimeout(() => setIsTransitioning(false), ANIM_DURATION);
    }, 20);
  };

  const handleNavigate = (direction: string, e: any) => {
    e.stopPropagation();
    if (isTransitioning || !activeItem) return;

    setIsFlipped(false);

    if (
      isPlaying &&
      direction === "prev" &&
      audioRef.current &&
      audioRef.current.currentTime > 2
    ) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentLyricIndex(0);
      return;
    }

    if (isPlaying) {
      setIsSongPlaying(true);
    }

    if (activeItem) {
      setPrevIndex(activeItem.index);
    }

    setProgress(0);
    setCurrentTime("0:00");
    setCurrentLyricIndex(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }

    if (direction === "next") {
      setSlideDir("next");
    } else {
      setSlideDir("prev");
    }

    const currentIndex = activeItem.index;
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % imagesPage2.length
        : (currentIndex - 1 + imagesPage2.length) % imagesPage2.length;

    const viewportWidth = window.innerWidth;
    const itemEl = itemRefs.current[newIndex];
    const itemWidth = itemEl.offsetWidth;
    const itemCenterInContent = itemEl.offsetLeft + itemWidth / 2;

    const targetScrollPos = itemCenterInContent - viewportWidth / 2;

    setStaticScroll(targetScrollPos);
    scrollData.current.target = targetScrollPos;
    scrollData.current.current = targetScrollPos;

    setActiveItem((prev: any) => ({ ...prev, index: newIndex }));
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    if (isTransitioning || !activeItem || isPlaying) return;

    setIsTransitioning(true);
    setPrevIndex(null);
    setShowLyrics(false);
    setIsFlipped(false);

    const placeholder = itemRefs.current[activeItem.index];
    if (placeholder) {
      const currentRect = placeholder.getBoundingClientRect();
      setActiveItem((prev: any) => ({ ...prev, rect: currentRect }));
    }

    const maxScroll = contentWidthRef.current - windowWidthRef.current;
    const validScroll = Math.max(
      0,
      Math.min(scrollData.current.target, maxScroll > 0 ? maxScroll : 0),
    );
    scrollData.current.target = validScroll;

    requestAnimationFrame(() => {
      setIsExpanded(false);
      setTimeout(() => {
        setActiveItem(null);
        setIsTransitioning(false);
      }, ANIM_DURATION);
    });
  };

  const handlePlay = (e: any) => {
    e.stopPropagation();
    setIsPlaying(true);
    setIsSongPlaying(true);
  };

  const handleCoverClick = (e: any) => {
    e.stopPropagation();
    if (isPlaying) {
      setIsFlipped(!isFlipped);
    } else {
      handleClose(e);
    }
  };

  return (
    <div
      className="relative w-full h-screen font-sans overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor:
          activeItem && isExpanded
            ? imagesPage2[activeItem.index].bgColor
            : "transparent",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Mencegah klik menyebar ke elemen bawahnya
          if (activeItem !== null && !isPlaying) {
            handleClose(e);
          } else if (!activeItem) {
            if (onClose) onClose();
          }
        }}
        className={`fixed top-12 left-1/2 -translate-x-1/2 z-[120] flex flex-col items-center gap-2 group transition-all duration-700 ${isPlaying ? "opacity-0 pointer-events-none translate-y-[-20px]" : "opacity-100 pointer-events-auto translate-y-0"}`}
      >
        <span className="text-[9px] md:text-[11px] font-black tracking-[0.6em] text-white/50 group-hover:text-white uppercase transition-colors duration-500 text-center">
          {activeItem !== null && !isPlaying
            ? lang === "id"
              ? "Kembali ke Daftar"
              : "Back to List"
            : lang === "id"
              ? "Tutup Arsip"
              : "Close Archive"}
        </span>
        <div className="w-1 h-[2px] bg-[#f59e0b]/50 group-hover:w-16 group-hover:bg-[#f59e0b] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" />
      </button>

      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap'); 
        .font-display { font-family: 'Oswald', sans-serif; }
        
        @keyframes revealCharRight {
            0% { transform: translateX(100%); }
            100% { transform: translateX(0%); }
        }
        @keyframes revealCharLeft {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
        }
        @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        @keyframes pulse-only-scale {
           0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        @keyframes slideImageNext {
            0% { transform: translateX(60%) scale(0.8) rotate(8deg); opacity: 0; filter: blur(8px); }
            100% { transform: translateX(0) scale(1) rotate(0); opacity: 1; filter: blur(0); }
        }
        @keyframes slideImagePrev {
            0% { transform: translateX(-60%) scale(0.8) rotate(-8deg); opacity: 0; filter: blur(8px); }
            100% { transform: translateX(0) scale(1) rotate(0); opacity: 1; filter: blur(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-gradient {
          mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        `}
      </style>

      <audio
        ref={audioRef}
        src={activeItem ? imagesPage2[activeItem.index].songUrl : undefined}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* --- TOMBOL KEMBALI (CLOSE DETAIL) --- */}
      {activeItem !== null && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(false);
          }}
          className={`fixed top-8 left-8 z-[70] flex items-center gap-3 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group ${isPlaying ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-10 pointer-events-none"}`}
          style={{ color: imagesPage2[activeItem.index].textColor }}
        >
          <div className="p-2 rounded-full border border-current group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </div>
          <span className="font-display font-bold tracking-widest text-sm">
            {translationsPage2[lang].back}
          </span>
        </button>
      )}

      {/* --- TOMBOL LIRIK --- */}
      {activeItem !== null && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Mencegah klik bubling
            setShowLyrics(!showLyrics);
          }}
          className={`fixed right-8 top-1/2 -translate-y-1/2 z-[70] flex flex-col items-center gap-4 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group ${isPlaying ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-10 pointer-events-none"}`}
          style={{ color: imagesPage2[activeItem.index].textColor }}
        >
          <span
            className="font-display font-bold tracking-widest text-xs md:text-sm"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {translationsPage2[lang].lyrics}
          </span>
          <div className="p-2 md:p-3 rounded-full border border-current group-hover:bg-white/10 transition-colors">
            <FileText size={20} />
          </div>
        </button>
      )}

      {/* --- OVERLAY LIRIK --- */}
      <AnimatePresence>
        {showLyrics && activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowLyrics(false);
              }}
              className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[400px] z-[150] bg-zinc-950/95 border-l border-white/10 shadow-2xl flex flex-col p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLyrics(false);
                }}
                className="self-end text-white/50 hover:text-white transition-colors mb-10"
              >
                <X size={32} />
              </button>

              <div className="mb-8">
                <p className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-2">
                  {translationsPage2[lang].nowPlaying}
                </p>
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-tighter">
                  {lang === "id"
                    ? imagesPage2[activeItem.index].title
                    : imagesPage2[activeItem.index].titleEn}
                </h3>
              </div>

              <div className="relative w-full flex-1 mask-gradient overflow-hidden">
                <div
                  ref={lyricsContainerRef}
                  className="absolute inset-0 w-full overflow-y-auto scrollbar-hide py-[20vh] flex flex-col items-start gap-10"
                >
                  {currentLyrics.map((lyric, index) => {
                    const isActive = index === currentLyricIndex;
                    return (
                      <p
                        key={index}
                        className={`transition-all duration-700 ease-out cursor-pointer font-display tracking-wider text-left leading-relaxed px-4 will-change-transform ${
                          isActive
                            ? "text-white text-3xl scale-105 font-bold opacity-100"
                            : "text-white/20 text-lg scale-100 font-normal opacity-30 hover:opacity-50"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Mencegah loncatan klik
                          if (audioRef.current)
                            audioRef.current.currentTime = lyric.time;
                        }}
                      >
                        {lyric.text}
                      </p>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- KONTROL MUSIK --- */}
      {activeItem !== null && isPlaying && (
        <div
          className={`fixed bottom-12 left-0 w-full z-[70] flex flex-col items-center justify-center transition-[opacity,transform] duration-1000 delay-500 ${isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ color: imagesPage2[activeItem.index].textColor }}
        >
          <div className="flex items-center gap-6 md:gap-8 mb-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShuffle(!isShuffle);
              }}
              className={`p-2 transition-all ${isShuffle ? "text-amber-500 scale-110" : "text-current opacity-40 hover:opacity-100"}`}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={(e) => handleNavigate("prev", e)}
              className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-95 group"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSongPlaying(!isSongPlaying);
              }}
              className="p-3 rounded-full border border-current hover:bg-white/10 transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${isSongPlaying ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
                >
                  <Pause size={24} fill="currentColor" />
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${!isSongPlaying ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`}
                >
                  <Play size={24} fill="currentColor" className="ml-0.5" />
                </div>
              </div>
            </button>
            <button
              onClick={(e) => handleNavigate("next", e)}
              className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-95 group"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRepeatMode(repeatMode === "all" ? "one" : "all");
              }}
              className={`p-2 transition-all ${repeatMode === "one" ? "text-amber-500 scale-110" : "text-current opacity-40 hover:opacity-100"}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={20} />
              ) : (
                <Repeat size={20} />
              )}
            </button>
          </div>
          <div
            ref={progressBarRef}
            className="w-full max-w-[85vw] md:max-w-[60vw] h-8 relative flex items-center group cursor-pointer touch-none"
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
              if (!progressBarRef.current) return;
              const rect = progressBarRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const clickedProgress = Math.max(
                0,
                Math.min(100, (x / rect.width) * 100),
              );
              setProgress(clickedProgress);
            }}
          >
            <div className="w-full h-[2px] relative bg-current opacity-20 pointer-events-none">
              <div
                className="absolute top-0 left-0 h-full overflow-hidden ease-linear"
                style={{
                  width: `${progress}%`,
                  transition: isDragging ? "none" : "width 100ms linear",
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full w-[85vw] md:w-[60vw]"
                  style={{
                    backgroundColor: isSongPlaying
                      ? "transparent"
                      : "currentColor",
                    backgroundImage: isSongPlaying
                      ? `linear-gradient(90deg, currentColor 0%, white 50%, currentColor 100%)`
                      : "none",
                    backgroundSize: "200% 100%",
                    animation: isSongPlaying
                      ? "gradient-flow 2s infinite linear"
                      : "none",
                  }}
                />
              </div>
            </div>

            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                left: `${progress}%`,
                transition: isDragging ? "none" : "left 100ms linear",
              }}
            >
              <div
                className="w-3 h-3 bg-current rounded-full"
                style={{
                  animation: isSongPlaying
                    ? "pulse-only-scale 2s infinite ease-in-out"
                    : "none",
                  boxShadow: "0 0 10px currentColor",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- JUDUL KONTEN --- */}
      {activeItem !== null &&
        (() => {
          const currentImg = imagesPage2[activeItem.index];
          const activeTitle =
            lang === "id" ? currentImg.title : currentImg.titleEn;
          const len = activeTitle.length;

          let fontSizeClass = "text-[15vw] md:text-[5vw]";
          let topPos = "19vh";

          if (len > 10) {
            fontSizeClass = "text-[3.5vw] md:text-[4.5vw]";
            topPos = "20vh";
          }
          if (len > 15) {
            fontSizeClass = "text-[5.5vw] md:text-[3.5vw]";
            topPos = "21vh";
          }
          if (len > 18) {
            fontSizeClass = "text-[5.5vw] md:text-[3vw]";
            topPos = "23vh";
          }
          if (len > 20) {
            fontSizeClass = "text-[5.5vw] md:text-[2vw]";
            topPos = "18vh";
          }

          const animName =
            slideDir === "next" ? "revealCharRight" : "revealCharLeft";

          return (
            <div
              className={`fixed z-50 pointer-events-none transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                !isExpanded || isFlipped ? "opacity-0" : "opacity-100"
              }`}
              style={{
                top: isPlaying ? topPos : "8rem",
                left: isPlaying ? "50%" : "2rem",
                transform: isPlaying
                  ? isFlipped
                    ? "translate(-50%, -150%)"
                    : "translateX(-50%)"
                  : "translate(0, 0)",
              }}
            >
              <h2
                className={`${fontSizeClass} font-display font-bold tracking-[-0.05em] leading-[0.85] text-center origin-center`}
                style={{ color: currentImg.textColor }}
              >
                <div
                  key={activeItem.index}
                  className="flex flex-wrap items-center justify-center max-w-[85vw] md:max-w-[65vw] mx-auto gap-y-1"
                >
                  {activeTitle.split(" ").map((word, wordIdx) => (
                    <div key={wordIdx} className="flex whitespace-nowrap">
                      {word.split("").map((char, i) => (
                        <span
                          key={i}
                          className={`inline-block pb-[1vw] transition-all duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isPlaying ? "overflow-visible" : "overflow-hidden"}`}
                          style={{ margin: isPlaying ? "0 0.5vw" : "0 0.1vw" }}
                        >
                          <span
                            className="inline-block whitespace-pre will-change-transform"
                            style={{
                              animationName: !isPlaying ? animName : "none",
                              animationDuration: "1s",
                              animationFillMode: "forwards",
                              animationDelay: !isPlaying
                                ? `${(wordIdx * 5 + i) * 0.04}s`
                                : "0s",
                              transform: "none",
                              transitionProperty: "transform",
                              transitionDuration: "1.5s",
                              transitionTimingFunction:
                                "cubic-bezier(0.2, 0.8, 0.2, 1)",
                              transitionDelay: isPlaying
                                ? `${(wordIdx * 5 + i) * 0.05}s`
                                : "0s",
                            }}
                          >
                            {char}
                          </span>
                        </span>
                      ))}
                      <span className="inline-block">&nbsp;</span>
                    </div>
                  ))}
                </div>
              </h2>
            </div>
          );
        })()}

      {/* --- OVERLAY KARTU --- */}
      {activeItem !== null &&
        (() => {
          const currentImg = imagesPage2[activeItem.index];
          const boxSizeVal = isPlaying ? (isFlipped ? 42 : 40) : 55;
          const boxSize = `${boxSizeVal}vmin`;

          const expandedStyle = {
            top: `calc(50vh - ${boxSizeVal / 2}vmin)`,
            left: `calc(50vw - ${boxSizeVal / 2}vmin)`,
            width: boxSize,
            height: boxSize,
            boxShadow: isFlipped
              ? "0 50px 100px -20px rgba(0,0,0,0.9)"
              : "0 40px 80px -20px rgba(0, 0, 0, 0.8)",
          };
          const thumbnailStyle = {
            top: `${activeItem.rect.top}px`,
            height: `${activeItem.rect.height}px`,
            left: `${activeItem.rect.left}px`,
            width: `${activeItem.rect.width}px`,
            boxShadow: "none",
          };
          const finalStyle = isExpanded ? expandedStyle : thumbnailStyle;

          return (
            <div className="fixed inset-0 z-40 pointer-events-none perspective-1000">
              <div
                className={`fixed z-50 transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isPlaying ? "pointer-events-auto cursor-pointer" : "pointer-events-auto"}`}
                onClick={handleCoverClick}
                style={{
                  ...finalStyle,
                  transition: isPlaying
                    ? "all 1000ms cubic-bezier(0.2, 0.8, 0.2, 1)"
                    : `all ${ANIM_CSS}`,
                }}
              >
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${isFlipped ? "rotate-y-180" : ""}`}
                >
                  <div className="absolute inset-0 w-full h-full backface-hidden overflow-hidden">
                    {prevIndex !== null && (
                      <img
                        src={imagesPage2[prevIndex].url}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{
                          filter: isExpanded
                            ? "grayscale(0%)"
                            : "grayscale(100%)",
                        }}
                      />
                    )}
                    <img
                      key={activeItem.index}
                      src={currentImg.url}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      style={{
                        filter: isExpanded
                          ? "grayscale(0%)"
                          : "grayscale(100%)",
                        transition: "filter 1s ease",
                        animation: isPlaying
                          ? `${slideDir === "next" ? "slideImageNext" : "slideImagePrev"} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)`
                          : "none",
                      }}
                      onAnimationEnd={() => setPrevIndex(null)}
                    />
                    {isPlaying && (
                      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info size={20} />
                      </div>
                    )}
                  </div>
                  {/* --- SISI BELAKANG COVER (SONG INFO) --- */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-zinc-950 text-white p-4 border border-white/10 overflow-hidden shadow-2xl">
                    <div
                      className="w-full h-full bg-zinc-900/50 rounded-2xl border border-white/5 p-6 flex flex-col pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="shrink-0 text-center mb-6 relative">
                        <h3 className="text-xl md:text-2xl font-display font-bold tracking-tighter text-amber-500 uppercase leading-none mb-2">
                          {lang === "id"
                            ? currentImg.title
                            : currentImg.titleEn}
                        </h3>
                        <div className="w-8 h-[1px] bg-white/20 mx-auto"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFlipped(false);
                          }}
                          className="absolute -top-2 -right-2 p-2 text-white/20 hover:text-white transition-colors"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6 pr-1 touch-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[8px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">
                              {translationsPage2[lang].releaseYear}
                            </p>
                            <p className="text-sm font-display font-bold">
                              {currentImg.year}
                            </p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <p className="text-[8px] font-bold tracking-[0.2em] text-white/40 uppercase mb-1">
                              {translationsPage2[lang].genre}
                            </p>
                            <p className="text-sm font-display font-bold truncate">
                              {currentImg.genre}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 text-left">
                          <p className="text-[8px] font-bold tracking-[0.2em] text-amber-500/50 uppercase">
                            {translationsPage2[lang].description}
                          </p>
                          <p className="text-xs leading-relaxed text-white/60 font-medium">
                            {lang === "id"
                              ? `Lagu ini merupakan eksplorasi mendalam dari Budapes Studio yang menggabungkan elemen ${currentImg.genre} dengan narasi puitis yang kuat. Aransemen ini dirancang untuk membawa pendengar ke dalam atmosfer dimensi yang berbeda, sejalan dengan visi artistik album tahun ${currentImg.year}.`
                              : `This song is a profound exploration by Budapes Studio, combining ${currentImg.genre} elements with a strong poetic narrative. The arrangement is designed to transport listeners into a different dimensional atmosphere, aligning with the artistic vision of the ${currentImg.year} album.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`fixed inset-0 z-50 pointer-events-none transition-all duration-500 ${isExpanded && !isPlaying ? "opacity-100" : "opacity-0"}`}
              >
                <button
                  onClick={(e) => handleNavigate("prev", e)}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-6 pointer-events-auto hover:scale-110 transition-transform"
                  style={{ color: currentImg.textColor }}
                >
                  <ChevronLeft size={64} strokeWidth={1} />
                </button>
                <button
                  onClick={(e) => handleNavigate("next", e)}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-6 pointer-events-auto hover:scale-110 transition-transform"
                  style={{ color: currentImg.textColor }}
                >
                  <ChevronRight size={64} strokeWidth={1} />
                </button>
              </div>
              <div
                className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 delay-500 ${isExpanded && !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <button
                  onClick={handlePlay}
                  className="flex flex-col items-center gap-2 group pointer-events-auto"
                  style={{ color: currentImg.textColor }}
                >
                  <span className="text-xs font-bold tracking-widest border-b border-current pb-1 uppercase tracking-[0.2em]">
                    {translationsPage2[lang].playNow}
                  </span>
                  <div className="animate-bounce mt-1">
                    <ChevronsDown size={24} />
                  </div>
                </button>
              </div>
            </div>
          );
        })()}

      <div
        className={`relative w-full h-full transition-all duration-[1500ms] ease-[cubic-bezier(0.6,0,0.2,1)] ${isPlaying ? "-translate-y-[120%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
      >
        <main className="absolute top-0 left-0 h-full w-full flex items-center z-10">
          <div
            ref={containerRef}
            className="flex gap-6 md:gap-8 px-20 md:px-[25vw] h-[50vh] md:h-[60vh] items-center will-change-transform"
            style={{
              transition:
                isExpanded || isTransitioning
                  ? `transform ${ANIM_CSS}`
                  : "none",
              transform:
                isExpanded || isTransitioning
                  ? `translate3d(${-staticScroll}px, 0, 0)`
                  : undefined,
            }}
          >
            {imagesPage2.map((item, index) => {
              const isTargetPlaceholder = activeItem?.index === index;
              const opacityClass =
                activeItem && isTargetPlaceholder
                  ? "opacity-0"
                  : isExpanded
                    ? "opacity-30 blur-[2px] grayscale"
                    : "opacity-100 grayscale hover:grayscale-0";

              const transitionStyle = activeItem
                ? `all ${ANIM_CSS}`
                : `all ${ANIM_CSS}, opacity 0s`;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onClick={(e) => !isExpanded && handleImageClick(index, e)}
                  style={{
                    transition: transitionStyle,
                    transform: isExpanded
                      ? activeItem && index < activeItem.index
                        ? "translateX(-20vw)"
                        : activeItem && index > activeItem.index
                          ? "translateX(20vw)"
                          : "translateX(0)"
                      : "translateX(0)",
                  }}
                  className={`group relative overflow-hidden w-[20vh] md:w-[30vh] h-full flex-shrink-0 cursor-pointer ${opacityClass}`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
