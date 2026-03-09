"use client";
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        localStorage.removeItem('druze_korpa');

        await fetch('/api/logout', { method: 'POST' });

        router.push('/');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-red-600 transition-all cursor-pointer"
        >
            Odjavi se
        </button>
    );
}