'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Category } from '@/types/task'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getCategories()
      setCategories(data)
      setError(null)
    } catch (err) {
      setError('Failed to load categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategoryName.trim()) return

    try {
      setCreating(true)
      setError(null)

      await apiClient.createCategory({ name: newCategoryName.trim() })
      setNewCategoryName('')
      await loadCategories()
    } catch (err) {
      setError('Failed to create category')
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? Tasks using this category will be affected.')) return

    try {
      await apiClient.deleteCategory(categoryId)
      await loadCategories()
    } catch (err) {
      setError('Failed to delete category')
      console.error(err)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          </div>
        </div>

        {/* Create Category Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Category</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={creating || !newCategoryName.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {creating ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">All Categories</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No categories found.</p>
              <p className="text-sm text-gray-400 mt-2">Create your first category above.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}