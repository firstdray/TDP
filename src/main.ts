import { NestFactory } from '@nestjs/core';
import {AppModule} from "./app.module";
import * as dotenv from "dotenv";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('TDP API')
      .setDescription('Документация API для TDP проекта')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log('API Docs: http://localhost:3001/api-docs');
}
bootstrap();
