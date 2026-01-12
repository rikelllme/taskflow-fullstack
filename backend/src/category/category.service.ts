import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string }) {
    return this.prisma.category.create({
      data,
    })
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { tasks: true },
    })
  }

  update(id: string, data: { name: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    })
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    })
  }
}