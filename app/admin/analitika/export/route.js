import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const proizvodi = await prisma.product.findMany({
        include: {
            category: true
        }
    });
    const csvContent = [
      ["ID", "Naziv", "Lager", "Cena"].join(","),
      ...proizvodi.map(p => [p.id, p.naziv, p.lager, p.cena].join(","))
    ].join("\n");

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="izvestaj-lagera.csv"',
      },
    });

  } catch (error) {
    console.error("Greška pri izvozu:", error);
    return new Response("Greška prilikom generisanja izveštaja", { status: 500 });
  }
}