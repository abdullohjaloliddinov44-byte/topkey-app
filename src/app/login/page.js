'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('Xatolik: ' + error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#031028] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tizimga kirish</h1>
          <p className="text-gray-400">TopKey hisobingizga kiring</p>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-center text-red-200">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Akkauntingiz yo'qmi? <Link href="/register" className="text-[#00E5FF] hover:underline">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
    }
