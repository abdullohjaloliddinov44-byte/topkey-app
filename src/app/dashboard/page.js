import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#031028] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-[#00E5FF]">📍</span> TopKey Kabineti
        </div>
        <Link href="/" className="text-gray-400 hover:text-white transition">
          Chiqish
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mening buyumlarim</h1>
          <button className="px-6 py-2 bg-[#007AFF] rounded-xl font-bold hover:bg-blue-600 transition">
            + Yangi buyum qo'shish
          </button>
        </div>

        {/* Bo'sh holat (Hozircha hech qanday buyum yo'q) */}
        <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2">Hozircha buyumlar yo'q</h2>
          <p className="text-gray-400 mb-6">Birinchi buyumingizni qo'shing va unga QR kod biriktiring.</p>
          <button className="px-6 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition border border-gray-700">
            Brelok sotib olish
          </button>
        </div>
      </main>
    </div>
  );
          }
