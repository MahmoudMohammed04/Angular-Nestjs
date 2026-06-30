import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule , DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // removes extra fields
      forbidNonWhitelisted: true, // throws error on unknown fields
      transform: true,            // auto-transform DTOs
    }),
  );

  exceptionFactory: (errors) => {
    return new BadRequestException(
      errors.map(err => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      })),
    );
  };
    

  const config = new DocumentBuilder()
    .setTitle('Back-end')
    .setDescription('The back-end API description')
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: "Authorization",
      description: "Pass the JWT token",
    },
    'Bearer',
    )
    .addSecurityRequirements('Bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
