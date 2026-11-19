'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // 1. Narsani (item) yuklash
      const { data: itemData } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (itemData) setItem(itemData);

      // 2. Xabarlarni yuklash
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('item_id', id)
        .order('created_at', { ascending: true });
        
      if (msgData) setMessages(msgData);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);

    // Xabarni bazaga yozish
    const { error: insertError } = await supabase
      .from('messages')
      .insert([{ item_id: id, content: message }]);

    if (insertError) {
      // Agar xato bo'lsa, ekranga chiqaradi
      alert("Xatolik yuz berdi: " + insertError.message);
      console.log(insertError);
    } else {
      // Muvaffaqiyatli bo'lsa, inputni tozalaydi va xabarlarni yangilaydi
      setMessage('');
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('item_id', id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#031028] text-white p-4 flex justify-center items-center">Yuklanmoqda...</div>;
  if (!item) return <div className="min-h-screen bg-[#031028] text-white p-4 flex justify-center items-center">Narsa topilmadi</div>;

  return (
    <div className="min-h-screen bg-[#031028] text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 shadow-lg mt-10 h-fit">
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{item.name || 'Narsa'}</h1>
          <p className="text-gray-400">TopKey tizimi orqali xabar yuboring</p>
        </div>

        {/* Xabarlar ro'yxati */}
        <div className="space-y-4 max-h-60 overflow-y-auto mb-6 p-2 border border-gray-800 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Hali xabarlar yo'q</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-blue-600 p-3 rounded-lg w-fit ml-auto max-w-[80%] break-words">
                <p>{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Xabar yuborish formasi */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none border border-gray-700 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-500 px-4 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            {sending ? '...' : 'Yuborish'}
          </button>
        </form>

      </div>
    </div>
  );
          }
