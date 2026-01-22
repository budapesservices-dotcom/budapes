export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-black mb-4">404</h1>
      <p className="text-neutral-400 mb-8">Halaman tidak ditemukan.</p>
      <a
        href="/"
        className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-bold"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
