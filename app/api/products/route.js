import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    
    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error("Greška pri povlačenju proizvoda:", error);
    return NextResponse.json(
      { error: "Došlo je do greške na serveru." }, 
      { status: 500 }
    );
  }
}