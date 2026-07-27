import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OnboardingDto } from './dto/onboarding.dto';
import { Organization } from '../organizations/entities/organization.entity';
import { User, UserRole } from '../users/entities/user.entity'; // 👈 Importamos UserRole
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
      const orgData: any = {
        name: organizationName,
        taxId: taxId,
        isLicenseActive: true,
        licensePlan: licensePlan || 'FREE',
        machineId: licensePlan === 'LIFETIME' ? realId : undefined,
        licenseSignature: licenseSignature,
      };

      // 2. Creamos y guardamos la organización
      const organization = queryRunner.manager.create(Organization, orgData);
      const savedOrg = await queryRunner.manager.save(organization);

      // 3. Creamos el usuario administrador asignándole el ROL ADMIN 🛡️
      const user = queryRunner.manager.create(User, {
        email: adminEmail,
        password: password, 
        fullName: adminFullName,
        role: UserRole.ADMIN, // 👈 Se establece como ADMIN al hacer onboarding
        organization: savedOrg,
      });
      
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return {
        message: 'Onboarding exitoso',
        user: { 
          email: user.email, 
          fullName: user.fullName,
          role: user.role 
        },
        organization: { name: savedOrg.name, plan: savedOrg.licensePlan }
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Verificamos si error es un objeto y tiene la propiedad code
      const err = error as { code?: string };
      if (err.code === '23505') {
        throw new ConflictException('El email o TaxId ya está registrado');
      }
      throw error; 
    } finally {
      await queryRunner.release();
    }
  }

async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  // 🔒 Usamos QueryBuilder para forzar la lectura del campo 'password'
  const user = await this.dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.organization', 'organization')
    .addSelect('user.password') // 👈 Esto rescata la contraseña omitida por el select: false
    .where('user.email = :email', { email })
    .getOne();

  if (!user || !user.password) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Payload JWT
  const payload = { 
    sub: user.id, 
    email: user.email, 
    role: user.role,
    orgId: user.organization.id,
    orgName: user.organization.name,
    orgLogo: user.organization.logoUrl,
    orgColor: user.organization.primaryColor,
    orgRadius: user.organization.borderRadius,
    isLicenseActive: user.organization.isLicenseActive,
    licensePlan: user.organization.licensePlan,
    machineId: user.organization.machineId
  };

  return {
    message: 'Login exitoso',
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      organization: user.organization.name,
      licensePlan: user.organization.licensePlan,
      isLicenseActive: user.organization.isLicenseActive
    },
    token: this.jwtService.sign(payload),
  };
}
}