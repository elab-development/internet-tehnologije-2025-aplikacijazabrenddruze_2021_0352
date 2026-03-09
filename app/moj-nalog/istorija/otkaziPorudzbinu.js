"use client";
import { useState } from 'react';
import { otkaziPorudzbinu as akcijaOtkazi } from '../../actions/auth';
import { useRouter } from 'next/navigation';

export default function otkaziPorudzbinu({ orderId }) {
  const [prikaziModal, setPrikaziModal] = useState(false);
  const router = useRouter();

  const handleOtkazi = async () => {
    const res = await akcijaOtkazi(orderId);
    if (res.success) {
      setPrikaziModal(false);
      router.refresh();
    } else {
      alert(res.error || "Došlo je do greške.");
    }
  };

  return (
    <>
      {/* Glavno dugme na stranici */}
      <button 
        onClick={() => setPrikaziModal(true)}
        className="text-[10px] font-black uppercase underline decoration-2 hover:text-red-500 transition-colors cursor-pointer ml-4"
      >
        Otkaži porudžbinu
      </button>

      {/* CUSTOM MODAL - Prikazuje se samo kad je prikaziModal true */}
      {prikaziModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">
              Pažnja, <span className="text-[var(--color-druze-roze)]">Druže!</span>
            </h2>
            <p className="font-bold uppercase text-[10px] tracking-widest text-zinc-500 mb-8 leading-relaxed">
              Da li si siguran da želiš da otkažeš ovu porudžbinu? Ova akcija je trajna.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleOtkazi}
                className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Da, otkaži
              </button>
              <button 
                onClick={() => setPrikaziModal(false)}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest border-2 border-black hover:bg-zinc-50 transition-colors"
              >
                Nazad
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}