"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [brojArtikala, setBrojArtikala] = useState(0);


  const osveziBroj = () => {
    const korpa = JSON.parse(localStorage.getItem('druze_korpa')) || [];
    const ukupanBroj = korpa.reduce((acc, item) => acc + item.kolicina, 0);
    setBrojArtikala(ukupanBroj);
  };


  useEffect(() => {
    osveziBroj(); 
    window.addEventListener('korpa_azurirana', osveziBroj);
    return () => window.removeEventListener('korpa_azurirana', osveziBroj);
  }, []);

  return (
    <nav className="w-full h-20 border-b-2 border-black bg-white px-8 flex items-center justify-between sticky top-0 z-50">
     
      <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
       <span className="text-[var(--color-druze-roze)]"> DRUŽE</span>
      </Link>

      <div className="flex gap-8 items-center text-sm font-bold uppercase text-zinc-800">
        

        <Link href="/cart" className="hover:text-[var(--color-druze-roze)] transition-colors">
          Moja korpa ({brojArtikala})
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