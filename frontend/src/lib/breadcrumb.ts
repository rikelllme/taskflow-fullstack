import { Task } from '@/types/task'

export function generateBreadcrumb(pathname: string, task?: Task | null): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: 'Dashboard', href: '/' }
  ]

  // Adiciona segmentos baseados no pathname
  if (segments.length > 0) {
    if (segments[0] === 'tasks') {
      if (segments[1] === 'new') {
        breadcrumbs.push({ label: 'New Task' })
      } else if (segments[1] && segments[2] === 'edit') {
        breadcrumbs.push({ label: 'Task Details', href: `/tasks/${segments[1]}` })
        breadcrumbs.push({ label: 'Edit Task' })
      } else if (segments[1]) {
        breadcrumbs.push({ label: 'Task Details' })
      }
    } else if (segments[0] === 'categories') {
      breadcrumbs.push({ label: 'Categories' })
    }
  }

  return breadcrumbs
}

// Função específica para modais
export function generateModalBreadcrumb(modalType: 'detail' | 'edit' | 'create' | 'category', task?: Task | null): { label: string; href?: string }[] {
  const breadcrumbs: { label: string; href?: string }[] = [
    { label: 'Dashboard', href: '/' }
  ]

  switch (modalType) {
    case 'detail':
      breadcrumbs.push({ label: 'Task Details' })
      break
    case 'edit':
      breadcrumbs.push({ label: 'Task Details' })
      breadcrumbs.push({ label: 'Edit Task' })
      break
    case 'create':
      breadcrumbs.push({ label: 'New Task' })
      break
    case 'category':
      breadcrumbs.push({ label: 'New Category' })
      break
  }

  return breadcrumbs
}