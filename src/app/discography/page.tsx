"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function DiscographyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Membaca ?lang= dari URL, default ke 'in' jika kosong
  const lang = (searchParams.get("lang") as "in" | "en") || "in";

  const content = {
    in: {
      title: "Diskografi",
      subtitle: "Koleksi Mahakarya Budapes",
      back: "← Kembali",
      items: [
        {
          year: "2024",
          title: "Inovasi Digital",
          desc: "Eksplorasi seni dalam kode.",
        },
        {
          year: "2023",
          title: "Jiwa Kreasi",
          desc: "Project perdana yang mendefinisikan standar kami.",
        },
      ],
    },
    en: {
      title: "Discography",
      subtitle: "Budapes Masterpiece Collection",
      back: "← Back",
      items: [
        {
          year: "2024",
          title: "Digital Innovation",
          desc: "Art exploration through code.",
        },
        {
          year: "2023",
          title: "Soul of Creation",
          desc: "First project defining our standards.",
        },
      ],
    },
  };

  const t = content[lang];

  return (
    <main className="min-h-screen bg-[#050505] text-white p-8 sm:p-20 font-sans">
      {/* Tombol Kembali yang tetap membawa status bahasa */}
      <button
        onClick={() => router.push(`/?lang=${lang}`)}
        className="text-xs tracking-widest uppercase text-neutral-500 hover:text-indigo-400 transition-colors mb-12"
      >
        {t.back}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl sm:text-7xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          {t.title}
        </h1>
        <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-16">
          {t.subtitle}
        </p>

        <div className="grid gap-12">
          {t.items.map((item, idx) => (
            <div
              key={idx}
              className="group border-l border-white/10 pl-6 hover:border-indigo-500 transition-colors"
            >
              <span className="text-indigo-500 font-mono text-sm">
                {item.year}
              </span>
              <h2 className="text-2xl font-bold mt-2 group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h2>
              <p className="text-neutral-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

// Next.js mewajibkan Suspense saat menggunakan useSearchParams di Client Component
export default function DiscographyPage() {
  return (
    <Suspense fallback={<div className="bg-[#050505] h-screen" />}>
      <DiscographyContent />
    </Suspense>
  );
}
