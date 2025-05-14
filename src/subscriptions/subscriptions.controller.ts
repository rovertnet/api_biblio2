// === src/subscriptions/subscriptions.controller.ts ===
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../cammon/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body('type') type: 'monthly' | 'semiannual' | 'annual') {
    return this.subscriptionService.createSubscription(req.user.userId, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserSubscriptions(@Request() req) {
    return this.subscriptionService.getUserSubscriptions(req.user.userId);
  }
}
