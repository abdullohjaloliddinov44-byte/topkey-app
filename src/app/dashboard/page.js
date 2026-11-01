'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchItems();
      }
    };
    checkUser();
  }, [router]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setAdding(true);
    const { error } = await supabase
      .from('items')
      .insert([{ name: newItemName, user_id: user.id }]);

    if (!error) {
      setNewItemName('');
      fetchItems();
    } else {
      alert("Xatolik: " + error.message);
    }
    setAdding(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-[#031028] text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-[#00E5FF]">📍</span> TopKey Kabineti
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">
          Chiqish
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8">Mening buyumlarim</h1>

        <form onSubmit={handleAddItem} className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Yangi buyum nomi (masalan: Uy kalitlari)"
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]"
            required
          />
          <button
            type="submit"
            disabled={adding}
            className="px-6 py-3 bg-[#007AFF] rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {adding ? 'Qo\'shilmoqda...' : '+ Qo\'shish'}
          </button>
        </form>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Hozircha buyumlar yo'q</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="p-6 bg-gray-900/50 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-4">{item.name}</h3>
                
                {/* QR KOD */}
                <div className="bg-white p-2 rounded-xl mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://topkey-app.vercel.app/item/${item.id}`} 
                    alt={`QR code for ${item.name}`}
                    className="w-32 h-32"
                  />
                </div>
                
                <p className="text-xs text-gray-500 mb-4">ID: {item.id.split('-')[0]}...</p>
                
                <a 
                  href={`/item/${item.id}`} 
                  target="_blank"
                  className="w-full py-2 bg-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Topuvchi sahifasini ko'rish
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
          }
