import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/Navbar";
import Footer from "./_component/Footer";
import SessionProviderWrapper from "./_component/SessionProviderWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className="bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300"
      >
        <SessionProviderWrapper>
          <Navbar/>
          {children}
          <Footer/>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
