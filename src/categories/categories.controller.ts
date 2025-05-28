// src/categories/categories.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';
import { RolesGuard } from '../cammon/guards/roles.guard';
import { Roles } from '../cammon/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BooksService } from '../books/books.service';


@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly booksService: BooksService, // 👈 Ajouté ici
  ) {}

  @Get()
  getAll(@Query('name') name?: string) {
    return this.categoriesService.findAll(name);
  }

  @Get(':id/books')
  getBooksByCategory(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy = 'title',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.booksService.findBooksByCategory(+id, {
      page: +page,
      limit: +limit,
      search,
      sortBy,
      order,
    });
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
