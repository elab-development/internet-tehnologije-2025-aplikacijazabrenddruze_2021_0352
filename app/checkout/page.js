"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { kreirajPorudzbinu } from '../actions/auth';

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ime_prezime: '',
        adresa: '',
        grad: '',
        postanski_broj: '',
        kontakt_telefon: ''
    });
    const router = useRouter();

    useEffect(() => {
        const sacuvanaKorpa = localStorage.getItem('druze_korpa');
        if (sacuvanaKorpa) {
            const items = JSON.parse(sacuvanaKorpa);
            setCartItems(items);
            setTotal(items.reduce((acc, item) => acc + item.cena * item.kolicina, 0));
        } else {
            router.push('/cart');
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/user-data');
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        ime_prezime: data.ime_prezime || '',
                        adresa: data.adresa || '',
                        kontakt_telefon: data.kontakt_telefon || ''
                    }));
                }
            } catch (error) {
                console.error("Greška pri povlačenju podataka korisnika", error);
            }
        };

        fetchUserData();
    }, [router]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePotvrda = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await kreirajPorudzbinu(total, cartItems, formData);

        if (res.success) {
            localStorage.removeItem('druze_korpa');
            window.dispatchEvent(new Event('korpa_azurirana'));
            router.push('/moj-nalog/istorija');
        } else {
            alert("Greška: " + res.error);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white p-6 md:p-16 text-black font-sans">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-12 leading-none">
                    Podaci za <span className="text-[var(--color-druze-roze)]">Isporuku</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <form onSubmit={handlePotvrda} className="space-y-6">
                        <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                            <h2 className="font-black uppercase tracking-widest text-xs mb-8 border-b-2 border-black pb-2">Informacije o dostavi</h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Ime i Prezime</label>
                                    <input
                                        type="text" name="ime_prezime" value={formData.ime_prezime} required onChange={handleInputChange}
                                        className="w-full border-2 border-black p-3 font-bold uppercase text-xs focus:bg-zinc-50 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Ulica i broj</label>
                                    <input
                                        type="text" name="adresa" value={formData.adresa} required onChange={handleInputChange}
                                        className="w-full border-2 border-black p-3 font-bold uppercase text-xs focus:bg-zinc-50 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Grad</label>
                                        <input
                                            type="text" name="grad" value={formData.grad} required onChange={handleInputChange}
                                            className="w-full border-2 border-black p-3 font-bold uppercase text-xs focus:bg-zinc-50 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Poštanski broj</label>
                                        <input
                                            type="text" name="postanski_broj" value={formData.postanski_broj} required onChange={handleInputChange}
                                            className="w-full border-2 border-black p-3 font-bold uppercase text-xs focus:bg-zinc-50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest block mb-1">Telefon</label>
                                    <input
                                        type="text" name="kontakt_telefon" value={formData.kontakt_telefon} required onChange={handleInputChange}
                                        className="w-full border-2 border-black p-3 font-bold uppercase text-xs focus:bg-zinc-50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-[var(--color-druze-roze)] font-black uppercase tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-black active:text-white cursor-pointer"
                        >
                            {loading ? 'Slanje...' : 'Potvrdi i Poruči'}
                        </button>
                    </form>

                    <div className="space-y-6">
                        <div className="border-4 border-black p-8 bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="font-black uppercase tracking-widest text-xs mb-8 border-b-2 border-black pb-2">Vaša korpa</h2>
                            <div className="space-y-4 mb-10">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs font-black uppercase border-b border-zinc-200 pb-2">
                                        <span className="max-w-[180px]">{item.naziv} ({item.velicina}) <span className="text-zinc-400">x{item.kolicina}</span></span>
                                        <span className="tracking-tighter">{item.cena * item.kolicina} RSD</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-end border-t-4 border-black pt-4">
                                <span className="font-black uppercase tracking-tighter text-xl italic">Ukupno:</span>
                                <span className="font-black text-3xl tracking-tighter">{total} RSD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}