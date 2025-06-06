// src/categories/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../books/book.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true }) // ou { default: 'https://example.com/default.jpg' }
  image: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];

  @Column()
  categoryId: number;
}
