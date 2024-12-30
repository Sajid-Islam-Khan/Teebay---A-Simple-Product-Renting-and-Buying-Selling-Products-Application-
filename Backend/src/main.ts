import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from your frontend URL
    credentials: true,               // If your frontend needs cookies or credentials
  });

  await app.listen(3002);
}
bootstrap();
