"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [ucitano, setUcitano] = useState(false);
  const [prikaziLoginModal, setPrikaziLoginModal] = useState(false);
  const router = useRouter();

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

  const proveriKasu = async (e) => {
    if (e) e.preventDefault();

    try {
      const res = await fetch('/api/user-data'); 
      
      if (res.ok) {
        router.push('/checkout');
      } else {
        setPrikaziLoginModal(true); 
      }
    } catch (error) {
      setPrikaziLoginModal(true);
    }
  };

  if (!ucitano) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.cena * item.kolicina), 0);

  return (
    <main className="min-h-screen bg-white p-8 md:p-16 text-black font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-baseline mb-12">
          <h1 className="text-4xl font-black uppercase italic">Vaša korpa</h1>
          <Link href="/" className="text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-[var(--color-druze-roze)] transition-colors text-black">
            Nastavi kupovinu
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border-y-4 border-black">
            <p className="text-lg text-zinc-400 mb-6 font-bold uppercase tracking-widest">Vaša korpa je trenutno prazna.</p>
            <Link href="/" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
              Istraži prodavnicu
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-12 pb-4 border-b-2 border-black text-[10px] uppercase font-black tracking-widest text-zinc-400">
              <div className="col-span-6">Proizvod</div>
              <div className="col-span-4 text-center">Količina</div>
              <div className="col-span-2 text-right">Ukupno</div>
            </div>

            <div className="border-b-2 border-black">
              {cartItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 py-8 items-center gap-6 md:gap-0 border-b border-zinc-100 last:border-0">
                  <div className="col-span-6 flex gap-6 items-center">
                    <div className="w-20 h-24 bg-zinc-50 flex-shrink-0 border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                      <img src={item.slika_url || item.slikaUrl || item.slika || "/images/placeholder.jpg"} alt={item.naziv} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-black uppercase tracking-tight text-black">{item.naziv}</h3>
                      <p className="text-sm font-bold text-zinc-400">{item.cena} RSD</p>
                      <p className="text-[10px] font-black uppercase bg-[var(--color-druze-roze)] w-fit px-2 py-0.5 border border-black text-black">Veličina: {item.velicina}</p>
                    </div>
                  </div>

                  <div className="col-span-4 flex items-center justify-start md:justify-center gap-6">
                    <div className="flex items-center border-2 border-black w-24 h-10 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <button onClick={() => promeniKolicinu(item.id, item.velicina, -1)} className="flex-1 h-full hover:bg-zinc-100 font-black cursor-pointer text-black">-</button>
                      <span className="flex-1 text-center text-sm font-black border-x-2 border-black text-black">{item.kolicina}</span>
                      <button onClick={() => promeniKolicinu(item.id, item.velicina, 1)} className="flex-1 h-full hover:bg-zinc-100 font-black cursor-pointer text-black">+</button>
                    </div>

                    <button onClick={() => obrisiIzKorpe(item.id, item.velicina)} className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-black">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>

                  <div className="col-span-2 text-right text-lg font-black tracking-tighter text-black">
                    {(item.cena * item.kolicina)} RSD
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-end">
              <div className="flex justify-between md:justify-end gap-6 items-center w-full md:w-auto mb-3 text-black">
                <span className="text-base font-black uppercase italic tracking-tighter">Ukupno</span>
                <span className="text-3xl font-black tracking-tighter italic">{total} RSD</span>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 mb-8 text-right uppercase tracking-widest">
                Porez je uključen. Dostava se obračunava na kasi.
              </p>

              <button
                onClick={(e) => proveriKasu(e)}
                className="w-full md:w-80 bg-black text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-[var(--color-druze-roze)] hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer"
              >
                Kasa
              </button>
            </div>
          </>
        )}
      </div>

      {prikaziLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white border-[6px] border-black p-10 max-w-sm w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic leading-none text-black">
              Nisi se <span className="text-[var(--color-druze-roze)]">prijavio!</span>
            </h2>
            <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-500 mb-10 leading-relaxed">
              Moraš biti ulogovan da bismo znali kome šaljemo paket, Druže. Prijavi se i nastavi tamo gde si stao.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.push('/login')} 
                className="w-full py-5 bg-[var(--color-druze-roze)] text-black font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Prijavi se odmah
              </button>
              <button 
                onClick={() => setPrikaziLoginModal(false)} 
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest border-2 border-black hover:bg-zinc-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
              >
                Vrati se nazad
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}