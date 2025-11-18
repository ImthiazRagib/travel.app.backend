import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error if extra properties sent
      transform: true, // transforms payloads to DTO classes
    }),
  );

  // Global ValidationPipe
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,            // remove extra fields
  //     forbidNonWhitelisted: true, // throw error on extra fields
  //     transform: true,            // convert payloads to DTO class instances
  //     transformOptions: { enableImplicitConversion: true },
  //     exceptionFactory: (errors) => {
  //       const formattedErrors = errors.map((err) => ({
  //         property: err.property,
  //         constraints: err.constraints,
  //       }));
  //       return {
  //         statusCode: 400,
  //         message: 'Validation failed',
  //         errors: formattedErrors,
  //       };
  //     },
  //   }),
  // );

  await app.listen(process.env.APP_PORT || 3000);
  console.log(`Application running on port ${process.env.APP_PORT || 3000}`);
}
bootstrap();
