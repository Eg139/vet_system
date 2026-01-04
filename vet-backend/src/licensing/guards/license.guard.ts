import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HardwareService } from '../hardware/hardware.service';
import { DataSource } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity'; // Ajusta la ruta

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly hardwareService: HardwareService,
    private readonly dataSource: DataSource, // <--- Inyectamos para consultar la DB
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('--- EL GUARD DE LICENCIA HÍBRIDO (REAL-TIME) SE ESTÁ EJECUTANDO ---');
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user || !user.orgId) {
      throw new ForbiddenException('No se encontró información de autenticación u organización.');
    }

    // 1. BUSCAR LA ORGANIZACIÓN EN LA BASE DE DATOS
    // Esto asegura que si cambias la DB manualmente, el Guard se entere al instante.
    const org = await this.dataSource.getRepository(Organization).findOne({
      where: { id: user.orgId },
      select: ['isLicenseActive', 'licensePlan', 'machineId', 'licenseExpiration'] // <--- Solo pedimos lo que usamos
    });

    if (!org) {
      throw new ForbiddenException('La organización no existe.');
    }

    // 2. Validación de estado (¿Está activa en la DB?)
    if (!org.isLicenseActive) {
      throw new ForbiddenException('La licencia de esta organización está inactiva.');
    }

    // 3. LÓGICA DE HARDWARE (LIFETIME)
    if (org.licensePlan === 'LIFETIME') {
      const currentPCId = await this.hardwareService.getMachineId();

      // Comparamos el ID de la PC física vs el ID guardado en la DB (no en el Token)
      if (org.machineId !== currentPCId) {
        throw new ForbiddenException(
          'Hardware no autorizado. Esta licencia está vinculada a otro equipo.'
        );
      }
    }

    // 4. Validación de fecha (Si aplica)
    if (org.licenseExpiration) {
      const now = new Date();
      if (now > org.licenseExpiration) {
        throw new ForbiddenException('Su licencia ha caducado.');
      }
    }

    return true;
  }
}