import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LicensingModule } from './licensing/licensing.module';
import { BackupModule } from './backup/backup.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // 1. Configuración Global (Siempre primero)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeORM asíncrono para asegurar que lea las variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || '127.0.0.1',
        port: config.get<number>('DB_PORT') || 5433,
        username: config.get<string>('DB_USERNAME') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || 'mimosa22',
        database: config.get<string>('DB_NAME') || 'vet_db',
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    OrganizationsModule,
    UsersModule,
    AuthModule,
    LicensingModule,
    BackupModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}