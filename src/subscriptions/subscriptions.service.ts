import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createSubscription(userId: number, type: 'monthly' | 'semiannual' | 'annual') {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const start = new Date();
    let end = new Date(start);
    if (type === 'monthly') end.setMonth(end.getMonth() + 1);
    else if (type === 'semiannual') end.setMonth(end.getMonth() + 6);
    else if (type === 'annual') end.setFullYear(end.getFullYear() + 1);

    const sub = this.subscriptionRepo.create({
      user,
      type,
      startDate: start,
      endDate: end,
    });

    return this.subscriptionRepo.save(sub);
  }

  async getUserSubscriptions(userId: number) {
    return this.subscriptionRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
