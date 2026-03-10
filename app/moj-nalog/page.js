"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { azurirajProfil } from '../actions/auth';

export default function MojNalogPage() {
    const [korisnik, setKorisnik] = useState(null);
    const [ucitano, setUcitano] = useState(false);
    const [poruka, setPoruka] = useState("");

    useEffect(() => {
        fetch('/api/user-data')
            .then(res => {
                if (!res.ok) throw new Error("Problem sa prijavom");
                return res.json();
            })
            .then(data => {
                setKorisnik(data);
                setUcitano(true);
            })
            .catch(err => console.error(err));
    }, []);

    const handleTelefonChange = (e) => {
        const samoBrojevi = e.target.value.replace(/[^0-9]/g, '');
        setKorisnik({ ...korisnik, kontakt_telefon: samoBrojevi });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setKorisnik({ ...korisnik, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await azurirajProfil(formData);
        if (res.success) {
            setPoruka("Podaci uspešno sačuvani!");
            setTimeout(() => setPoruka(""), 3000);
        }
    };

    if (!ucitano) return <div className="p-16 font-black uppercase tracking-widest text-center">Učitavanje...</div>;

    return (
        <main className="min-h-screen bg-white p-8 md:p-16 text-black font-sans selection:bg-[var(--color-druze-roze)] selection:text-white">
            <div className="max-w-2xl mx-auto border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 italic">
                    Moj <span className="text-[var(--color-druze-roze)]">Profil</span>
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-bold">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Ime i prezime</label>
                        <input 
                            type="text" 
                            name="ime_prezime" 
                            value={korisnik.ime_prezime || ''} 
                            onChange={handleInputChange}
                            className="w-full h-12 border-2 border-black px-4 outline-none focus:bg-zinc-50 font-bold" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Email</label>
                        <input type="email" disabled value={korisnik.email} className="w-full h-12 border-2 border-zinc-200 px-4 bg-zinc-50 text-zinc-400 cursor-not-allowed font-bold" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Adresa za dostavu</label>
                        <input 
                            type="text" 
                            name="adresa" 
                            value={korisnik.adresa || ''} 
                            onChange={handleInputChange}
                            className="w-full h-12 border-2 border-black px-4 outline-none focus:bg-zinc-50 font-bold" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Telefon</label>
                        <input 
                            type="text" 
                            name="kontakt_telefon" 
                            value={korisnik.kontakt_telefon || ''} 
                            onChange={handleTelefonChange}
                            className="w-full h-12 border-2 border-black px-4 outline-none focus:bg-zinc-50 font-bold" 
                        />
                    </div>

                    <div className="flex flex-col gap-1 border-t-2 border-zinc-100 pt-4">
                        <label className="text-[10px] text-[var(--color-druze-roze)] uppercase tracking-widest font-black">Nova lozinka (ostavi prazno ako ne menjaš)</label>
                        <input type="password" name="password" className="w-full h-12 border-2 border-black px-4 outline-none focus:bg-zinc-50 font-bold" />
                    </div>

                    {poruka && (
                        <p className="text-white bg-black p-2 text-center uppercase text-[10px] font-black tracking-widest animate-pulse">
                            {poruka}
                        </p>
                    )}

                    <div className="flex flex-col gap-4 mt-4">
                        <button type="submit" className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-[var(--color-druze-roze)] hover:text-black transition-all border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer">
                            Sačuvaj izmene
                        </button>
                        <Link href="/moj-nalog/istorija" className="w-full text-center py-4 border-2 border-black font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
                            Istorija porudžbina
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}