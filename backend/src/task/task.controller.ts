import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto } from './dto'

@Controller('tasks')
export class TaskController {
  constructor(private service: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto)
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}