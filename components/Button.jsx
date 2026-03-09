import Button from './Button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">

      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">
          Brend <span className="text-[var(--color-druze-roze)]">Druže</span>
        </h1>

        <p className="text-zinc-500 mb-8 font-medium">
          Urbana kultura, unikatna grafika i kvalitetni materijali.
          Pronađi svoju novu omiljenu majicu ili ekološki ceger.
        </p>


        <Button href="/shop" text="VIDI PROIZVODE" />
      </div>

    </main>
  );
}