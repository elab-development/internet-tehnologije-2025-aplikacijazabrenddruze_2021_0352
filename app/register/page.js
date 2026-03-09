"use client"
import Link from 'next/link';
import { registrujKorisnika } from '../actions/auth';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-6 dark:bg-black">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">

        <div className="text-center mb-8">
          <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-[2px_2px_0px_0px_rgba(255,105,180,1)]">
            Nalog za kupce
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
            Registracija
          </h1>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
            Spremi se za dostavu
          </p>
        </div>

        <form action={registrujKorisnika} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Ime i prezime
            </label>
            <input
              type="text" name="ime_prezime" required
              className="w-full h-12 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Email adresa
            </label>
            <input
              type="email" name="email" required
              className="w-full h-12 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Adresa za dostavu
            </label>
            <input
              type="text" name="adresa" required placeholder="Ulica i broj, Grad"
              className="w-full h-12 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Kontakt telefon
            </label>
            <input
              type="text"
              name="kontakt_telefon"
              inputMode="numeric"
              pattern="[0-9]*"
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
              required
              placeholder="06XXXXXXXX"
              className="w-full h-12 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-300">
              Lozinka
            </label>
            <input
              type="password" name="password" required
              className="w-full h-12 border-4 border-black bg-zinc-50 px-4 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full h-14 bg-[var(--color-druze-roze)] text-white font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all text-sm"
          >
            Napravi nalog
          </button>

        </form>

        <div className="mt-6 pt-4 border-t-4 border-black dark:border-zinc-700 text-center">
          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
            Već imaš nalog?{' '}
            <Link href="/login" className="text-black dark:text-white hover:text-[var(--color-druze-roze)] uppercase tracking-tighter transition-colors">
              Prijavi se
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}