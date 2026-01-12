'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api'
import { Task } from '@/types/task'

export default function TaskDetail() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const taskId = params.id as string

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getTask(taskId)
        setTask(data)
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

  const handleStatusChange = async (status: 'PENDING' | 'IN_PROGRESS' | 'DONE') => {
    if (!task) return

    try {
      await apiClient.updateTaskStatus(task.id, { status })
      setTask(prev => prev ? { ...prev, status } : null)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleDelete = async () => {
    if (!task) return

    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await apiClient.deleteTask(task.id)
      router.push('/')
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
            <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Edit Task
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Delete Task
            </button>
          </div>
        </div>

        {/* Task Content */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{task.title}</h2>
            {task.description && (
              <p className="text-gray-600 text-lg">{task.description}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
          </div>

          {/* Categories */}
          {task.categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {task.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Due Date</h3>
              <p className="text-gray-600">
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Status Change */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Change Status</h3>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-6 text-sm text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(task.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {new Date(task.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}