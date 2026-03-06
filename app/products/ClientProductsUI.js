'use client';
import { useState } from 'react';

export default function ClientProductsUI({ products, dodajAction, obrisiAction }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 p-12 font-sans text-black">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase italic">Brend <span className="text-druze-roze">Druže</span> - Inventar</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="h-14 px-8 bg-black text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            {showForm ? 'ZATVORI ×' : 'NOVI PROIZVOD +'}
          </button>
        </div>

        
        {showForm && (
  <form action={(fd) => { dodajAction(fd); setShowForm(false); }} className="mb-12 p-8 bg-white border-4 border-black rounded-[2.5rem] grid grid-cols-2 gap-4 shadow-2xl">
    <input name="naziv" placeholder="Naziv artikla" className="p-4 bg-zinc-100 rounded-2xl outline-none" required />
    <input name="cena" type="number" placeholder="Cena (RSD)" className="p-4 bg-zinc-100 rounded-2xl outline-none" required />
    
   
    <select name="category_id" className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold" required>
      <option value="">Izaberi kategoriju...</option>
      <option value="1">Ceger 👜</option>
      <option value="2">Majica 👕</option>
    </select>

    <input name="lager" type="number" placeholder="Količina" className="p-4 bg-zinc-100 rounded-2xl outline-none" required />
    <textarea name="opis" placeholder="Opis..." className="p-4 bg-zinc-100 rounded-2xl col-span-2" rows="2" />
    
    <button type="submit" className="col-span-2 h-14 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-colors relative z-10 block w-full shadow-lg">
      DODAJ U BAZU 
    </button>
  </form>
)}

        
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-6 bg-white border-2 border-zinc-100 rounded-3xl hover:border-black transition-all shadow-sm">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{p.naziv}</h3>
                <p className="text-zinc-400 text-sm">Lager: {p.lager} kom | ID: #{p.id}</p>
                <p className="text-zinc-600 mt-1">{p.opis}</p>
              </div>
              
              <div className="flex items-center gap-8">
                <span className="text-2xl font-black">{p.cena} RSD</span>
                
               
                <form action={obrisiAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="px-5 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-xs uppercase">
                    Ukloni
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}