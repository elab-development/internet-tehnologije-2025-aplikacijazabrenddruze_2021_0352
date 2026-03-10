"use client";
import { otkaziPorudzbinu as akcijaOtkazi } from '../../actions/auth';
import { useRouter } from 'next/navigation';

export default function OtkaziPorudzbinuKomponenta({ orderId }) {
  const router = useRouter();

  const handleOtkazi = async () => {
    const res = await akcijaOtkazi(orderId);
    
    if (res.success) {
      router.refresh(); 
    } else {
      alert(res.error || "Došlo je do greške.");
    }
  };

  return (
    <button 
      onClick={handleOtkazi}
      className="text-[10px] font-black uppercase underline decoration-2 hover:text-red-500 transition-colors cursor-pointer ml-4"
    >
      Otkaži porudžbinu
    </button>
  );
}