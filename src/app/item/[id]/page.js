'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const { data: itemData } = await supabase.from('items').select('*').eq('id', id).maybeSingle();
      if (!itemData) { setError(true); setLoading(false); return; }
      setItem(itemData);

      const { data: msgData } = await supabase.from('messages').select('*').eq('item_id', id).order('created_at', { ascending: true });
      if (msgData) setMessages(msgData);
      
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    
    const { error } = await supabase.from('messages').insert([{ item_id: id, content: message, sender: 'topuvchi' }]);
    
    if (!error) {
      setMessage('');
      const { data } = await supabase.from('messages').select('*').eq('item_id', id).order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Yuklanmoqda...</div>;
  if (error || !item) return <div className="min-h-screen bg-[#031028] text-white flex items-center justify-center">Buyum topilmadi.</div>;

  return (
    <div className="min-h-screen bg-[#031028] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-3xl border border-gray-800 shadow-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#007AFF]/20 to-[#00E5FF]/20 rounded-full flex items-center justify-center border border-[#00E5FF]/30">
             <span className="text-4xl">📍</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#00E5FF]">TopKey</h1>
        <p className="text-gray-400 mb-6 font-medium">Bu buyum TopKey bilan himoyalangan.</p>

        <div className="bg-[#031028] p-4 rounded-xl border border-gray-800 mb-6">
          <p className="text-sm text-gray-500 mb-1">Buyum nomi:</p>
          <p className="text-xl font-bold">{item.name}</p>
        </div>

        <div className="space-y-4 max-h-60 overflow-y-auto mb-4 p-2 text-left bg-[#031028] rounded-xl border border-gray-800">
          {messages.length === 0 ? (
             <p className="text-gray-500 text-center text-sm py-4">Hozircha xabarlar yo'q. Egasi bilan bog'lanish uchun xabar yozing.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'topuvchi' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'topuvchi' ? 'bg-[#007AFF] text-white' : 'bg-gray-800 text-gray-200'}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Xabar yozing..." className="flex-1 px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" required />
          <button type="submit" disabled={sending} className="px-6 py-3 bg-[#007AFF] rounded-xl font-bold disabled:opacity-50">{sending ? '...' : 'Yuborish'}</button>
        </form>
      </div>
    </div>
  );
    }
