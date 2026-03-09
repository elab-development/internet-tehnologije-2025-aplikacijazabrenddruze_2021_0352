import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('korisnik_id');
  cookieStore.delete('korisnik_uloga');
  return NextResponse.json({ success: true });
}