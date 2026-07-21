import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  
  // Usamos un tipado genérico y seguro para evitar el problema del namespace global de Multer
  async uploadImage(file: { buffer: Buffer; mimetype: string }): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      
      if (!file.mimetype.startsWith('image/')) {
        return reject(new BadRequestException('El archivo debe ser una imagen válida'));
      }

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || 'vetsaas_default',
          transformation: [
            { width: 400, height: 400, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        // Corrección aquí: 'error' puede ser undefined, por eso agregamos '| undefined'
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) return reject(error);
          if (!result) return reject(new BadRequestException('No se pudo obtener respuesta de Cloudinary'));
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }
}