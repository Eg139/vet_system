import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Vet SaaS API')
    .setDescription('Documentación de la API del Sistema de Gestión Veterinaria')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('organizations')
    .addTag('backups') // <-- Agregamos el tag para identificar el nuevo módulo
    .addBearerAuth()   // <-- ESTO es lo que permite usar JWT en la interfaz de Swagger
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // La documentación vivirá en http://localhost:3000/api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
