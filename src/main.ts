import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ForbiddenFilter, PrismaClientExceptionFilter } from './auth/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );
  app.useGlobalFilters(
    new ForbiddenFilter(),
    new PrismaClientExceptionFilter(),
  );
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
