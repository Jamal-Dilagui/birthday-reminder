'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import EditBirthdayModal from './EditBirthdayModal'

function BirthdayList() {
  const [birthdays, setBirthdays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { data: session } = useSession()
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedBirthday, setSelectedBirthday] = useState(null)

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        if (!session?.user?.id) return
        const response = await fetch(`/api/birthday?userId=${session.user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch birthdays')
        }
        const data = await response.json()
        setBirthdays(data.data || [])
      } catch (err) {
        setError(err.message)
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBirthdays()
  }, [session, birthdays])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this birthday?')) return
    try {
      const response = await fetch(`/api/birthday/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete birthday')
      }
      setBirthdays(birthdays.filter(b => b._id !== id))
      setSuccessMessage('Birhday deleted')
    } catch (err) {
      setError(err.message)
      console.error('Delete error:', err)
    }
  }

  // Open modal and set selected birthday
  const handleEdit = (birthday) => {
    setSelectedBirthday(birthday)
    setEditModalOpen(true)
  }

  // Handle modal save
  const handleEditSave = async (updated) => {
    try {
      const response = await fetch(`/api/birthday/${updated._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updated.name,
          date: updated.date,
          whatsappNumber: updated.whatsappNumber
        })
      })
      if (!response.ok) {
        throw new Error('Failed to update birthday')
      }
      // Update the list
      setBirthdays(birthdays.map(b => b._id === updated._id ? { ...b, ...updated } : b))
      setEditModalOpen(false)
      setSelectedBirthday(null)
      setSuccessMessage('Birthday updated')
    } catch (err) {
      setError(err.message)
      console.error('Edit error:', err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) return (
    <div className="flex-1 w-full md:w-1/2 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="flex-1 w-full md:w-1/2 p-4 text-red-500">
      Error: {error}
    </div>
  )

  return (
    <div className="flex-1 w-full md:w-1/2">
      {successMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
          {successMessage}
        </div>
      )}
      <section aria-label="Birthdays List" className="flex flex-col gap-4 mb-6">
        {birthdays.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
            <p className="text-gray-500 dark:text-gray-300">No birthdays found</p>
            <button 
              onClick={() => router.refresh()}
              className="mt-2 text-blue-500 dark:text-blue-400 hover:underline"
            >
              Refresh
            </button>
          </div>
        ) : (
          birthdays.map(birthday => (
            <div 
              key={birthday._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-between p-4 hover:shadow-lg transition group"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{birthday.name}</span>
                <span className="text-gray-500 dark:text-gray-300 text-sm">
                  🎂 {formatDate(birthday.date)}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  WhatsApp: {birthday.whatsappNumber}
                </span>
              </div>
              <div className="flex gap-3">
                <button 
                  aria-label="Edit"
                  onClick={() => handleEdit(birthday)}
                  className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 p-2 rounded-full transition focus:ring-2 focus:ring-blue-400"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button 
                  aria-label="Delete"
                  onClick={() => handleDelete(birthday._id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 p-2 rounded-full transition focus:ring-2 focus:ring-red-400"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </section>
      <EditBirthdayModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedBirthday(null); }}
        onSubmit={handleEditSave}
        birthday={selectedBirthday}
      />
    </div>
  )
}

export default BirthdayList