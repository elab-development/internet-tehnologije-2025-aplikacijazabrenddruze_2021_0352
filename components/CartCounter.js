"use client";
import { useState, useEffect } from 'react';

export default function CartCounter() {
  const [broj, setBroj] = useState(0);

  const osvezi = () => {
    const korpa = JSON.parse(localStorage.getItem('druze_korpa')) || [];
    const ukupno = korpa.reduce((acc, item) => acc + item.kolicina, 0);
    setBroj(ukupno);
  };

  useEffect(() => {
    osvezi();
    window.addEventListener('korpa_azurirana', osvezi);
    return () => window.removeEventListener('korpa_azurirana', osvezi);
  }, []);

  return <span>({broj})</span>;
}