// === src/books/books.controller.ts ===
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/read')
  read(@Param('id') id: string, @Query('subscribed') subscribed: string) {
    const isSubscribed = subscribed === 'true';
    return this.booksService.findReadable(+id, isSubscribed);
  }
}