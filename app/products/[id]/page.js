import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from 'next/link';
import DodajUKorpu from '@/components/DodajUKorpu'; 

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function SingleProductPage({ params }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const product = await prisma.product.findUnique({
        where: { id: id },
    });

    if (!product) {
        return <div className="p-10 text-center">Proizvod nije pronađen.</div>;
    }

    const cenaZaPrikaz = Number(product.cena);

    return (
        <main className="min-h-screen bg-white text-black font-sans selection:bg-[var(--color-druze-roze)] selection:text-white">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                
                <Link href="/products" className="text-zinc-400 hover:text-black mb-10 inline-block font-bold uppercase tracking-widest text-[10px]">
                    ← Nazad na sve proizvode
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-start">
                    
                    <div className="bg-zinc-100 aspect-square rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-200">
                        <img 
                            src={product.slika_url || "/images/placeholder.jpg"} 
                            alt={product.naziv}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div className="flex flex-col pt-2 max-w-sm">
                        <span className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-[9px] mb-4 italic">
                            Brend Druže / Kolekcija 2026.
                        </span>

                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4 text-zinc-950">
                            {product.naziv && product.naziv.split(" ").map((word, index) => {
                                if (word.toLowerCase().includes("druže")) {
                                    return (
                                        <span key={index} className="text-[var(--color-druze-roze)]">
                                            {word}{" "}
                                        </span>
                                    );
                                }
                                return word + " ";
                            })}
                        </h1>

                        <p className="text-2xl font-black text-[var(--color-druze-roze)] mb-8 tracking-tight">
                            {cenaZaPrikaz} RSD
                        </p>

                        <div className="border-t-2 border-black pt-8 space-y-10">
                            <div>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3 italic">
                                    Opis proizvoda:
                                </h3>
                                <p className="text-base text-zinc-800 leading-relaxed font-medium italic">
                                    {product.opis || "Kvalitetan pamučni materijal sa unikatnim 'Druže' printom."}
                                </p>
                            </div>


                            <DodajUKorpu proizvod={{...product, cena: cenaZaPrikaz}} />
                            
                           
                        </div>
                    </div>
                </div>
            </div>
        </main> 
    );
}