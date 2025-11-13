import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return {
          statusCode: 400,
          message: 'Validation failed',
          errors: result,
        };
      },
    }),
  );
  await app.listen(process.env.APP_PORT ?? 3000);
  console.log(`Application is running on: ${process.env.APP_PORT}`);
}
bootstrap();
