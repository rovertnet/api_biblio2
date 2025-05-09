// === src/books/book.entity.ts ===
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('text')
  description: string;

  @Column()
  fileUrl: string;

  @Column({ default: 0 })
  totalPages: number;

  @Column({ nullable: true })
  filePath: string;
}
