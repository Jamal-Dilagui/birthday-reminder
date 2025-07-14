'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function UpcomingBirthdays() {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchUpcomingBirthdays()
    }
  }, [session])

  const fetchUpcomingBirthdays = async () => {
    try {
      const response = await fetch('/api/birthday?userId=' + session.user.id)
      if (response.ok) {
        const data = await response.json()
        const birthdays = data.data || []
        
        // Calculate upcoming birthdays
        const upcoming = birthdays
          .map(birthday => {
            const daysUntil = calculateDaysUntil(new Date(birthday.date))
            return { ...birthday, daysUntil }
          })
          .filter(birthday => birthday.daysUntil <= 30) // Show next 30 days
          .sort((a, b) => a.daysUntil - b.daysUntil)
          .slice(0, 5) // Show top 5 upcoming
        
        setUpcomingBirthdays(upcoming)
      }
    } catch (error) {
      console.error('Error fetching upcoming birthdays:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDaysUntil = (birthdayDate) => {
    const today = new Date()
    const nextBirthday = new Date(birthdayDate)
    
    nextBirthday.setFullYear(today.getFullYear())
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = nextBirthday - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getReminderStatus = (birthday) => {
    if (!birthday.reminderSettings) {
      return { text: 'Reminders disabled', color: 'text-gray-500' }
    }
    
    const daysUntil = birthday.daysUntil
    const notifyBefore = birthday.notifyBeforeDays
    
    if (daysUntil === 0) {
      return { text: '🎉 Birthday today!', color: 'text-green-600 font-semibold' }
    }
    
    if (daysUntil === notifyBefore) {
      return { text: `📅 Reminder will be sent today`, color: 'text-blue-600 font-semibold' }
    }
    
    if (daysUntil < notifyBefore) {
      return { text: `📅 Reminder sent ${notifyBefore - daysUntil} days ago`, color: 'text-gray-600' }
    }
    
    return { text: `📅 Reminder in ${daysUntil - notifyBefore} days`, color: 'text-gray-600' }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-calendar-days"></i>
        Upcoming Birthdays
      </h3>
      
      {upcomingBirthdays.length === 0 ? (
        <div className="text-center py-8">
          <i className="fa-solid fa-calendar-xmark text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500 dark:text-gray-400">No upcoming birthdays in the next 30 days</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingBirthdays.map(birthday => {
            const status = getReminderStatus(birthday)
            return (
              <div key={birthday._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {birthday.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🎂 {formatDate(birthday.date)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      WhatsApp: {birthday.whatsappNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${status.color}`}>
                      {status.text}
                    </div>
                    {birthday.daysUntil === 0 ? (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        TODAY! 🎉
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 mt-1">
                        {birthday.daysUntil} day{birthday.daysUntil !== 1 ? 's' : ''} away
                      </div>
                    )}
                  </div>
                </div>
                
                {birthday.reminderSettings && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Reminder settings:</span>
                      <span>
                        {birthday.notifyBeforeDays === 0 ? 'Same day' :
                         birthday.notifyBeforeDays === 1 ? '1 day before' :
                         birthday.notifyBeforeDays === 7 ? '1 week before' : 'Custom'}
                      </span>
                    </div>
                    {birthday.customMessage && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        "{birthday.customMessage}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-robot"></i>
          Automatic Reminders
        </h4>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Birthday reminders are automatically sent daily at 9:00 AM based on your settings. 
          No manual action required!
        </p>
      </div>
    </div>
  )
} 