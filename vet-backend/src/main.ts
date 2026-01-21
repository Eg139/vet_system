import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // MODIFICACIÓN DE CORS
  app.enableCors({
    // Permitimos localhost para tus pruebas y la futura URL de Vercel
    // Si quieres no complicarte ahora, usa origin: true o origin: '*'
    origin: [
      'http://localhost:4200', 
      /\.vercel\.app$/ // Esto permite cualquier subdominio de Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Vet SaaS API')
    .setDescription('Documentación de la API del Sistema de Gestión Veterinaria')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('organizations')
    .addTag('backups')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  // MODIFICACIÓN DEL LISTEN
  // Es vital el '0.0.0.0' para que Render pueda rutear el tráfico
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
