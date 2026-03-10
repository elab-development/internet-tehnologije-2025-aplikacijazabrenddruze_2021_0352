import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { 
        id: parseInt(userId) 
      },
      select: {
        ime_prezime: true,
        email: true,
        adresa: true,
        kontakt_telefon: true
      }
    });

    return NextResponse.json(user || {});
  } catch (error) {
    console.error("Greška pri dohvatanju podataka:", error);
    return NextResponse.json({ error: "Greška sa bazom" }, { status: 500 });
  }
}