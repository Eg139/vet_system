import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Inyectamos la versión dinámicamente desde la variable de entorno de npm
  const appVersion = process.env.npm_package_version || '1.0.0';

  // 2. Middleware de Validación Global (Súper importante para class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades del JSON entrante que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error 400 si envían propiedades no permitidas
      transform: true, // Transforma payloads a instancias reales de los DTOs
    }),
  );

  // 3. Configuración de CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',
      /\.vercel\.app$/, // Subdominios de Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Vet SaaS API')
    .setDescription('Documentación de la API del Sistema de Gestión Veterinaria')
    .setVersion(appVersion) // 👈 Usa la versión dinámica del package.json
    .addTag('auth')
    .addTag('users')
    .addTag('organizations')
    .addTag('patients')
    .addTag('backups')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 5. Arranque de la aplicación
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Vet SaaS Backend [v${appVersion}] running on: ${await app.getUrl()}`);
  console.log(`📄 Swagger UI available on: ${await app.getUrl()}/api/docs`);
}
bootstrap();