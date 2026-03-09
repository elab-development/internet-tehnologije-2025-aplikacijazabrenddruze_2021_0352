'use client'
import Link from 'next/link';
import { ulogujKorisnika } from '../actions/auth'; 

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
            Prijava
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
            Dobrodošao nazad, <span className="text-[var(--color-druze-roze)]">Druže</span>
          </p>
        </div>

        
        <form action={ulogujKorisnika} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Email adresa
            </label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full h-14 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
              placeholder="tvoj@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Lozinka
            </label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full h-14 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="mt-6 w-full h-14 bg-black text-white font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-sm dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Uloguj se
          </button>

        </form>

        <div className="mt-8 pt-6 border-t-4 border-black dark:border-zinc-700 text-center">
          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
            Nemaš nalog?{' '}
            <Link href="/register" className="text-black dark:text-white hover:text-[var(--color-druze-roze)] uppercase tracking-tighter transition-colors">
              Registruj se
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}