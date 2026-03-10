'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function dodajAdminAction(formData) {
  const ime_prezime = formData.get('ime_prezime');
  const email = formData.get('email');
  const password = formData.get('password');
  const adresa = formData.get('adresa'); 
  const kontakt_telefon = formData.get('kontakt_telefon'); 

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      ime_prezime: ime_prezime,
      email: email,
      password: hashedPassword,
      uloga: 'admin',
      adresa: adresa,
      kontakt_telefon: kontakt_telefon
    }
  });

  revalidatePath('/admin');
  redirect('/admin');
}

export async function obrisiAdminAction(formData) {
  const id = parseInt(formData.get('id')); 

  await prisma.user.delete({
    where: { id: id }
  });
  
  revalidatePath('/admin');
}

export async function obrisiKorisnikaAction(formData) {
  const id = parseInt(formData.get('id')); 

  await prisma.user.delete({
    where: { id: id }
  });
  
  revalidatePath('/admin/korisnici');
}

export async function promeniStatusPorudzbineAction(formData) {
  const id = parseInt(formData.get('id'));
  const noviStatus = formData.get('status').trim(); 

  try {
    const porudzbina = await prisma.order.findUnique({
      where: { id: id },
      include: { order_items: true }
    });

    if (!porudzbina) {
      console.error("Porudžbina nije pronađena.");
      return;
    }

    if (noviStatus === 'poslato' && porudzbina.status !== 'poslato') {
      
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: id },
          data: { status: noviStatus }
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
    console.error("Greška pri promeni statusa i skidanju sa lagera:", error);
  }
}