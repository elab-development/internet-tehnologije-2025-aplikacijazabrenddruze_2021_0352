"use server";

import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function loginAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  let putanjaZaRedirect = '';

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { error: 'Korisnik ne postoji.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: 'Pogrešna šifra.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('korisnik_id', user.id.toString(), { httpOnly: true });
    cookieStore.set('user_role', user.uloga, { httpOnly: true });
    
    if (user.uloga === 'admin') {
      putanjaZaRedirect = '/products';
    } else {
      putanjaZaRedirect = '/'; 
    }

  } catch (error) {
    console.error("Login error:", error);
    return { error: 'Greška na serveru.' };
  }

  if (putanjaZaRedirect) {
    redirect(putanjaZaRedirect);
  }
}

export async function registrujKorisnika(formData) {
  const ime_prezime = formData.get('ime_prezime');
  const email = formData.get('email');
  const password = formData.get('password');
  const adresa = formData.get('adresa');
  const kontakt_telefon = formData.get('kontakt_telefon');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.user.create({
      data: {
        ime_prezime: ime_prezime,
        email: email,
        password: hashedPassword,
        uloga: 'kupac',
        adresa: adresa,
        kontakt_telefon: kontakt_telefon
      }
    });
  } catch (error) {
    console.error("Greška pri registraciji:", error);
  } 

  redirect('/login');
}

export async function azurirajProfil(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return { error: "Niste ulogovani." };

  try {
    const ime = formData.get('ime_prezime');
    const adresa = formData.get('adresa');
    const telefon = formData.get('kontakt_telefon');

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        ime_prezime: ime,
        adresa: adresa,
        kontakt_telefon: telefon
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Greška pri ažuriranju profila:", error);
    return { error: "Neuspešno čuvanje podataka." };
  }
}


export async function kreirajPorudzbinu(total, cartItems, formData) {
  try {
    const cookieStore = await cookies();
    const korisnikIdStr = cookieStore.get('korisnik_id')?.value;

    if (!korisnikIdStr) {
      return { success: false, error: "Niste ulogovani." };
    }

    const korisnikId = parseInt(korisnikIdStr);

    await prisma.order.create({
      data: {
        ukupna_cena: total,
        status: "na čekanju",
        user: {
          connect: { id: korisnikId }
        },
        order_items: {
          create: cartItems.map((item) => ({
            product_id: item.id,
            kolicina: item.kolicina,
            cena_komad: item.cena
          }))
        }
      }
    });

    return { success: true };

  } catch (error) {
    console.error("Greška pri kreiranju porudžbine:", error);
    return { success: false, error: "Greška na serveru prilikom čuvanja porudžbine." };
  }
}

export async function otkaziPorudzbinu(orderId) {
  try {
    const cookieStore = await cookies();
    const korisnikIdStr = cookieStore.get('korisnik_id')?.value;

    if (!korisnikIdStr) {
      return { success: false, error: "Niste ulogovani." };
    }

    const korisnikId = parseInt(korisnikIdStr);

    const porudzbina = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!porudzbina || porudzbina.user_id !== korisnikId) {
      return { success: false, error: "Nemate pravo da otkažete ovu porudžbinu." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'otkazano' }
    });

    return { success: true };

  } catch (error) {
    console.error("Greška pri otkazivanju porudžbine:", error);
    return { success: false, error: "Greška na serveru prilikom otkazivanja." };
  }
}

import { revalidatePath } from 'next/cache';

export async function promeniStatusPorudzbineAction(formData) {
  const id = parseInt(formData.get('id'));
  const siroviStatus = formData.get('status');
  
  const noviStatus = siroviStatus ? siroviStatus.toString().trim().toLowerCase() : "";

  try {
    const porudzbina = await prisma.order.findUnique({
      where: { id: id },
      include: { order_items: true }
    });

    if (!porudzbina) {
      console.log(" Porudžbina nije nađena u bazi.");
      return;
    }

    const trenutniStatus = porudzbina.status.trim().toLowerCase();

    if (noviStatus === 'poslato' && trenutniStatus !== 'poslato') {

      
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: id },
          data: { status: 'poslato' }
        });

        for (const stavka of porudzbina.order_items) {
          await tx.product.update({
            where: { id: stavka.product_id },
            data: {
              lager: {
                decrement: stavka.kolicina
              }
            }
          });
        }
      });
    } else {
      await prisma.order.update({
        where: { id: id },
        data: { status: noviStatus }
      });
    }

    revalidatePath('/admin/porudzbine');
    
  } catch (error) {
    console.error(" GREŠKA U TRANSAKCIJI:", error);
  }
}