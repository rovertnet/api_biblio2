// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAll(name?: string) {
    if (name) {
      return this.categoryRepo.find({
        where: { name: ILike(`%${name}%`) },
      });
    }
    return this.categoryRepo.find();
  }

  create(dto: CreateCategoryDto) {
    const defaultImage = 'https://source.unsplash.com/600x400/?computer,code';

    const category = this.categoryRepo.create({
      ...dto,
      image: dto.image || defaultImage,
    });

    return this.categoryRepo.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return this.categoryRepo.remove(category);
  }
}
