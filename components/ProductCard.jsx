import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="group relative border-2 border-zinc-800 bg-white p-4 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Slika proizvoda */}
      <div className="aspect-square w-full overflow-hidden bg-zinc-100 mb-4 border border-zinc-200">
        <img 
          src={product.image_url || "/images/placeholder.jpg"} 
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Informacije o proizvodu */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 leading-none">
            {product.name}
          </h3>
          <p className="text-xs font-bold text-zinc-400 uppercase mt-1">
            {product.category}
          </p>
        </div>
        <p className="text-lg font-bold text-[var(--color-druze-roze)]">
          {product.price} RSD
        </p>
      </div>

      {/* Dugme (Vizuelni deo tvoj brenda) */}
      <button className="mt-4 w-full border-2 border-zinc-800 py-2 font-bold uppercase text-sm hover:bg-zinc-800 hover:text-white transition-all">
        Dodaj u korpu
      </button>
    </div>
  );
}