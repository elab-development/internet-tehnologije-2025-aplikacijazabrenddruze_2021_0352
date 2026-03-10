import Link from "next/link";

export default function ONama() {
  
  
  const imeTvojeSlike = "pametnoUzivaj.jpg"; 

  return (
    <main className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        
        <section className="flex flex-col gap-6 border-b-4 border-black pb-12">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black">
            Više od <span className="text-[var(--color-druze-roze)]">odeće.</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-zinc-500 uppercase tracking-widest max-w-2xl">
            Ulična moda bez kompromisa. Dizajnirano za one koji diktiraju pravila.
          </p>
        </section>

        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-lg font-medium text-zinc-700">
            <p>
              Priča o <strong className="text-black uppercase">Druže</strong> brendu nastala je na beogradskim ulicama sa jednom jasnom vizijom: stvoriti garderobu koja nije samo komad tkanine, već pečat karaktera. Zaboravi na dosadne krojeve, uniformisanost i pravila koja su drugi pisali.
            </p>
            <p>
              Svaki naš komad je pažljivo dizajniran i napravljen od premium materijala koji izdržavaju puls grada. Mi ne pratimo trendove – mi ih nosimo. Od prvog nacrta u studiju do trenutka kada paket stigne na tvoja vrata, naš fokus je na besprekornom kvalitetu i autentičnosti.
            </p>
            <p className="text-black font-black uppercase tracking-widest mt-4">
              Budi svoj. Budi Druže.
            </p>
          </div>
          
          
          <div className="aspect-[3/4] md:aspect-square border-4 border-black relative overflow-hidden group shadow-[12px_12px_0px_0px_var(--color-druze-roze))]">
            <img 
              src={`/images/${imeTvojeSlike}`} 
              alt="O nama - Druže Streetwear" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" 
            />
          </div>
        </section>

        
        <section className="pt-8 border-t-4 border-black">
          <Link 
            href="/" 
            className="inline-flex h-16 items-center justify-center bg-black px-12 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-[var(--color-druze-roze)] transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2"
          >
            Vrati se na shop
          </Link>
        </section>

      </div>
    </main>
  );
}