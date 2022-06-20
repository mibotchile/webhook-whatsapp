import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app2 = await NestFactory.create(AppModule);
  await app2.listen(5050);
}
bootstrap();
