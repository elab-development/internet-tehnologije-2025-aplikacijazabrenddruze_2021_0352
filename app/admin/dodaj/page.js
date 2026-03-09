import Link from "next/link";
import { dodajAdminAction } from '../actions'; 

export default function DodajAdmina() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-md flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">
            Novi <span className="text-[#ff00ff]">Admin</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">
            Unesi sve podatke za novog administratora
          </p>
        </div>

        <form action={dodajAdminAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Ime i Prezime</label>
            <input type="text" name="ime_prezime" required className="p-3 border-2 border-zinc-200 focus:border-black outline-none transition-colors font-medium bg-zinc-50 focus:bg-white" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Email Adresa</label>
            <input type="email" name="email" required className="p-3 border-2 border-zinc-200 focus:border-black outline-none transition-colors font-medium bg-zinc-50 focus:bg-white" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Adresa</label>
            <input type="text" name="adresa" required className="p-3 border-2 border-zinc-200 focus:border-black outline-none transition-colors font-medium bg-zinc-50 focus:bg-white" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Kontakt Telefon</label>
            <input type="text" name="kontakt_telefon" required className="p-3 border-2 border-zinc-200 focus:border-black outline-none transition-colors font-medium bg-zinc-50 focus:bg-white" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Lozinka</label>
            <input type="password" name="password" required className="p-3 border-2 border-zinc-200 focus:border-black outline-none transition-colors font-medium bg-zinc-50 focus:bg-white" />
          </div>

          <button type="submit" className="h-14 mt-6 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-[#ff00ff] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer">
            SAČUVAJ ADMINA
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-100 pt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors">
            ← Nazad na panel
          </Link>
        </div>

      </main>
    </div>
  );
}