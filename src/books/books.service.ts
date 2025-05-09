import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async read(id: number): Promise<Book> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Livre non trouvé');
    }
    return book;
  }

  async download(id: number): Promise<StreamableFile> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book || !book.filePath) {
      throw new NotFoundException('Fichier introuvable');
    }

    const fullPath = join(__dirname, '..', '..', 'uploads', book.filePath);
    if (!existsSync(fullPath)) {
      throw new NotFoundException('Le fichier n\'existe pas sur le serveur');
    }

    const fileStream = createReadStream(fullPath);
    return new StreamableFile(fileStream);
  }
}
