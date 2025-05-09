// === src/books/books.service.ts ===
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async download(id: number): Promise<StreamableFile> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const filePath = join(__dirname, '../../uploads/books', book.fileName);
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
