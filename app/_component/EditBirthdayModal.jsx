import React, { useState, useEffect } from 'react';

export default function EditBirthdayModal({ open, onClose, onSubmit, birthday }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    whatsappNumber: '',
    reminderSettings: true,
    notifyBeforeDays: 0,
    reminderTime: '09:00',
    customMessage: ''
  });

  useEffect(() => {
    if (birthday) {
      setForm({
        name: birthday.name || '',
        date: birthday.date ? birthday.date.slice(0, 10) : '',
        whatsappNumber: birthday.whatsappNumber || '',
        reminderSettings: birthday.reminderSettings !== undefined ? birthday.reminderSettings : true,
        notifyBeforeDays: birthday.notifyBeforeDays !== undefined ? birthday.notifyBeforeDays : 0,
        reminderTime: birthday.reminderTime || '09:00',
        customMessage: birthday.customMessage || ''
      });
    }
  }, [birthday]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, _id: birthday._id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md border border-blue-100 dark:border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Edit Birthday</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">WhatsApp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="reminderSettings"
              checked={form.reminderSettings}
              onChange={handleChange}
              id="reminderSettings"
              className="accent-blue-500 h-4 w-4 rounded"
            />
            <label htmlFor="reminderSettings" className="text-sm text-gray-700 dark:text-gray-200">Enable Reminder</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Notify Before</label>
            <select
              name="notifyBeforeDays"
              value={form.notifyBeforeDays}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            >
              <option value={0}>Same day</option>
              <option value={1}>1 day before</option>
              <option value={7}>1 week before</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Reminder Time</label>
            <input
              type="time"
              name="reminderTime"
              value={form.reminderTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Custom Message</label>
            <textarea
              name="customMessage"
              value={form.customMessage}
              onChange={handleChange}
              rows={2}
              maxLength={200}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition shadow focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 