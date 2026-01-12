'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Task, TaskFilters, Category } from '@/types/task'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<TaskFilters>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getTasks(filters)
      setTasks(data)
      setError(null)
    } catch (err) {
      setError('Failed to load tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [filters])

  useEffect(() => {
    loadCategories()
  }, [])

  const handleStatusChange = async (taskId: string, status: 'PENDING' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await apiClient.updateTaskStatus(taskId, { status })
      await loadTasks()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await apiClient.deleteTask(taskId)
      await loadTasks()
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-orange-100 text-orange-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TaskFlow Dashboard</h1>
          <div className="flex gap-2">
            <Link
              href="/categories"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Manage Categories
            </Link>
            <Link
              href="/tasks/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              New Task
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: e.target.value as any || undefined
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priority: e.target.value as any || undefined
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  categoryId: e.target.value || undefined
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found.</p>
              <Link
                href="/tasks/new"
                className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                Create your first task
              </Link>
            </div>
          )}

          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </Link>
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.categories.map((category) => (
                  <span key={category.id} className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {category.name}
                  </span>
                ))}
              </div>

              {task.dueDate && (
                <div className="text-sm text-gray-600 mb-4">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}

              {/* Status Change */}
              <div className="flex gap-2">
                <label className="text-sm font-medium text-gray-700">Change Status:</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
