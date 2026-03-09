"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
 
  const [cartItems, setCartItems] = useState([]);
  const [ucitano, setUcitano] = useState(false); 


  useEffect(() => {
    const sacuvanaKorpa = JSON.parse(localStorage.getItem('druze_korpa')) || [];
    setCartItems(sacuvanaKorpa);
    setUcitano(true);
  }, []);


  const sacuvajPromene = (novaKorpa) => {
    setCartItems(novaKorpa);
    localStorage.setItem('druze_korpa', JSON.stringify(novaKorpa));
    window.dispatchEvent(new Event('korpa_azurirana')); 
  };


  const obrisiIzKorpe = (id, velicina) => {
    const novaKorpa = cartItems.filter(item => !(item.id === id && item.velicina === velicina));
    sacuvajPromene(novaKorpa);
  };

  const promeniKolicinu = (id, velicina, promena) => {
    const novaKorpa = cartItems.map(item => {
      if (item.id === id && item.velicina === velicina) {
        const novaKolicina = item.kolicina + promena;

        if (novaKolicina > 0) {
          return { ...item, kolicina: novaKolicina };
        }
      }
      return item;
    });
    sacuvajPromene(novaKorpa);
  };


  if (!ucitano) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.cena * item.kolicina), 0);

  return (
    <main className="min-h-screen bg-white p-8 md:p-16 text-black font-sans">
      <div className="max-w-5xl mx-auto">
        

        <div className="flex justify-between items-baseline mb-12">
          <h1 className="text-4xl font-normal">Vaša korpa</h1>
          <Link href="/" className="text-sm underline underline-offset-4 hover:text-zinc-500 transition-colors">
            Nastavi kupovinu
          </Link>
        </div>


        {cartItems.length === 0 ? (
          <div className="text-center py-24 border-y border-zinc-200">
            <p className="text-lg text-zinc-500 mb-6 font-normal">Vaša korpa je trenutno prazna.</p>
            <Link href="/" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
              Istraži prodavnicu
            </Link>
          </div>
        ) : (
        
          <>
           
            <div className="hidden md:grid grid-cols-12 pb-4 border-b border-zinc-200 text-[10px] uppercase tracking-widest text-zinc-500">
              <div className="col-span-6">Proizvod</div>
              <div className="col-span-4 text-center">Količina</div>
              <div className="col-span-2 text-right">Ukupno</div>
            </div>

           
            <div className="border-b border-zinc-200">
              {cartItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 py-8 items-center gap-6 md:gap-0">
                  
               
                  <div className="col-span-6 flex gap-6 items-center">
                    <div className="w-20 h-24 bg-zinc-50 flex-shrink-0 border border-zinc-100 p-1">
                      <img src={item.slika} alt={item.naziv} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-normal">{item.naziv}</h3>
                      <p className="text-sm text-zinc-500">{item.cena.toFixed(2)} RSD</p>
                      <p className="text-sm text-zinc-500">Veličina: {item.velicina}</p>
                    </div>
                  </div>

                
                  <div className="col-span-4 flex items-center justify-start md:justify-center gap-6">
                    <div className="flex items-center border border-zinc-300 w-24 h-10">
                      <button onClick={() => promeniKolicinu(item.id, item.velicina, -1)} className="flex-1 h-full hover:bg-zinc-50 text-zinc-500 transition-colors cursor-pointer">-</button>
                      <span className="flex-1 text-center text-sm">{item.kolicina}</span>
                      <button onClick={() => promeniKolicinu(item.id, item.velicina, 1)} className="flex-1 h-full hover:bg-zinc-50 text-zinc-500 transition-colors cursor-pointer">+</button>
                    </div>
                    
                   
                    <button onClick={() => obrisiIzKorpe(item.id, item.velicina)} className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                 
                  <div className="col-span-2 text-right text-base font-normal">
                    {(item.cena * item.kolicina).toFixed(2)} RSD
                  </div>
                </div>
              ))}
            </div>

        
            <div className="mt-12 flex flex-col items-end">
              <div className="flex justify-between md:justify-end gap-6 items-center w-full md:w-auto mb-3">
                <span className="text-base font-normal">Ukupno</span>
                <span className="text-lg font-normal">{total.toFixed(2)} RSD</span>
              </div>
              <p className="text-xs text-zinc-500 mb-8 text-right">
                Porez je uključen. Popusti i dostava se obračunavaju na kasi.
              </p>
              
              <button className="w-full md:w-80 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all cursor-pointer">
                Kasa
              </button>
            </div>
          </>
        )}
        
      </div>
    </main>
  );
}