import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import OtkaziPorudzbinuKomponenta from './otkaziPorudzbinu';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function IstorijaPorudzbinaPage() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get('korisnik_id')?.value;

  if (!userIdStr) redirect('/login');
  
  const userId = parseInt(userIdStr);

  const prismaOrders = await prisma.order.findMany({
    where: { 
      user_id: userId 
    },
    include: {
      order_items: {
        include: {
          product: true 
        }
      }
    },
    orderBy: {
      datum: 'desc'
    }
  });

  const orders = prismaOrders.map(order => {
    const lista_proizvoda = order.order_items
      .map(item => `${item.product?.naziv} x${item.kolicina}`)
      .join(', ');

    return {
      id: order.id,
      ukupna_cena: order.ukupna_cena,
      status: order.status,
      datum: order.datum,
      lista_proizvoda: lista_proizvoda !== "" ? lista_proizvoda : null
    };
  });

  return (
    <main className="min-h-screen bg-white p-6 md:p-16 text-black font-sans selection:bg-[var(--color-druze-roze)] selection:text-white">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/moj-nalog" className="text-[10px] font-black uppercase tracking-widest mb-10 inline-block hover:text-[var(--color-druze-roze)] transition-colors border-b-2 border-black pb-1">
          ← Nazad na profil
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
            Moje <span className="text-[var(--color-druze-roze)]">Porudžbine</span>
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="border-4 border-black p-12 text-center bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black uppercase tracking-widest text-zinc-400 text-xs text-center">
              Još uvek niste ništa naručili.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map((order) => (
              <div key={order.id} className="group relative border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                
                <span className="absolute top-4 right-4 text-[9px] font-bold text-zinc-300 uppercase tracking-tighter">
                  #00{order.id}
                </span>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-tight mb-2 pr-12 leading-tight">
                      {order.lista_proizvoda || "Narudžbina bez stavki"}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                      <span>{new Date(order.datum).toLocaleDateString('sr-RS')}</span>
                      <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                      <span className="italic lowercase font-medium">
                        {new Date(order.datum).toLocaleTimeString('sr-RS', { hour: 'numeric', minute: '2-digit' })} h
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 border-t-2 md:border-t-0 border-zinc-100 pt-4 md:pt-0">
                    <p className="font-black text-2xl tracking-tighter leading-none italic">
                      {Number(order.ukupna_cena).toLocaleString('sr-RS')} <span className="text-xs not-italic">RSD</span>
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 text-[9px] font-black uppercase border-2 border-black tracking-widest ${
                        order.status === 'na obradi' ? 'bg-yellow-300' : 
                        order.status === 'otkazano' ? 'bg-red-500 text-white' : 'bg-green-400'
                      }`}>
                        {order.status}
                      </div>

                      {order.status === 'na čekanju' && (
                        <OtkaziPorudzbinuKomponenta orderId={order.id} />
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}