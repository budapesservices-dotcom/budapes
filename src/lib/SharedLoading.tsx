import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

type Props = {
  reverse?: boolean;
  onComplete?: () => void;
};

export default function SharedLoading({ reverse = false, onComplete }: Props) {
  const containerRef = useRef(null);
  const copyrightSymbolRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

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

      if (reverse) {
        // --- MODE REVERSE (Menghapus) ---
        // Mulai dengan kondisi normal (baseFrequency 0)
        gsap.set("#liquid-filter feTurbulence", {
          attr: { baseFrequency: "0.00" },
        });
        gsap.set(".word-path", { strokeDasharray: 1000, strokeDashoffset: 0 });

        tl.to(copyrightSymbolRef.current, {
          y: 10,
          duration: 0.1,
        })
          .to(copyrightSymbolRef.current, {
            y: -100,
            opacity: 0,
            duration: 0.6,
            ease: "back.in(1.7)",
            // Mulai gelombang tepat saat tulisan akan dihapus
            onStart: () => playWaveAndSmoothStop(1.2),
          })
          .to(
            ".word-path",
            {
              strokeDashoffset: 1000,
              duration: 1.5,
              stagger: { each: 0.1, from: "end" },
              ease: "power2.in",
            },
            "-=0.3",
          )
          .to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => onComplete?.(),
          });
      } else {
        // --- MODE NORMAL (Menggambar) ---
        gsap.set(".word-path", {
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
        });
        gsap.set(copyrightSymbolRef.current, { y: -150, opacity: 0 });
        // Pastikan mulai dari kondisi tenang
        gsap.set("#liquid-filter feTurbulence", {
          attr: { baseFrequency: "0.00" },
        });

        tl.to(".word-path", {
          strokeDashoffset: 0,
          duration: 2,
          stagger: 0.1,
          ease: "power2.inOut",
          onStart: () => playWaveAndSmoothStop(1.8), // Jalankan gejolak lalu tenang
        }).to(
          copyrightSymbolRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "bounce.out",
          },
          "-=0.2",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reverse, onComplete]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center"
    >
      {/* Kontainer relatif untuk membungkus SVG dan Copyright secara horizontal */}
      <div className="relative flex items-center">
        <svg
          viewBox="0 0 600 120"
          className="w-[300px] md:w-[600px]" // Menggunakan ukuran px agar lebih stabil
          style={{ filter: "url(#liquid-filter)" }}
        >
          <defs>
            <filter id="liquid-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="1" // <--- WAJIB: Ubah dari 2 menjadi 1
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
            y="75%" // Sedikit diturunkan agar sejajar tengah secara visual
            textAnchor="middle"
            className="word-path fill-none stroke-white font-black italic text-7xl md:text-8xl tracking-widest"
            style={{ strokeWidth: 1, strokeLinecap: "round" }}
          >
            BUDAPES
          </text>
        </svg>

        {/* COPYRIGHT di samping kanan */}
        <div
          ref={copyrightSymbolRef}
          className="text-2xl md:text-4xl text-amber-500 font-bold -ml-12 md:-ml-8 self-center"
        >
          ©
        </div>
      </div>
    </motion.div>
  );
}
