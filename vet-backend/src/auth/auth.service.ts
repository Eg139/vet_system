import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OnboardingDto } from './dto/onboarding.dto';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { HardwareService } from 'src/licensing/hardware/hardware.service';
import { EncryptionService } from '../licensing/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly hardwareService: HardwareService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async onboarding(onboardingDto: OnboardingDto) {
    const { 
      organizationName, taxId, adminEmail, 
      password, adminFullName, licensePlan 
    } = onboardingDto;
    const realId = await this.hardwareService.getMachineId();
    const signatureData = `${licensePlan}|${realId}|${taxId}`;
    const licenseSignature = this.encryptionService.encrypt(signatureData);

    console.log('--- DETECTANDO HARDWARE ---');
    console.log('ID Detectado:', realId);
    console.log('---------------------------');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Preparamos los datos de la organización
      // Usamos "any" aquí para que TypeScript no moleste con el machineId opcional
      const orgData: any = {
        name: organizationName,
        taxId: taxId,
        isLicenseActive: true,
        licensePlan: licensePlan || 'FREE',
        machineId: licensePlan === 'LIFETIME' ? realId : undefined,
        licenseSignature: licenseSignature,
      };

      // 3. Creamos la entidad con el objeto que preparamos
      const organization = queryRunner.manager.create(Organization, orgData);
      const savedOrg = await queryRunner.manager.save(organization);

      // 4. Creamos el usuario administrador
      const user = queryRunner.manager.create(User, {
        email: adminEmail,
        password: password, 
        fullName: adminFullName,
        organization: savedOrg,
      });
      
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return {
        message: 'Onboarding exitoso',
        user: { email: user.email, fullName: user.fullName },
        organization: { name: savedOrg.name, plan: savedOrg.licensePlan }
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new ConflictException('El email o TaxId ya está registrado');
      }
      throw error; 
    } finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.dataSource.getRepository(User).findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 5. El Payload ahora incluye el machineId para que el Guard pueda validarlo
    const payload = { 
      sub: user.id, 
      email: user.email, 
      orgId: user.organization.id,
      orgName: user.organization.name,   // <--- Agregado para Branding
      orgLogo: user.organization.logoUrl, // <--- Agregado para Branding
      orgColor: user.organization.primaryColor, // <--- Agregado para Branding
      orgRadius: user.organization.borderRadius, // <--- Agregado para Branding
      isLicenseActive: user.organization.isLicenseActive,
      licensePlan: user.organization.licensePlan,
      machineId: user.organization.machineId // <--- Importante para Eric
    };

    return {
      message: 'Login exitoso',
      user: {
        fullName: user.fullName,
        email: user.email,
        organization: user.organization.name,
        licensePlan: user.organization.licensePlan,
        isLicenseActive: user.organization.isLicenseActive
      },
      token: this.jwtService.sign(payload),
    };
  }
}