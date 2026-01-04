import { Controller, Post, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { LicenseGuard } from '../licensing/guards/license.guard'; // Tu Guard!
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // O el que uses
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('backups') // Agrupa este controlador en la UI de Swagger
@ApiBearerAuth()    // Indica que este controlador requiere un Token JWT
@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('manual')
  @UseGuards(JwtAuthGuard, LicenseGuard) // Protegemos con tu nuevo Guard
  @ApiOperation({ 
      summary: 'Ejecutar backup manual', 
      description: 'Crea un respaldo de la base de datos de forma inmediata. Requiere licencia activa.' 
    })
    @ApiResponse({ status: 201, description: 'El backup se ha creado y subido exitosamente.' })
    @ApiResponse({ status: 403, description: 'Licencia inválida o expirada.' })
    @ApiResponse({ status: 401, description: 'No autorizado (Falta token JWT).' })
    async triggerManualBackup() {
      return await this.backupService.createBackup('manual');
    }
}