import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './components/Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voice Notes App",
  description: "A simple app to record voice notes and convert them to text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
