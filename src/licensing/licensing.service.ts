import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

@Injectable()
export class LicensingService {
  // Algoritmo robusto para cumplir tu subtarea de AES-256
  private readonly algorithm = 'aes-256-cbc';
  
  // En producción, estas deberían ir en tu archivo .env
  private readonly password = process.env.LICENSE_SECRET || 'clave-maestra-vet-2025';
  private readonly salt = 'sal-para-seguridad-extra';

  // Generamos la llave de 32 bytes necesaria para AES-256
  private readonly key = scryptSync(this.password, this.salt, 32);
  private readonly iv = Buffer.alloc(16, 0); // Vector de inicialización

  /**
   * Cifra los datos (MachineId + Plan) para crear una firma digital única
   */
  encryptLicense(machineId: string, plan: string): string {
    const data = JSON.stringify({ machineId, plan, createdAt: new Date().toISOString() });
    const cipher = createCipheriv(this.algorithm, this.key, this.iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Desencripta y valida si la firma es legítima
   */
  decryptLicense(encryptedText: string) {
    try {
      const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      // Si alguien intenta modificar el machineId en la DB, el descifrado fallará
      return null;
    }
  }
}