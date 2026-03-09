import mysql from 'mysql2/promise';
import Link from "next/link";

export default async function AnalitikaPanel() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'roottam1',
    database: process.env.DB_NAME || 'druze_shop'
  });


  const [prihodZarada] = await connection.execute('SELECT SUM(ukupna_cena) as total, COUNT(id) as broj_porudzbina FROM orders WHERE status != "otkazano"');
  const ukupanPrihod = prihodZarada[0].total || 0;
  const brojPorudzbina = prihodZarada[0].broj_porudzbina || 0;

 
  const [proizvodi] = await connection.execute(`
    SELECT p.naziv, COALESCE(SUM(oi.kolicina), 0) as prodato
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY prodato DESC
    LIMIT 5
  `);
  await connection.end();

  
  const maxProdato = Math.max(...proizvodi.map(p => Number(p.prodato)), 1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-5xl flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        
        <div className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
              Biznis <span className="text-[var(--color-druze-roze)]">Analitika</span>
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Dashboard prodaje i popularnosti
            </p>
          </div>
          
         
          <a 
            href="/admin/analitika/export" 
            className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-druze-roze)] hover:bg-[var(--color-druze-roze)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            ↓ Preuzmi Izveštaj (CSV)
          </a>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border-4 border-black p-8 bg-zinc-50 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Ukupan Prihod</p>
            <p className="text-5xl font-black text-[var(--color-druze-roze)]">{ukupanPrihod} <span className="text-2xl text-black">RSD</span></p>
          </div>
          <div className="border-4 border-black p-8 bg-zinc-50 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Uspešne Porudžbine</p>
            <p className="text-5xl font-black text-black">{brojPorudzbina}</p>
          </div>
        </div>

       
        <div className="w-full border-2 border-zinc-100 p-8">
          <h2 className="text-xl font-bold uppercase tracking-tighter mb-8">Top 5 Proizvoda</h2>
          <div className="flex flex-col gap-6">
            {proizvodi.map((proizvod, index) => {
              const procenat = (Number(proizvod.prodato) / maxProdato) * 100;
              return (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold uppercase text-zinc-600">
                    <span>{proizvod.naziv}</span>
                    <span>{proizvod.prodato} komada</span>
                  </div>
                  
                  <div className="w-full h-6 bg-zinc-100 relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-black transition-all duration-1000"
                      style={{ width: `${procenat}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 pt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors">
            ← Nazad na Admin Panel
          </Link>
        </div>

      </main>
    </div>
  );
}