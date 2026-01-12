import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { TaskModule } from './task/task.module'
import { UserModule } from './user/user.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [PrismaModule, TaskModule, UserModule, CategoryModule],
})
export class AppModule {}