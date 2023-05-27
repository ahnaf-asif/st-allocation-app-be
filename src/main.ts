import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const SWAGGER_ENVS = ['local', 'dev', 'staging'];

  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    const config = new DocumentBuilder()
      .setTitle('Sysrisk')
      .setDescription('The Sysrisk API description')
      .setVersion(process.env.npm_package_version)
      .addTag('sysrisk')
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.BE_PORT || 8080);
}
bootstrap();
