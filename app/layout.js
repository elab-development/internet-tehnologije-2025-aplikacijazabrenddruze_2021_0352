import  { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Brend Druže | Streetwear & Bags",
  description: "Unikatne majice i cegeri - lokalni brend Druže.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="antialiased bg-white">
        <Navbar /> 
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}