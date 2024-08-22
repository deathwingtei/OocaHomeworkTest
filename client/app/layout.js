import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ooca Shop Test",
  description: "Ooca Shop TestBefor Interview",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
