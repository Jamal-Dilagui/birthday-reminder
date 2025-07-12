'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsappNumber: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            // throw new Error(data.message || 'Registration failed');
            console.log("Error not ok: ", data.message)
            setError(data.message)
        } else {
            router.push('/login');
        }

        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-1 flex-col items-center justify-center min-h-screen">
            <section className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl text-blue-400"><i className="fa-solid fa-cake-candles"></i></span>
                    <h2 className="text-xl font-bold">Create Account</h2>
                    <p className="text-gray-500 text-center">Register for Birthday Reminders</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="font-medium text-sm">Name</label>
                        <input 
                            onChange={handleChange}
                            value={formData.name}
                            id="name" 
                            name="name" 
                            type="text" 
                            required 
                            placeholder="Your Name" 
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition" 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium text-sm">Email</label>
                        <input 
                            onChange={handleChange}
                            value={formData.email}
                            id="email" 
                            name="email" 
                            type="email" 
                            required 
                            placeholder="you@email.com" 
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition" 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="whatsappNumber" className="font-medium text-sm">Whatsapp Number</label>
                        <input 
                            onChange={handleChange}
                            value={formData.whatsappNumber}
                            id="whatsappNumber" 
                            name="whatsappNumber" 
                            type="tel"  // Changed from number to tel for better phone number handling
                            required 
                            placeholder="+212 678965412" 
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition" 
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-medium text-sm">Password</label>
                        <input 
                            onChange={handleChange}
                            value={formData.password}
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition" 
                        />
                    </div>
                    {error && (
                        <div className={`p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400`} role="alert">
                            <span className="font-medium">Error!</span> {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`mt-2 bg-btnBg hover:bg-btnBg-600 text-white font-semibold rounded-lg py-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-center gap-2 ${
                            isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-arrow-right-to-bracket"></i> Register
                            </>
                        )}
                    </button>
                </form>
                <div className="text-center text-sm text-gray-500">
                    Already have an account?
                    <Link href="/login" className="text-blue hover:underline font-medium ml-1">Login</Link>
                </div>
            </section>
        </main>
    )
}