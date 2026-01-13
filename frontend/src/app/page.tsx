'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, CheckCircle2, Circle, Clock, Edit3, Trash2, Filter } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { Task, TaskFilters, Category } from '@/types/task'
import TaskModal from '@/components/TaskModal'
import CategoryModal from '@/components/CategoryModal'
import TaskDetailModal from '@/components/TaskDetailModal'
import { generateModalBreadcrumb } from '@/lib/breadcrumb'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<TaskFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewingTask, setViewingTask] = useState<Task | null>(null)

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getTasks(filters)
      setTasks(data)
    } catch (err) {
      console.error('Failed to load tasks:', err)
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

  const handleStatusChange = async (taskId: string, currentStatus: 'PENDING' | 'IN_PROGRESS' | 'DONE') => {
    // Cycle through: PENDING -> IN_PROGRESS -> DONE -> PENDING
    const statusCycle = {
      'PENDING': 'IN_PROGRESS' as const,
      'IN_PROGRESS': 'DONE' as const,
      'DONE': 'PENDING' as const
    }

    const newStatus = statusCycle[currentStatus]

    try {
      await apiClient.updateTaskStatus(taskId, { status: newStatus })
      await loadTasks()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const getStatusIcon = (status: 'PENDING' | 'IN_PROGRESS' | 'DONE') => {
    switch (status) {
      case 'PENDING':
        return <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
      case 'IN_PROGRESS':
        return <Clock className="w-6 h-6 text-blue-500 hover:text-blue-700" />
      case 'DONE':
        return <CheckCircle2 className="w-6 h-6 text-green-500 hover:text-green-700" />
      default:
        return <Circle className="w-6 h-6 text-gray-400" />
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

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setFilters(prev => ({
      ...prev,
      categoryId: categoryId || undefined
    }))
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? Tasks using this category will be affected.')) return

    try {
      await apiClient.deleteCategory(categoryId)
      await loadCategories()
      // If the deleted category was selected, reset to "All Tasks"
      if (selectedCategory === categoryId) {
        handleCategoryFilter(null)
      }
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const completedTasks = tasks.filter(task => task.status === 'DONE').length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    const index = categoryName.length % colors.length
    return colors[index]
  }

  const getPriorityInfo = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (priority) {
      case 'LOW':
        return { label: 'Low Priority', color: 'bg-green-100 text-green-800', icon: '🟢' }
      case 'MEDIUM':
        return { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' }
      case 'HIGH':
        return { label: 'High Priority', color: 'bg-red-100 text-red-800', icon: '🔴' }
      default:
        return { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' }
    }
  }

  return (
    <div className="dashboard-container h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden" data-testid="dashboard-main">
      <div className="dashboard-layout flex h-full">
        {/* Sidebar */}
        <aside className="dashboard-sidebar hidden lg:flex w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 rounded-r-[2.5rem] flex flex-col shadow-xl" data-testid="dashboard-sidebar">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your tasks</p>
          </div>

          {/* Categories */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-800 font-semibold">Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="w-8 h-8 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 transition-colors flex items-center justify-center"
                  data-testid="add-category-btn"
                  title="Add new category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all mb-2 ${
                    selectedCategory === null
                      ? 'bg-green-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  data-testid="filter-all-tasks"
                >
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">All Tasks</span>
                  </div>
                </button>

                {categories.map((category) => (
                  <div key={category.id} className="category-item group relative">
                    <button
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${
                        selectedCategory === category.id
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      data-testid={`category-filter-${category.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.name)}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </button>

                    {/* Delete button - appears on hover */}
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="category-delete-btn absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all flex items-center justify-center text-xs"
                      data-testid={`delete-category-${category.id}`}
                      title={`Delete ${category.name} category`}
                      aria-label={`Delete category ${category.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Widget */}
          <div className="p-6 border-t border-gray-200">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200 shadow-sm">
              <h4 className="text-gray-800 font-semibold mb-2">Today's Progress</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">{completedTasks} of {totalTasks} completed</span>
                <span className="text-green-600 font-semibold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="dashboard-main-panel flex-1 flex flex-col bg-gradient-to-br from-blue-50/50 to-green-50/50" data-testid="dashboard-main-panel">
          {/* Header */}
          <header className="dashboard-header p-6 border-b border-gray-200 bg-white/40 backdrop-blur-xl" data-testid="dashboard-header">
            {/* Page Indicator */}
            <div className="dashboard-breadcrumb mb-4" data-testid="dashboard-breadcrumb">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Dashboard</span>
              </nav>
            </div>

            <div className="dashboard-controls flex items-center justify-between gap-6">
              <div className="dashboard-search-filters flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="dashboard-search relative max-w-md" data-testid="dashboard-search">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    data-testid="search-input"
                  />
                </div>

                {/* Filters */}
                <div className="dashboard-filters flex items-center gap-3" data-testid="dashboard-filters">
                  <span className="text-gray-600 font-medium text-sm">Filters:</span>

                  {/* Status Filter */}
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      status: e.target.value as any || undefined
                    }))}
                    className="px-3 py-2 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    data-testid="status-filter"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    value={filters.priority || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priority: e.target.value as any || undefined
                    }))}
                    className="px-3 py-2 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    data-testid="priority-filter"
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={filters.categoryId || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      categoryId: e.target.value || undefined
                    }))}
                    className="px-3 py-2 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    data-testid="category-filter"
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

              <button
                onClick={() => setShowTaskModal(true)}
                className="dashboard-new-task-btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                data-testid="new-task-button"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </header>

          {/* Tasks List */}
          <section className="dashboard-tasks-section flex-1 overflow-y-auto p-6" data-testid="dashboard-tasks-section">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-6">Create your first task to get started</p>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Task
                </button>
              </div>
            ) : (
              <div className="dashboard-tasks-list space-y-4" data-testid="dashboard-tasks-list">
                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className="task-card group bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                    data-testid={`task-card-${task.id}`}
                  >
                    <div className="task-card-content flex items-start gap-4">
                      <button
                        onClick={() => handleStatusChange(task.id, task.status)}
                        className="task-status-toggle mt-1 transition-colors"
                        data-testid={`task-status-toggle-${task.id}`}
                        aria-label={`Change status for ${task.title}`}
                      >
                        {getStatusIcon(task.status)}
                      </button>

                      <div className="task-details flex-1 min-w-0">
                        <h3 className={`task-title text-lg font-semibold mb-2 ${
                          task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="task-description text-gray-700 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Status and Priority */}
                        <div className="task-metadata flex items-center gap-2 mb-3">
                          <span className={`task-status-badge px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`task-priority-badge px-2 py-1 rounded-full text-xs font-medium ${getPriorityInfo(task.priority).color}`}>
                            {getPriorityInfo(task.priority).icon} {task.priority}
                          </span>
                        </div>

                        {/* Categories */}
                        {task.categories.length > 0 && (
                          <div className="task-categories flex items-center gap-2 mb-3 flex-wrap">
                            <span className="text-gray-500 text-xs">Categories:</span>
                            {task.categories.map((category) => (
                              <span
                                key={category.id}
                                className={`task-category-tag px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.name)} text-white`}
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Dates */}
                        <div className="task-dates flex items-center gap-4 text-xs text-gray-500">
                          <span className="task-created-date">Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                          {task.dueDate && (
                            <span className={`task-due-date ${new Date(task.dueDate) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-medium' : ''}`}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.updatedAt && task.updatedAt !== task.createdAt && (
                            <span className="task-updated-date">Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>

                        {/* User ID if exists */}
                        {task.userId && (
                          <div className="task-user-id text-xs text-gray-400 mt-1">
                            User ID: {task.userId}
                          </div>
                        )}
                      </div>

                      <div className="task-actions flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setViewingTask(task)
                            setShowDetailModal(true)
                          }}
                          className="task-view-btn p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                          data-testid={`task-view-btn-${task.id}`}
                          title="View Details"
                          aria-label={`View details for ${task.title}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTask(task)
                            setShowTaskModal(true)
                          }}
                          className="task-edit-btn p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          data-testid={`task-edit-btn-${task.id}`}
                          title="Edit Task"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="task-delete-btn p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          data-testid={`task-delete-btn-${task.id}`}
                          title="Delete Task"
                          aria-label={`Delete ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          categories={categories}
          onClose={() => {
            setShowTaskModal(false)
            setEditingTask(null)
          }}
          onSave={() => {
            loadTasks()
            setShowTaskModal(false)
            setEditingTask(null)
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSave={() => {
            loadCategories()
            setShowCategoryModal(false)
          }}
        />
      )}

      {showDetailModal && (
        <TaskDetailModal
          task={viewingTask}
          onClose={() => {
            setShowDetailModal(false)
            setViewingTask(null)
          }}
          onEdit={() => {
            setShowDetailModal(false)
            setEditingTask(viewingTask)
            setShowTaskModal(true)
          }}
          onDelete={async () => {
            if (viewingTask) {
              await handleDelete(viewingTask.id)
            }
          }}
        />
      )}
    </div>
  )
}
