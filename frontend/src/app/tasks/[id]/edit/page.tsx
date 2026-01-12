'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Task, UpdateTaskDto, Category } from '@/types/task'

export default function EditTask() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<UpdateTaskDto>({})
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getTask(taskId)
        setTask(data)

        // Initialize form data
        setFormData({
          title: data.title,
          description: data.description || '',
          priority: data.priority,
          status: data.status,
          categoryIds: data.categories.map(c => c.id),
        })

        if (data.dueDate) {
          setDueDate(new Date(data.dueDate).toISOString().split('T')[0])
        }

        setError(null)
      } catch (err) {
        setError('Failed to load task')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      loadTask()
    }
  }, [taskId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)

      const submitData = {
        ...formData,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      }

      await apiClient.updateTask(taskId, submitData)
      router.push(`/tasks/${taskId}`)
    } catch (err) {
      setError('Failed to update task')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof UpdateTaskDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    const currentIds = formData.categoryIds || []
    setFormData(prev => ({
      ...prev,
      categoryIds: currentIds.includes(categoryId)
        ? currentIds.filter(id => id !== categoryId)
        : [...currentIds, categoryId]
    }))
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiClient.getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Task not found'}
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/tasks/${taskId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Task
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority *
                </label>
                <select
                  id="priority"
                  value={formData.priority || ''}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  value={formData.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(formData.categoryIds || []).includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-gray-500 text-sm">No categories available. Create some categories first.</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/tasks/${taskId}`}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}