import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

type Props = {
  reverse?: boolean;
  isEntry?: boolean;
  onComplete?: () => void;
};

export default function SharedLoading({
  reverse = false,
  isEntry = false,
  onComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const copyrightSymbolRef = useRef<SVGTSpanElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const shouldOpen = reverse || isEntry;

      // Fungsi untuk memicu gelombang dan menghentikannya secara halus
      const playWaveAndSmoothStop = (dur: number) => {
        // 1. Mulai bergejolak
        gsap.to("#liquid-filter feTurbulence" as any, {
          attr: { baseFrequency: "0.02 0.05" },
          duration: dur * 0.5,
          ease: "sine.inOut",
          onComplete: () => {
            // 2. Kembalikan ke 0 secara halus (Smooth Stop)
            gsap.to("#liquid-filter feTurbulence" as any, {
              attr: { baseFrequency: "0.00 0.00" },
              duration: dur * 0.5,
              ease: "sine.inOut",
            });
          },
        });
      };

      if (shouldOpen) {
        // --- MODE REVERSE (Membuka Halaman Baru) ---
        tl.to(copyrightSymbolRef.current, {
          attr: { dy: -150 },
          opacity: 0,
          duration: 0.6,
          ease: "back.in(1.7)",
          onStart: () => playWaveAndSmoothStop(1.2),
        })
          .to(
            ".word-path",
            {
              strokeDashoffset: 1000,
              duration: 1.2,
              stagger: { each: 0.1, from: "end" },
              ease: "power2.in",
            },
            "-=0.3",
          )
          // AKHIR: Tarik seluruh tirai hitam ke ATAS layar
          .to(containerRef.current, {
            y: "100%",
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => onComplete?.(),
          });
      } else {
        // --- MODE NORMAL (Menutup Halaman Lama) ---
        // 1. Taruh tirai di bawah layar (y: 100%)
        gsap.set(containerRef.current, { y: "100%" });
        gsap.set(copyrightSymbolRef.current, {
          attr: { dy: -150 },
          opacity: 0,
        });

        // 2. Tarik tirai naik ke atas menutupi layar
        tl.to(containerRef.current, {
          y: "0%",
          duration: 0.8,
          ease: "power4.inOut", // Gantian dari [0.76, 0, 0.24, 1]
          onComplete: () => onComplete?.(),
        })
          // 3. Baru mulai gambar teks BUDAPES
          .to(".word-path", {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.inOut",
            onStart: () => playWaveAndSmoothStop(1.8),
          })
          .to(
            copyrightSymbolRef.current,
            {
              attr: { dy: -20 }, // Jatuh ke posisi ideal (-20 adalah posisi tengah yang diinginkan)
              opacity: 1,
              duration: 1.2,
              ease: "bounce.out", // Animasi bounce sekarang akan terlihat
            },
            "-=0.2",
          );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reverse, isEntry, onComplete]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      {/* Kontainer Utama dengan Flex-Col untuk Mobile, Flex-Row untuk Desktop */}
      <div className="relative flex flex-col md:flex-row items-center justify-center w-full">
        {/* SVG Container */}
        <div className="relative flex items-center justify-center w-full">
          <svg
            viewBox="0 0 600 120"
            className="w-[280px] sm:w-[400px] md:w-[600px] h-auto"
            style={{
              filter: "url(#liquid-filter)",
              overflow: "visible", // Tambahkan ini agar animasi dy tidak terpotong
            }}
          >
            <defs>
              <filter
                id="liquid-filter"
                x="-20%"
                y="-20%"
                width="140%"
                height="200%" // Dibuat lebih tinggi agar saat turun tidak terpotong
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.00"
                  numOctaves="1"
                  result="noise"
                  seed="2"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="20"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>

            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="word-path fill-none stroke-white font-black italic text-6xl sm:text-7xl md:text-8xl tracking-widest"
              style={{ strokeWidth: 1, strokeLinecap: "round" }}
            >
              BUDAPES
              {/* Logo Copyright sebagai bagian dari teks agar jaraknya konsisten */}
              <tspan
                ref={copyrightSymbolRef}
                dy="0" // Set awal ke 0 agar tidak terdorong sejak awal
                dx="10"
                className="fill-amber-500 stroke-none font-bold text-3xl md:text-5xl not-italic"
              >
                ©
              </tspan>
            </text>
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
