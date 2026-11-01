'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setItem(data);
      }
      setLoading(false);
    };
    if (id) fetchItem();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    
    // Xabarni haqiqiy bazaga yozamiz
    const { error } = await supabase
      .from('messages')
      .insert([{ item_id: id, content: message }]);

    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      setSent(true);
      setMessage('');
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Yuklanmoqda...</div>;
  if (!item) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Buyum topilmadi.</div>;

  return (
    <div className="min-h-screen bg-[#031028] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-3xl border border-gray-800 shadow-2xl text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#007AFF]/20 to-[#00E5FF]/20 rounded-full flex items-center justify-center border border-[#00E5FF]/30">
             <span className="text-4xl">📍</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#00E5FF]">TopKey</h1>
        <p className="text-gray-400 mb-8 font-medium">Bu buyum TopKey bilan himoyalangan.</p>

        <div className="bg-[#031028] p-4 rounded-xl border border-gray-800 mb-8">
          <p className="text-sm text-gray-500 mb-1">Buyum nomi:</p>
          <p className="text-xl font-bold">{item.name}</p>
        </div>

        {sent ? (
          <div className="p-4 bg-green-900/50 border border-green-700 rounded-xl text-green-200">
            Xabaringiz egasiga yuborildi! Rahmat.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Egasi uchun xabar qoldiring..."
              className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF] min-h-[100px]"
              required
            />
            <button 
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-[#007AFF] hover:bg-blue-600 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {sending ? 'Yuborilmoqda...' : 'Egasi bilan bog\'lanish'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
