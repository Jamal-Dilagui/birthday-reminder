import Link from "next/link";


export default function Home() {
  return (
     <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
    {/* <!-- Hero Section --> */}
    <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 py-12">
      <div className="flex-1 flex flex-col items-start gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-blue-600 dark:text-blue-300 mb-2">Never Forget a Birthday Again!</h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-4">Get WhatsApp reminders for your friends and family birthdays, so you can always celebrate together.</p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="bg-btnBg hover:bg-btnBg-600 text-white font-semibold rounded-lg px-6 py-3 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg">
            <i className="fa-solid fa-right-to-bracket"></i> Get started
          </Link>
          {/* <Link href="register.html" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg px-6 py-3 flex items-center gap-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg">
            <i className="fa-solid fa-user-plus"></i> Register
          </Link> */}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg p-8 flex flex-col items-center h-60 justify-center">
          <i className="fa-solid fa-cake-candles text-7xl text-pink-400 mb-4 animate-bounce"></i>
          <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">Birthday Reminders</span>
        </div>
      </div>
    </section>
    {/* <!-- About Section --> */}
    <section className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 mt-8">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300 mb-2 flex items-center gap-2"><i className="fa-solid fa-info-circle"></i> About the App</h2>
      <p className="text-gray-600 dark:text-gray-200 text-center max-w-2xl text-lg">WhatsApp Birthday Reminder helps you keep track of your loved ones&apos; birthdays and sends you timely reminders via WhatsApp. Add birthdays, customize your reminder message, and never miss a special day again. Designed for simplicity, privacy, and a delightful user experience.</p>
    </section>
  </main>
  );
}
