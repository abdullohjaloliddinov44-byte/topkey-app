'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  // Avtomatik kirish tekshiruvi
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#031028] text-white font-sans selection:bg-[#00E5FF] selection:text-black">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-[#00E5FF]">📍</span> TopKey
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full text-gray-300 hover:text-white transition">
            Kirish
          </Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-blue-600 transition font-medium">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Yo'qolgan buyumni emas, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#00E5FF]">
              egasini topamiz.
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg">
            QR-kodli yorliq va NFC texnologiyasi yordamida topilgan buyumni egasiga qaytarishni osonlashtiruvchi tizim.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Link href="/register" className="px-8 py-4 bg-[#007AFF] rounded-xl font-bold hover:scale-105 transition transform shadow-lg shadow-blue-500/30">
              Bepul boshlash
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 border border-gray-600 rounded-xl font-bold hover:bg-gray-800 transition">
              Qanday ishlaydi?
            </Link>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="w-full h-96 bg-gradient-to-tr from-[#007AFF]/20 to-[#00E5FF]/20 rounded-3xl border border-[#007AFF]/30 flex items-center justify-center relative overflow-hidden">
             <div className="absolute w-64 h-64 border border-[#00E5FF]/30 rounded-full animate-ping"></div>
             <div className="absolute w-48 h-48 border border-[#00E5FF]/50 rounded-full animate-pulse"></div>
             
             <div className="w-48 h-64 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 flex flex-col items-center justify-center z-10">
                <span className="text-[#00E5FF] text-4xl mb-2">📍</span>
                <span className="font-bold text-xl">TopKey</span>
                <div className="mt-4 w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black text-xs font-mono">QR KOD</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* XUSUSIYATLAR */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-[#007AFF] transition">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Anonim aloqa</h3>
            <p className="text-gray-400">Shaxsiy ma'lumotlaringiz oshkor qilinmaydi. Topuvchi bilan xavfsiz bog'laning.</p>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-[#007AFF] transition">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">QR va NFC</h3>
            <p className="text-gray-400">Kameradan skaner qiling yoki telefoningizni brelokga yaqinlashtiring.</p>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-[#007AFF] transition">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Xavfsiz</h3>
            <p className="text-gray-400">Buyumingiz har doim nazoratda. Faqat siz ruxsat bergan ma'lumotlar ko'rinadi.</p>
          </div>

        </div>
      </section>
    </main>
  );
    }
