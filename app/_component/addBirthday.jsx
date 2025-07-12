'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function AddBirthday() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { data: session } = useSession()
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    whatsapp: '',
    reminderSettings: true,
    notifyBeforeDays: 0,
    reminderTime: '09:00',
    customMessage: 'Happy Birthday, {name}! 🎉'
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const userId = session?.user?.id

    try {
      // Basic validation
      if (!formData.name || !formData.date || !formData.whatsapp) {
        throw new Error('Please fill all required fields')
      }

      // WhatsApp number validation
      if (!/^\+[1-9]\d{1,14}$/.test(formData.whatsapp)) {
        throw new Error('Please enter a valid WhatsApp number starting with +')
      }

      const response = await fetch('/api/birthday', { // Changed to plural
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date,
          whatsappNumber: formData.whatsapp,
          userId,
          reminderSettings: formData.reminderSettings,
          notifyBeforeDays: formData.notifyBeforeDays,
          reminderTime: formData.reminderTime,
          customMessage: formData.customMessage
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add birthday')
      }

      // Reset form on success
      setFormData({
        name: '',
        date: '',
        whatsapp: '',
        reminderSettings: true,
        notifyBeforeDays: 0,
        reminderTime: '09:00',
        customMessage: 'Happy Birthday, {name}! 🎉'
      })
      
      setSuccessMessage('Birthday added')
      router.refresh()

    } catch (error) {
      setError(error.message)
      console.error('Add birthday error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section aria-label="Add Birthday" className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-all">
      <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
        {/* Birthday Info */}
        <section aria-label="birthdayInfo" className="mb-6">
          <summary className="cursor-pointer font-medium flex items-center gap-2 select-none">
            <i className="fa-solid fa-info"></i> Settings
          </summary>
          <div className="mt-4 flex flex-col gap-1">
            <label htmlFor="name" className="font-medium text-sm">Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              placeholder="e.g. John Doe" 
              className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="font-medium text-sm">Birthday</label>
            <input 
              id="date" 
              name="date" 
              type="date" 
              required 
              className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100" 
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="whatsapp" className="font-medium text-sm">WhatsApp Number</label>
            <input 
              id="whatsapp" 
              name="whatsapp" 
              type="tel" 
              required 
              placeholder="e.g. +1234567890" 
              className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100" 
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Settings */}
        <section aria-label="Settings" className="mb-6">
          <details className="bg-white dark:bg-gray-700 rounded-xl shadow p-4">
            <summary className="cursor-pointer font-medium flex items-center gap-2 select-none">
              <i className="fa-solid fa-gear"></i> Settings
            </summary>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="notifyBeforeDays" className="font-medium text-sm">Remind Before</label>
                <select
                  id="notifyBeforeDays"
                  name="notifyBeforeDays"
                  value={formData.notifyBeforeDays}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="0">On the day</option>
                  <option value="1">1 day before</option>
                  <option value="7">1 week before</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="reminderTime" className="font-medium text-sm">Reminder Time</label>
                <input 
                  id="reminderTime" 
                  name="reminderTime" 
                  type="time" 
                  className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition bg-white dark:bg-gray-900 dark:text-gray-100" 
                  value={formData.reminderTime}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="customMessage" className="font-medium text-sm">Custom Message</label>
                <textarea 
                  id="customMessage" 
                  name="customMessage" 
                  rows="2" 
                  className="rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 px-3 py-2 outline-none transition resize-none bg-white dark:bg-gray-900 dark:text-gray-100" 
                  placeholder="e.g. Happy Birthday, {name}! 🎉"
                  value={formData.customMessage}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </details>
        </section>

        {/* Reminder Toggle */}
        <section aria-label="Notification Toggle" className="bg-white dark:bg-gray-700 rounded-xl shadow p-4 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fa-brands fa-whatsapp text-green-500 text-xl" aria-hidden="true"></i>
              <span className="font-medium">WhatsApp Reminders</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="reminderSettings"
                className="sr-only peer" 
                checked={formData.reminderSettings}
                onChange={handleChange}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-500 transition-all">
                <div className={`absolute top-[2px] left-[2px] bg-white dark:bg-gray-900 rounded-full h-5 w-5 transition-transform ${formData.reminderSettings ? 'translate-x-5' : ''}`}></div>
              </div>
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-center gap-2 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              Add Birthday
            </>
          )}
        </button>
      </form>
      {successMessage && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
    </section>
  )
}

export default AddBirthday