import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  console.log('Environment Variables:', process.env);

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
  console.log(`Running port number: ${port}`);
  app.enableCors();
  await app.listen(port)
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
