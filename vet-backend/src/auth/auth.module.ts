import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LicensingModule } from 'src/licensing/licensing.module';

@Module({
  imports: [
    // Importamos las entidades para que el DataSource las reconozca en este módulo
    TypeOrmModule.forFeature([User, Organization]),
    LicensingModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKeyPrivada', // Usa variables de entorno
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
