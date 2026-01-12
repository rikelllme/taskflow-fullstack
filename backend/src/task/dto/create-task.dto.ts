import { IsEnum, IsOptional, IsString, IsUUID, IsArray } from 'class-validator'
import { Priority, Status } from '@prisma/client'

export class CreateTaskDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  dueDate?: Date

  @IsEnum(Priority)
  priority: Priority

  @IsEnum(Status)
  status: Status

  @IsArray()
  categoryIds: string[]
}