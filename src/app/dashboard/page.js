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
  const [messages, setMessages] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // O'chirish uchun mo'ljallangan holat (State)
  const [itemToDelete, setItemToDelete] = useState(null);

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
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setAdding(true);
    await supabase.from('items').insert([{ name: newItemName, user_id: user.id }]);
    setNewItemName('');
    fetchItems();
    setAdding(false);
  };

  // Haqiqiy o'chirish funksiyasi (Tasdiqlangandan keyin ishlaydi)
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase.from('items').delete().eq('id', itemToDelete);

    if (error) {
      alert("O'chirishda xatolik: " + error.message);
    } else {
      setItems(items.filter(item => item.id !== itemToDelete));
      if (selectedItem === itemToDelete) {
        setSelectedItem(null);
      }
    }
    setItemToDelete(null); // Oynani yopish
  };

  const fetchMessages = async (itemId) => {
    const { data } = await supabase.from('messages').select('*').eq('item_id', itemId).order('created_at', { ascending: true });
    if (data) {
      setMessages(data);
      setSelectedItem(itemId);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedItem) return;

    const { error } = await supabase.from('messages').insert([
      { item_id: selectedItem, content: replyText, sender: 'egasi' }
    ]);

    if (!error) {
      setReplyText('');
      fetchMessages(selectedItem);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-[#031028] text-white relative">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-[#00E5FF]">📍</span> TopKey Kabineti
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="text-gray-400 hover:text-white">Chiqish</button>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8">Mening buyumlarim</h1>

        <form onSubmit={handleAddItem} className="mb-8 flex gap-4">
          <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Yangi buyum nomi" className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" required />
          <button type="submit" disabled={adding} className="px-6 py-3 bg-[#007AFF] rounded-xl font-bold hover:bg-blue-600">{adding ? '...' : '+ Qo\'shish'}</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
              
              {/* O'chirish tugmasi (Savat belgisi) */}
              <button 
                onClick={() => setItemToDelete(item.id)} // Bosilganda modal oynasi ochiladi
                className="absolute top-3 right-3 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition"
                title="Buyumni o'chirish"
              >
                🗑️
              </button>

              <h3 className="text-xl font-bold mb-4 mt-2">{item.name}</h3>
              
              <div className="bg-white p-2 rounded-xl mb-4">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://topkey-app.vercel.app/item/${item.id}`} alt="QR" className="w-32 h-32" />
              </div>
              
              <div className="flex gap-2 w-full mt-2">
                <button onClick={() => fetchMessages(item.id)} className="flex-1 py-2 bg-[#007AFF] rounded-lg text-sm font-semibold hover:bg-blue-600">Xabarlar</button>
                <a href={`/item/${item.id}`} target="_blank" className="flex-1 py-2 bg-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-600">Sahifa</a>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <div className="mt-10 p-6 bg-gray-900 border border-gray-700 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chat</h2>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white">Yopish ✕</button>
            </div>
            
            <div className="space-y-4 max-h-60 overflow-y-auto mb-4 p-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'egasi' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'egasi' ? 'bg-[#007AFF] text-white' : 'bg-gray-800 text-gray-200'}`}>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="flex gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Javob yozing..." className="flex-1 px-4 py-2 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" />
              <button type="submit" className="px-4 py-2 bg-[#007AFF] rounded-xl font-bold">Yuborish</button>
            </form>
          </div>
        )}
      </main>

      {/* ========================================= */}
      {/* CHIROYLI TASDIQLASH OYNASI (MODAL) */}
      {/* ========================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b172a] border border-gray-700 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">O'chirishni tasdiqlaysizmi?</h3>
            <p className="text-gray-400 mb-8 text-sm">
              Haqiqatan ham ushbu buyumni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition"
              >
                Yo'q, bekor qilish
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition shadow-lg shadow-red-900/30"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
