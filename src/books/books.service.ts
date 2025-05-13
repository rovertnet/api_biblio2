// === src/books/books.service.ts ===
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CreateBookDto } from './dto/create-book.dto';
import { DownloadHistory } from '../history/download-history.entity';
import { ReadingHistory } from '../reading/reading-history.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @InjectRepository(DownloadHistory)
    private readonly historyRepo: Repository<DownloadHistory>,

    @InjectRepository(ReadingHistory)
    private readonly readingRepo: Repository<ReadingHistory>,
  ) {}

  async findAll(
    keyword: string,
    categoryId?: number,
    page = 1,
    limit = 8,
    sortBy: 'title' | 'author' | 'createdAt' = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    const skip = (page - 1) * limit;

    const query = this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .skip(skip)
      .take(limit);

    if (keyword) {
      query.andWhere('(book.title ILIKE :keyword OR book.author ILIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    if (categoryId) {
      query.andWhere('book.categoryId = :categoryId', { categoryId });
    }

    // tri dynamique
    query.orderBy(`book.${sortBy}`, sortOrder);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  async download(id: number): Promise<StreamableFile> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const filePath = join(__dirname, '../../uploads/books', book.fileName);
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  async saveUploadedBook(file: Express.Multer.File, dto: CreateBookDto) {
    const book = this.bookRepo.create({
      title: dto.title,
      author: dto.author,
      fileName: file.filename,
    });
    return this.bookRepo.save(book);
  }

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepo.create(createBookDto);
    return this.bookRepo.save(book);
  }
  
  async logDownload(userId: number, bookId: number) {
    const history = this.historyRepo.create({
      userId,
      bookId,
      downloadedAt: new Date(),
    });
    await this.historyRepo.save(history);
  }

  async logReading(userId: number, bookId: number) {
    const record = this.readingRepo.create({
      userId,
      bookId,
      startedAt: new Date(),
    });
    await this.readingRepo.save(record);
  }

  async getReadingsByUser(userId: number, page = 1, limit = 8) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.readingRepo.findAndCount({
      where: { userId },
      relations: ['book'],
      order: { startedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDownloadsByUser(userId: number, page = 1, limit = 8) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.historyRepo.findAndCount({
      where: { userId },
      relations: ['book'],
      order: { downloadedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
