import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenAuthGuard } from './interceptor/auth.interceptor';
import { ErrorsInterceptor } from './interceptor/error.interceptor';
import { Middleware } from './middleware';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonService } from './util/common.service';
import { TrainingController } from './training/training.controller';
import { TrainingService } from './training/training.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController, UserController, TrainingController],
  providers: [AppService,UserService,CommonService,Middleware,
    TrainingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: TokenAuthGuard,
    },
  
  ],
})
export class AppModule {}
