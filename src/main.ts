import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Origen permitido (tu aplicación Angular)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de League of Legends') // Título de la API
    .setDescription('Documentación de la API para obtener ADCs y Supports') // Descripción
    .setVersion('1.0') // Versión de la API
    .addTag('LoL API') // Etiqueta para agrupar endpoints
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Ruta donde estará disponible Swagger

  // Iniciar el servidor
  await app.listen(3000); // Puerto donde corre tu aplicación
  console.log(`Servidor corriendo en http://localhost:3000`);
  console.log(`Swagger disponible en http://localhost:3000/api`);
}
bootstrap();