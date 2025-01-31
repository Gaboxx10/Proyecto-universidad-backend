import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './prisma/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Project API')
    .setDescription('Sistema de Gesteión de Talleres')
    .setVersion('1.0')
    .addTag('') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, 
    forbidNonWhitelisted: true, 
  }));

  const prismaSeedService = app.get(SeedService);
  await prismaSeedService.seed();

  await app.listen(3000);
}

bootstrap();
