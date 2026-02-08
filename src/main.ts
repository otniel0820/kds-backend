import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { variables } from './config/enviroment.config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception-error.filter';
import { corsConfig, setupSwagger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  setupSwagger(app);
  app.enableCors(corsConfig);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(variables.NEST_PORT ?? 3000);
}
void bootstrap();
