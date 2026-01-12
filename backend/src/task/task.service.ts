import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto, UpdateTaskDto } from './dto'

@Injectable()
export class TaskService {
  private userId = 'user-fixo-id' // usuário hardcoded

  constructor(private prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    const { categoryIds, ...taskData } = dto
    return this.prisma.task.create({
      data: {
        ...taskData,
        // userId: this.userId, // Temporarily removed for demo
        categories: {
          connect: categoryIds.filter(id => id).map(id => ({ id })),
        },
      },
      include: { categories: true },
    })
  }

  findAll(filters: any) {
    const { status, priority, categoryId } = filters

    return this.prisma.task.findMany({
      where: {
        // userId: this.userId, // Temporarily removed for demo
        status,
        priority,
        categories: categoryId
          ? { some: { id: categoryId } }
          : undefined,
      },
      include: { categories: true },
    })
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { categories: true },
    })
  }

  update(id: string, dto: UpdateTaskDto) {
    const { categoryIds, ...taskData } = dto
    return this.prisma.task.update({
      where: { id },
      data: {
        ...taskData,
        categories: categoryIds
          ? {
              set: [],
              connect: categoryIds.map(id => ({ id })),
            }
          : undefined,
      },
    })
  }

  updateStatus(id: string, status: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status: status as any },
    })
  }

  delete(id: string) {
    return this.prisma.task.delete({ where: { id } })
  }
}
