import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full h-20 border-b-2 border-black bg-white px-8 flex items-center justify-between sticky top-0 z-50">
     
      <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
       <span className="text-[var(--color-druze-roze)]"> DRUŽE</span>
      </Link>

    
      <div className="flex gap-8 items-center text-sm font-bold uppercase text-zinc-800">
        <Link href="/shop" className="hover:text-[var(--color-druze-roze)] transition-colors">
          Prodavnica
        </Link>
        <Link href="/onama" className="hover:text-[var(--color-druze-roze)] transition-colors">
          O nama
        </Link>
        <Link href="/login" className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all">
          Prijava
        </Link>
      </div>
    </nav>
  );
}