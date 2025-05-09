// === src/subscriptions/subscriptions.service.ts ===
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async isUserSubscribed(userId: number): Promise<boolean> {
    const today = new Date();
    const sub = await this.subscriptionRepo.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ['user'],
    });
    return !!sub;
  }

  async canDownload(userId: number): Promise<boolean> {
    const today = new Date();
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ['user'],
    });

    return subscription ? subscription.downloadsUsed < 5 : false;
  }

  async registerDownload(userId: number): Promise<void> {
    const today = new Date();
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ['user'],
    });

    if (subscription) {
      subscription.incrementDownloads();
      await this.subscriptionRepo.save(subscription);
    }
  }

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

  async enforceDownloadAccess(userId: number): Promise<void> {
    const today = new Date();
    const activeSubscription = await this.subscriptionRepo.findOne({
      where: {
        user: { id: userId },
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: ['user'],
    });
}

