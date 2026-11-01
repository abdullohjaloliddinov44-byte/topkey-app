import Link from 'next/link';

export default function Login() {
  return (
    <div className="min-h-screen bg-[#031028] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tizimga kirish</h1>
          <p className="text-gray-400">TopKey hisobingizga kiring</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parol</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#031028] border border-gray-700 rounded-xl focus:outline-none focus:border-[#00E5FF]" />
          </div>
          
          <button type="button" className="w-full py-3 bg-[#007AFF] hover:bg-blue-600 rounded-xl font-bold transition mt-4">
            Kirish
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Akkauntingiz yo'qmi? <Link href="/register" className="text-[#00E5FF] hover:underline">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
    }
