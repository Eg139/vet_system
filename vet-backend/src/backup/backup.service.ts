import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupFolder = path.join(process.cwd(), 'backups');
  private readonly dbPath = path.join(process.cwd(), 'database.sqlite'); // Ajusta a tu archivo real

  constructor() {
    // Asegurarse de que la carpeta de backups exista al iniciar
    fs.ensureDirSync(this.backupFolder);
  }

  // 1. BACKUP PROGRAMADO (Todos los días a la medianoche)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticBackup() {
    this.logger.log('Iniciando backup automático...');
    await this.createBackup('auto');
    await this.cleanOldBackups();
  }

  // 2. LÓGICA PARA CREAR EL BACKUP (Manual o Automático)
  async createBackup(type: 'manual' | 'auto' = 'manual') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${type}-${timestamp}.sqlite`;
      const destination = path.join(this.backupFolder, fileName);

      await fs.copy(this.dbPath, destination);
      
      this.logger.log(`Backup creado con éxito: ${fileName}`);
      return { message: 'Backup creado con éxito', fileName };
    } catch (error) {
      this.logger.error('Error al crear el backup', error);
      throw error;
    }
  }

  // 3. LIMPIEZA: Mantener solo los últimos 7 días
  private async cleanOldBackups() {
    const files = await fs.readdir(this.backupFolder);
    
    // Si hay más de 7 archivos, borramos los más antiguos
    if (files.length > 7) {
      const sortedFiles = files
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(this.backupFolder, file)).mtime.getTime(),
        }))
        .sort((a, b) => a.time - b.time);

      const filesToDelete = sortedFiles.slice(0, sortedFiles.length - 7);
      
      for (const file of filesToDelete) {
        await fs.remove(path.join(this.backupFolder, file.name));
        this.logger.log(`Backup antiguo eliminado: ${file.name}`);
      }
    }
  }
}