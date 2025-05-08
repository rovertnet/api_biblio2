// === src/books/books.service.ts ===
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  findAll() {
    return this.bookRepo.find();
  }

  async findReadable(id: number, isSubscribed: boolean) {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) throw new Error('Book not found');

    if (!isSubscribed) {
      return {
        ...book,
        readablePages: 5,
        fileUrl: undefined,
      };
    }

    return {
      ...book,
      readablePages: book.totalPages,
    };
  }
}