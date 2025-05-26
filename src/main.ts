import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autoriser CORS depuis frontend
  app.enableCors({
    origin: 'http://localhost:8088', // URL de frontend
    credentials: true,               // utile si tu envoies des cookies ou headers d’auth
  });

  // Validation globale
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();

