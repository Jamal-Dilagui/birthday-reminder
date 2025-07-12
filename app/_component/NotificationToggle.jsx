import React from 'react'

function NotificationToggle() {
  return (
     <section aria-label="Notification Toggle" className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 transition-all">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <i className="fa-brands fa-whatsapp text-green-500 text-xl" aria-hidden="true"></i>
            <span className="font-medium">WhatsApp Reminders</span>
            </div>
            <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" aria-label="Enable WhatsApp Reminders" />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
            <div className="absolute ml-1 mt-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow transform peer-checked:translate-x-5 transition-all"></div>
            </label>
        </div>
    </section>
  )
}

export default NotificationToggle