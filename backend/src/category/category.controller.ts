import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Post()
  create(@Body() data: { name: string }) {
    return this.service.create(data)
  }

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id)
  }
}