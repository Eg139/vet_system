import { Module } from '@nestjs/common';
import { HardwareService } from './hardware/hardware.service';
import { LicensingService } from './licensing.service';
import { LicenseGuard } from './guards/license.guard';
import { EncryptionService } from './encryption.service'; // Importa el nuevo servicio

@Module({
  providers: [
    LicensingService, 
    HardwareService, 
    EncryptionService, // <--- Agrégalo
    LicenseGuard 
  ],
  exports: [
    LicensingService, 
    HardwareService, 
    EncryptionService, // <--- Expórtalo para que AuthModule lo vea
    LicenseGuard 
  ],
})
export class LicensingModule {}