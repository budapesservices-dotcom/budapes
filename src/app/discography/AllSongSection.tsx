"use client";

import React, { useEffect, useRef } from "react";

const animText: Record<string, any> = {
  id: {
    left: "SEMUA",
    right: "LAGU",
    viewBoxLeft: "0 0 250 70",
    viewBoxRight: "0 0 190 70",
    origin: "65% 50%",
  },
  en: {
    left: "ALL",
    right: "SONG",
    viewBoxLeft: "0 0 130 70",
    viewBoxRight: "0 0 200 70",
    origin: "62% 50%",
  },
};

export default function AllSongSection({ lang }: { lang: "id" | "en" }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const smoothProgress = useRef<number>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // set some initial styles
    if (containerRef.current) {
      containerRef.current.style.transition = "none";
      containerRef.current.style.opacity = "0";
      containerRef.current.style.color = "rgba(255,255,255,0.2)";
      containerRef.current.style.willChange = "transform, color, opacity";
      (containerRef.current.style as any).backfaceVisibility = "hidden";
      (containerRef.current.style as any).textRendering = "geometricPrecision";
    }
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.pointerEvents = "none";
    }

    function clamp(v: number, a = 0, b = 1) {
      return Math.max(a, Math.min(b, v));
    }
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const inView = rect.top <= windowH && rect.bottom >= 0;

      let progress = 0;
      if (inView) {
        const scrollDistance = -rect.top;
        const totalDistance = Math.max(rect.height - windowH, 1);
        progress = clamp(scrollDistance / totalDistance, 0, 1);
      } else {
        progress = rect.top > windowH ? 0 : 1;
      }

      // smooth the progress to make zooming very slow
      smoothProgress.current = lerp(smoothProgress.current, progress, 0.06);

      const p = smoothProgress.current;

      // phases
      const entrance = clamp(p / 0.4);
      const entranceEase = 1 - Math.pow(1 - entrance, 3);
      const xLeft = entranceEase < 1 ? lerp(-20, 0, entranceEase) : 0;
      const xRight = entranceEase < 1 ? lerp(20, 0, entranceEase) : 0;
      const opacity = entranceEase;

      // zoom (very slow, powerful but smooth)
      const zoomStart = 0.6;
      let zoomProgress = 0;
      if (p > zoomStart) {
        zoomProgress = clamp((p - zoomStart) / (1 - zoomStart), 0, 1);
      }
      const zoomEase = Math.pow(zoomProgress, 1.8);
      const scaleVal = 1 + zoomEase * 2.8; // moderate scale
      const translateZ = zoomEase * 900; // perspective-based depth

      // color mix to amber
      const mix = zoomProgress;
      const r = Math.round(255 + (245 - 255) * mix);
      const g = Math.round(255 + (158 - 255) * mix);
      const b = Math.round(255 + (11 - 255) * mix);
      const alpha = 0.2 + 0.8 * mix;

      // apply
      if (leftRef.current) {
        leftRef.current.style.transform = `translate3d(${xLeft}vw,0,0)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translate3d(${xRight}vw,0,0)`;
      }
      if (containerRef.current) {
        // ensure parent has perspective
        containerRef.current.style.transform = `translate3d(0,0,0) scale(${scaleVal}) translateZ(${translateZ}px)`;
        containerRef.current.style.opacity = `${opacity}`;
        containerRef.current.style.color = `rgba(${r},${g},${b},${alpha})`;
        containerRef.current.style.transformOrigin = animText[lang].origin;
      }
      if (overlayRef.current) {
        // overlay appears late
        const overlayAlpha = clamp((zoomProgress - 0.82) / 0.18, 0, 1);
        overlayRef.current.style.opacity = `${overlayAlpha}`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    // keep scroll/resize events nudging for responsiveness
    const onEvent = () => {
      // no-op; RAF reads layout each frame
    };
    window.addEventListener("resize", onEvent);
    window.addEventListener("scroll", onEvent, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onEvent);
      window.removeEventListener("scroll", onEvent);
    };
  }, [lang]);

  const current = animText[lang];

  return (
    <section
      ref={sectionRef as any}
      className="relative h-[600vh] bg-[#050505] w-full"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          ref={containerRef as any}
          className="relative flex items-center justify-center gap-0 z-10 will-change-transform"
          style={{
            perspective: "2000px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={leftRef as any}
            className="will-change-transform flex items-center justify-end"
          >
            <svg
              viewBox={current.viewBoxLeft}
              className="h-[12vw] w-auto overflow-visible"
            >
              <text
                x="50%"
                y="50%"
                dy=".35em"
                textAnchor="middle"
                className="font-black italic tracking-tighter uppercase select-none"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ fontSize: "60px", paintOrder: "stroke fill" }}
              >
                {current.left}
              </text>
            </svg>
          </div>

          <div
            ref={rightRef as any}
            className="will-change-transform flex items-center justify-start"
          >
            <svg
              viewBox={current.viewBoxRight}
              className="h-[12vw] w-auto overflow-visible"
            >
              <text
                x="50%"
                y="50%"
                dy=".35em"
                textAnchor="middle"
                className="font-black italic tracking-tighter uppercase select-none"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ fontSize: "60px", paintOrder: "stroke fill" }}
              >
                {current.right}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* overlay amber internal to this component */}
      <div
        ref={overlayRef as any}
        className="fixed inset-0 bg-amber-500 z-[60] pointer-events-none opacity-0 transition-opacity duration-200"
        aria-hidden
      />
    </section>
  );
}
