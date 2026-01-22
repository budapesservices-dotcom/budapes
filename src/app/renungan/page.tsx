"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PhilosopherVoid() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [lang, setLang] = useState<"in" | "en">("in");
  const router = useRouter();

  const philosophy = {
    in: [
      {
        text: "Hidup yang tidak dipertanyakan tidak layak dijalani.",
        author: "Socrates",
      },
      {
        text: "Kita adalah apa yang kita kerjakan berulang kali.",
        author: "Aristoteles",
      },
      {
        text: "Hanya satu yang aku tahu, bahwa aku tidak tahu apa-apa.",
        author: "Socrates",
      },
      {
        text: "Kesulitan adalah apa yang membangun karakter.",
        author: "Epictetus",
      },
      {
        text: "Waktu adalah gambaran bergerak dari keabadian.",
        author: "Plato",
      },
    ],
    en: [
      { text: "The unexamined life is not worth living.", author: "Socrates" },
      { text: "We are what we repeatedly do.", author: "Aristotle" },
      {
        text: "I know only one thing, that I know nothing.",
        author: "Socrates",
      },
      {
        text: "Difficulties are things that show what men are.",
        author: "Epictetus",
      },
      { text: "Time is the moving image of eternity.", author: "Plato" },
    ],
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("user-lang") as "in" | "en";
    if (savedLang) setLang(savedLang);
    // Ambil kutipan pertama saat dimuat
    const initialQuotes = philosophy[savedLang || "in"];
    setQuote(initialQuotes[Math.floor(Math.random() * initialQuotes.length)]);
  }, []);

  const getNewQuote = () => {
    const currentQuotes = philosophy[lang];
    // Pastikan tidak mendapat kutipan yang sama berturut-turut
    let newQuote;
    do {
      newQuote =
        currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
    } while (newQuote.text === quote.text);
    setQuote(newQuote);
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden relative">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="absolute top-10 right-10 text-[10px] text-white/20 hover:text-rose-500 tracking-[0.5em] uppercase font-black transition-all z-50"
      >
        {lang === "in" ? "KEMBALI" : "BACK"}
      </button>

      {/* Konten Utama */}
      <div className="max-w-4xl w-full text-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-indigo-500/30 text-6xl font-serif mb-6">
              “
            </span>

            <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-12 italic uppercase">
              {quote.text}
            </h1>

            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-rose-500/50" />
              <p className="text-[11px] tracking-[0.6em] text-neutral-500 font-bold uppercase">
                {quote.author}
              </p>
              <div className="w-8 h-[1px] bg-rose-500/50" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ letterSpacing: "0.8em", color: "#6366f1" }}
        onClick={getNewQuote}
        className="mt-24 text-[10px] tracking-[0.5em] text-neutral-600 font-black uppercase border-b border-white/5 pb-2 transition-all cursor-pointer"
      >
        {lang === "in" ? "RENUNGKAN LAGI" : "REFLECT AGAIN"}
      </motion.button>

      {/* Grain Overlay untuk tekstur klasik */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
