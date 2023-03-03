import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './components/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { createMemDB } from './configuration/db_config';
import { AuthModule } from './components/auth/auth.module';
import { RidersModule } from './components/riders/riders.module';
import { DriversModule } from './components/drivers/drivers.module';
import { dbConfig } from './configuration/db_config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => dbConfig,
    }),
    UsersModule,
    AuthModule,
    RidersModule,
    DriversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
