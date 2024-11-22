import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';

import { ThrottlerModule } from '@nestjs/throttler';
import { FavoriteModule } from './favorite/favorite.module';


@Module({
  imports: [ConfigModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }), TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: true,
  }), ThrottlerModule.forRoot([{
    ttl: 60,
    limit: 10,
  }]), AuthModule,ScheduleModule.forRoot(), FavoriteModule],
})
export class AppModule { }
