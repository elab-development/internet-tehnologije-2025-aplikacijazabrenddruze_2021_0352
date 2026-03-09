import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="group relative border-2 border-zinc-800 bg-white p-4 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square w-full overflow-hidden bg-zinc-100 mb-4 border border-zinc-200 cursor-pointer relative">
          <img 
            src={product.image_url || "/images/placeholder.jpg"} 
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="bg-zinc-900 text-white px-4 py-2 text-xs font-black uppercase tracking-tighter">
               Pogledaj detalje
             </span>
          </div>
        </div>
      </Link>

      <div className="flex justify-between items-start">
        <div className="flex-1 mr-2">

          <Link href={`/products/${product.id}`}>
            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-800 leading-none hover:text-[var(--color-druze-roze)] transition-colors cursor-pointer break-words">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1 tracking-widest">
            {product.category}
          </p>
        </div>
        <p className="text-lg font-black text-[var(--color-druze-roze)] whitespace-nowrap">
          {product.price} RSD
        </p>
      </div>

    
    </div>
  );
}