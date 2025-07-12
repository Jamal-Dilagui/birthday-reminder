'use client'
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            });

            if (result.error) {
                setError(result.error);
                return;
            }
            router.replace("/dashboard");
        } catch (error) {
            setError("An unexpected error occurred");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-1 flex-col items-center justify-center min-h-screen p-4">
            <section className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl text-blue-400">
                        <i className="fa-solid fa-cake-candles"></i>
                    </span>
                    <h2 className="text-xl font-bold">Welcome Back</h2>
                    <p className="text-gray-500 text-center">Sign in to your Birthday Reminder</p>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-medium text-sm">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@email.com"
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-medium text-sm">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition"
                        />
                    </div>
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
                                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:underline font-medium">
                        Register
                    </Link>
                </div>
            </section>
        </main>
    );
}