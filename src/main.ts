import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: ['https://matchmakinglol.netlify.app', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de League of Legends') 
    .setDescription('Documentación de la API para obtener ADCs y Supports') 
    .setVersion('1.0') 
    .addTag('LoL API') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000); 
}
bootstrap();