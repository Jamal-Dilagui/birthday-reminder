'use client'
import { useState } from 'react'

export default function WhatsAppTest() {
  const [testForm, setTestForm] = useState({
    whatsappNumber: '',
    message: 'Test message from Birthday Reminder app! 🎉'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleTestMessage = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/reminders/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm)
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to send test message')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReminders = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/reminders/send', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to send reminders')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckReminders = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/reminders/send')
      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to check reminders')
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 flex items-center gap-2">
        <i className="fa-brands fa-whatsapp text-green-500"></i>
        WhatsApp Integration Test
      </h2>

      {/* Test Message Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Send Test Message</h3>
        <form onSubmit={handleTestMessage} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={testForm.whatsappNumber}
              onChange={(e) => setTestForm({...testForm, whatsappNumber: e.target.value})}
              placeholder="+1234567890"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Message
            </label>
            <textarea
              value={testForm.message}
              onChange={(e) => setTestForm({...testForm, message: e.target.value})}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg px-4 py-2 transition"
          >
            {loading ? 'Sending...' : 'Send Test Message'}
          </button>
        </form>
      </div>

      {/* Reminder Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Birthday Reminders</h3>
        <div className="flex gap-3">
          <button
            onClick={handleCheckReminders}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg px-4 py-2 transition"
          >
            Check Pending Reminders
          </button>
          <button
            onClick={handleSendReminders}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg px-4 py-2 transition"
          >
            Send All Reminders
          </button>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Result:</h4>
          <pre className="text-sm text-green-600 dark:text-green-400 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Setup Instructions:</h4>
        <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
          <li>• Add WhatsApp API credentials to environment variables</li>
          <li>• Configure WhatsApp Business API or Twilio</li>
          <li>• Test with your own WhatsApp number first</li>
          <li>• Reminders will be sent based on user settings</li>
        </ul>
      </div>
    </div>
  )
} 