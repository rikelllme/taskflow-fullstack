import { Task, CreateTaskDto, UpdateTaskDto, UpdateStatusDto, TaskFilters, Category } from '@/types/task'

const API_BASE_URL = 'http://localhost:3000'

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.categoryId) params.append('categoryId', filters.categoryId)

    const queryString = params.toString()
    return this.request<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`)
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`)
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async updateTaskStatus(id: string, data: UpdateStatusDto): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories')
  }

  async createCategory(data: { name: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: { name: string }): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
