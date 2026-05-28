import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CateringPlansModule } from './catering-plans/catering-plans.module';
import { MealsModule } from './meals/meals.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    CateringPlansModule,
    MealsModule,
    SubscriptionsModule,
    ReviewsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}