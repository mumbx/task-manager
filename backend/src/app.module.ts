import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PagesModule } from './pages/pages.module';
import { AuthViewMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), PrismaModule, TasksModule, UsersModule, AuthModule, PagesModule],
  controllers: [],
  providers: [],
})

export class AppModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthViewMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.GET });
    }
}
