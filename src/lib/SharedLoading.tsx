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

      // Fungsi helper agar tidak nulis ulang kode gelombang
      const playWave = (dur: number) => {
        gsap.to("#liquid-filter feTurbulence" as any, {
          attr: { baseFrequency: "0.02 0.05" },
          duration: dur,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        });
      };

      if (reverse) {
        // --- MODE REVERSE (Menghapus) ---
        gsap.set(".word-path", { strokeDasharray: 1000, strokeDashoffset: 0 });

        tl.to(".word-path", {
          strokeDashoffset: 1000,
          duration: 1.5,
          stagger: { each: 0.1, from: "end" },
          ease: "power2.in",
          onStart: () => playWave(0.8), // Jalankan gelombang saat mulai menghapus
        }).to(containerRef.current, {
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

        tl.to(".word-path", {
          strokeDashoffset: 0,
          duration: 2,
          stagger: 0.1,
          ease: "power2.inOut",
          onStart: () => playWave(1.2), // Jalankan gelombang saat mulai menggambar
          onComplete: () => onComplete?.(),
        });
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
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 600 120"
          className="w-75 md:w-150"
          style={{ filter: "url(#liquid-filter)" }}
        >
          <defs>
            <filter id="liquid-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="2"
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
            y="70%"
            textAnchor="middle"
            className="word-path fill-none stroke-white font-black italic text-7xl md:text-8xl tracking-widest"
            style={{ strokeWidth: 1, strokeLinecap: "round" }}
          >
            BUDAPES
          </text>
        </svg>

        <div
          ref={copyrightSymbolRef}
          className="text-2xl md:text-4xl text-amber-500 font-bold absolute -right-6 md:-right-10 top-0"
        >
          ©
        </div>
      </div>
    </motion.div>
  );
}
