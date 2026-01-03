import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { LicensingModule } from 'src/licensing/licensing.module';


@Module({
  imports: [LicensingModule],
  providers: [BackupService],
  controllers: [BackupController]
})
export class BackupModule {}
