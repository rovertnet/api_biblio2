// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { BooksService } from '../books/books.service';
import { BooksModule } from '../books/books.module';
// src/categories/categories.module.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    BooksModule
  ],
  providers: [CategoriesService, BooksService], 
  controllers: [CategoriesController],
})
export class CategoriesModule {}
