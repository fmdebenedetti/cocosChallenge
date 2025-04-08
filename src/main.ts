import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('cocos');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // lanza error si hay propiedades no permitidas
    transform: true, // convierte payloads a clases automáticamente
  }));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
