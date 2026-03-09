import { cookies } from 'next/headers';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import CartCounter from './CartCounter';

export default async function Navbar() {
  const cookieStore = await cookies();
  const ulogovan = cookieStore.has('korisnik_id');

  return (
    <nav className="w-full h-20 border-b-2 border-black bg-white px-8 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
        <span className="text-[var(--color-druze-roze)]"> DRUŽE</span>
      </Link>

      <div className="flex gap-8 items-center text-sm font-bold uppercase text-zinc-800">
        <Link href="/cart" className="hover:text-[var(--color-druze-roze)] transition-colors flex items-center gap-1">
          Moja korpa <CartCounter />
        </Link>
        
        <Link href="/onama" className="hover:text-[var(--color-druze-roze)] transition-colors">
          O nama
        </Link>

        {ulogovan ? (
          <>
            <Link href="/moj-nalog" className="hover:text-[var(--color-druze-roze)] transition-colors">
              Moj nalog
            </Link>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all">
            Prijava
          </Link>
        )}
      </div>
    </nav>
  );
}