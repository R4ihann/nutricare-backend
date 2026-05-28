import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS so your frontend teammate can fetch your API data from a different port/URL
  app.enableCors();

  // 2. Global Validation (Ensures incoming data fits your expectations perfectly)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 3. Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Catering Subscription API')
    .setDescription('The backend API documentation for the Catering Subscription Platform')
    .setVersion('1.0')
    .addBearerAuth() // Allows your teammate to test JWT-protected routes inside the browser
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();