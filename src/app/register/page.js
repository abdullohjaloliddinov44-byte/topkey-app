'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage('Xatolik: ' + error.message);
    } else {
      setMessage('Muvaffaqiyatli! Emailingizni tasdiqlang.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#031028] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-gray-400">TopKey tizimiga qo'shiling</p>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-700 rounded-lg text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ismingiz</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ism Familiya" 
              className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" 
              className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parol</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" 
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-[#007AFF] hover:bg-blue-600 rounded-xl font-bold transition mt-4 disabled:opacity-50"
          >
            {loading ? 'Yuklanmoqda...' : 'Hisob yaratish'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Akkauntingiz bormi? <Link href="/login" className="text-[#00E5FF] hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
                }
