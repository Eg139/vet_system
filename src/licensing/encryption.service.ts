import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: string;
    private readonly ivLength = 16;

  constructor(private configService: ConfigService) {

    this.key = this.configService.get<string>('ENCRYPTION_KEY') || '';
    console.log('DEBUG: Largo de la clave leída:', this.key.length);
    
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY debe tener exactamente 32 caracteres en el archivo .env');
    }
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const textParts = text.split(':');
    
    // Extraemos el IV y validamos que exista
    const ivHex = textParts.shift();
    if (!ivHex) {
      throw new InternalServerErrorException('Formato de firma inválido: falta IV');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  }
}