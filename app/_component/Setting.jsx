import React from 'react'

function Setting() {
  return (
    <section aria-label="Settings" className="mb-6">
        <details className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <summary className="cursor-pointer font-medium flex items-center gap-2 select-none">
            <i className="fa-solid fa-gear"></i> Settings
            </summary>
            <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="reminder-time" className="font-medium text-sm">Reminder Time</label>
                <input id="reminder-time" name="reminder-time" type="time" className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="message-template" className="font-medium text-sm">Default Message</label>
                <textarea id="message-template" name="message-template" rows="2" className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition resize-none bg-white dark:bg-gray-900 dark:text-gray-100" placeholder="e.g. Happy Birthday, {name}! 🎉"></textarea>
            </div>
            </div>
        </details>
    </section>
  )
}

export default Setting