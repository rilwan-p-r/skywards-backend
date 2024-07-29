import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  console.log('Environment Variables:', process.env);

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
  console.log(`Running port number: ${port}`);
  app.use(cookieParser());
  app.use(morgan('tiny'));
  app.enableCors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(port)
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();