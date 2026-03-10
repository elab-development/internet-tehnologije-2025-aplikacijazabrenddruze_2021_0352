# Brend Druže - E-commerce Platforma 

Projekat za razvoj web aplikacija. Sistem podržava prodaju cegera i majica sa kompletnim admin panelom.

##  Tehnologije
- *Frontend:* Next.js (App Router), Tailwind CSS
- *Backend:* Next.js Server Actions & API Routes
- *Baza podataka:* PostgreSQL via Prisma ORM
- *Kontejnerizacija:* Docker

##  Tipovi Korisnika (RBAC)
U sistemu su implementirana 3 tipa korisnika:
1. *Admin:* Pun pristup dashboardu i izmenama lagera.
2. *Kupac:* Mogućnost kupovine i pregleda porudžbina.
3. *Gost:* Specijalna uloga za ograničen pristup (implementirano u bazi).

##  Pokretanje Projekta
1. Instalacija paketa: npm install
2. Pokretanje baze: docker-compose up -d
3. Sinhronizacija baze: npx prisma db push
4. Pokretanje aplikacije: npm run dev

##  API Dokumentacija
Dokumentacija je dostupna na ruti: /admin/docs (Swagger UI).