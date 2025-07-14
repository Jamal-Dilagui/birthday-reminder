'use client'
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react";


function Navbar() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <header className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-4 max-w-6xl mx-auto gap-4">
                <div className="animate-pulse h-10 w-40 bg-gray-200 rounded"></div>
            </header>
        );
      }

  return (
    <>
      <header className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-4 max-w-6xl mx-auto gap-4">
        <div className="flex items-center gap-3">
            <Link href="/">
                <span className="text-3xl text-blue-500 dark:text-blue-300 mr-2"><i className="fa-solid fa-cake-candles" aria-hidden="true"></i></span>
                <span className="text-2xl font-bold tracking-tight">WhatsApp Birthday Reminder</span>
            </Link>
        </div>
        <div className="flex items-center gap-3">
            {!session ? (
                <>
                    <Link href="/login" className="bg-btnBg hover:bg-btnBg-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i className="fa-solid fa-right-to-bracket"></i> Login
                    </Link>
                    <Link href="/register" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i className="fa-solid fa-user-plus"></i> Register
                    </Link>
                </>
            ): (
                <>
                    <span className="px-3 py-1 font-semibold text-blue-700 dark:text-blue-300 border-b-4 border-blue-500 dark:border-blue-300 rounded">
                        Welcome, {session.user.name}
                    </span>
                    <Link href="/dashboard" className="bg-blue hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i className="fa-solid fa-gauge"></i> Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="bg-btnBg hover:bg-btnBg-600 text-white font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none">
                        <i className="fa-solid fa-right-to-bracket"></i> Logout
                    </button>
                </>
            )}
        </div>
      </header>
    </>
  )
}

export default Navbar