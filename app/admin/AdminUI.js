'use client';
import { useState } from 'react';
import { obrisiAdminAction, dodajAdminAction } from './actions'; 

export default function AdminUI({ users }) { 
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-start py-20 px-12 bg-white dark:bg-zinc-900 shadow-xl border-x border-zinc-100 dark:border-zinc-800">
      
      <div className="flex flex-col gap-4 w-full border-b pb-8 border-zinc-100 dark:border-zinc-800">
        <h1 className="text-4xl font-black tracking-tighter text-black dark:text-zinc-50 uppercase">
          Brend <span className="text-pink-500">Druže</span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          Admin Panel — Upravljanje administratorima
        </p>
      </div>

      <div className="mt-8 w-full">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="h-14 w-full rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg mb-8"
        >
          {showForm ? 'ZATVORI FORMU ×' : 'DODAJ NOVOG ADMINA +'}
        </button>

        {showForm && (
          <form 
            action={async (fd) => {
              await dodajAdminAction(fd); 
              setShowForm(false);
            }} 
            className="mb-12 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col gap-4"
          >
            <input 
              name="ime_prezime" 
              placeholder="Ime i prezime novog admina" 
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-pink-500 text-black dark:text-white"
              required 
            />
            <button type="submit" className="h-12 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all">
              POTVRDI I DODAJ
            </button>
          </form>
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Aktivni Administratori</h2>
          <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {users.length} Ukupno
          </span>
        </div>

        <div className="grid gap-3 w-full">
          {users.map((user) => (
            <div key={user.id} className="group flex items-center justify-between p-5 border border-zinc-100 rounded-2xl bg-zinc-50/50 hover:bg-white hover:shadow-md transition-all dark:bg-zinc-800/50 dark:border-zinc-700">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                  {user.ime_prezime ? user.ime_prezime[0].toUpperCase() : '?'}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.ime_prezime}</p>
                  <p className="text-xs text-zinc-400 italic font-mono">ID: #{user.id}</p>
                </div>
              </div>

<button 
  onClick={async () => {
    if(confirm(`Da li ste sigurni da želite obrisati admina: ${user.ime_prezime}?`)) {
      await obrisiAdminAction(user.id);
    }
  }}
  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all text-sm font-bold uppercase tracking-tighter"
>
  Ukloni ×
</button>
             
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}