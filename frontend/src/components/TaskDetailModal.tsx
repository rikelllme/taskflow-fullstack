'use client'

import { useState } from 'react'
import { X, Edit3, Trash2, Calendar, Tag } from 'lucide-react'
import { Task } from '@/types/task'
import { generateModalBreadcrumb } from '@/lib/breadcrumb'

interface TaskDetailModalProps {
  task: Task | null
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskDetailModal({ task, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  const [deleting, setDeleting] = useState(false)

  if (!task) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    const index = categoryName.length % colors.length
    return colors[index]
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setDeleting(true)
    try {
      await onDelete()
      onClose()
    } catch (err) {
      console.error('Failed to delete task:', err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Page Indicator */}
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="font-medium text-gray-900">Task Details</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Task Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
          </div>

          {/* Categories */}
          {task.categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.categories.map((category) => (
                  <span
                    key={category.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category.name)} text-white`}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {new Date(task.dueDate) < new Date() && task.status !== 'DONE' && (
                  <span className="ml-2 text-red-500 font-medium">(Overdue)</span>
                )}
              </span>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleString()}
            </div>
            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Last Updated:</span> {new Date(task.updatedAt).toLocaleString()}
              </div>
            )}
            {task.userId && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">User ID:</span> {task.userId}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <div className="flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Task
              </div>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-2xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
            >
              <div className="flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}