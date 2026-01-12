'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { generateModalBreadcrumb } from '@/lib/breadcrumb'

interface CategoryModalProps {
  onClose: () => void
  onSave: () => void
}

export default function CategoryModal({ onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    try {
      setLoading(true)
      await apiClient.createCategory({ name: name.trim() })
      setName('')
      onSave()
    } catch (err) {
      console.error('Failed to create category:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Page Indicator */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="font-medium text-gray-900">New Category</span>
          </nav>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Category</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter category name"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-6 py-3 rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}