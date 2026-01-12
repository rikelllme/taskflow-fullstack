export interface Category {
  id: string
  name: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  userId?: string
  categories: Category[]
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  dueDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  categoryIds: string[]
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  dueDate?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  categoryIds?: string[]
}

export interface UpdateStatusDto {
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
}

export interface TaskFilters {
  status?: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
  categoryId?: string
}
