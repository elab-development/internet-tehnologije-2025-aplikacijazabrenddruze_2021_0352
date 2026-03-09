"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DodajUKorpu({ proizvod }) {

    const [velicina, setVelicina] = useState(null);
    const [kolicina, setKolicina] = useState(1);
    const [greska, setGreska] = useState(false);
    
    const router = useRouter();

    const maxLager = proizvod.lager || 1;
    const dostupneVelicine = proizvod.dostupne_velicine ? proizvod.dostupne_velicine.split(',') : [];

    const povecaj = () => { if (kolicina < maxLager) setKolicina(kolicina + 1); };
    const smanji = () => { if (kolicina > 1) setKolicina(kolicina - 1); };

    const handleDodajUKorpu = () => {

        if (dostupneVelicine.length > 0 && !velicina) {
            setGreska(true);
            return;
        }

    
        const novaStavka = {
            id: proizvod.id,
            naziv: proizvod.naziv,
            cena: Number(proizvod.cena),
            slika: proizvod.slika_url || "/images/placeholder.jpg",
            velicina: velicina || 'OS',
            kolicina: kolicina
        };

      
        const staraKorpa = JSON.parse(localStorage.getItem('druze_korpa')) || [];

   
        const postojiIndex = staraKorpa.findIndex(
            item => item.id === novaStavka.id && item.velicina === novaStavka.velicina
        );

        if (postojiIndex !== -1) {
        
            staraKorpa[postojiIndex].kolicina += kolicina;
        } else {
          
            staraKorpa.push(novaStavka);
        }


        localStorage.setItem('druze_korpa', JSON.stringify(staraKorpa));
        

        window.dispatchEvent(new Event('korpa_azurirana')); 
        
        router.push('/cart');
    };

    return (
        <div className="space-y-6">
            
      
            {dostupneVelicine.length > 0 && (
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 italic">
                        Izaberi Veličinu
                    </p>
                    <div className="flex gap-2">
                        {dostupneVelicine.map((size) => (
                            <button
                                key={size}
                                onClick={() => { 
                                    setVelicina(size.trim()); 
                                    setGreska(false); 
                                }}
                                className={`w-12 h-12 border-2 border-black font-black text-xs transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] 
                                ${velicina === size.trim() ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}
                            >
                                {size.trim()}
                            </button>
                        ))}
                    </div>
                </div>
            )}

           
            <div className="mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                    Količina {maxLager <= 5 && <span className="text-red-500 ml-2">(Preostalo još: {maxLager})</span>}
                </p>
                <div className="flex items-center border-2 border-black w-32 h-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <button onClick={smanji} type="button" className="flex-1 font-black h-full border-r-2 border-black hover:bg-zinc-100 transition-colors text-black text-lg disabled:opacity-30" disabled={kolicina <= 1}>-</button>
                    
                    <span className="flex-1 text-center font-black text-sm text-black">{kolicina}</span>
                    
                    <button onClick={povecaj} type="button" className="flex-1 font-black h-full border-l-2 border-black hover:bg-zinc-100 transition-colors text-black text-lg disabled:opacity-30" disabled={kolicina >= maxLager}>+</button>
                </div>
            </div>

       
            <div className="pt-8">
                <button 
                    onClick={handleDodajUKorpu}
                    className="w-full bg-black text-white py-6 font-black uppercase text-lg hover:bg-[#ff00ff] transition-all active:scale-[0.97] shadow-[8px_8px_0px_0px_rgba(255,0,255,0.3)] border-2 border-black cursor-pointer"
                >
                    DODAJ U KORPU
                   
                </button>

                {greska && (
                    <p className="mt-4 text-xs font-black text-red-500 uppercase text-center animate-bounce tracking-widest border-2 border-red-500 py-2">
                        ⚠️ Moraš izabrati veličinu!
                    </p>
                )}
            </div>

        </div>
    );
}