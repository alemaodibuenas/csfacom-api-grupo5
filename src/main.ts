import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useLogger(app.get(CustomLogger));

  const config = new DocumentBuilder()
    .setTitle('Documentação com Swagger - API')
    .setDescription(
      'Aqui é possivel conferir e testar algumas ou todas chamadas disponiveis para a aplicação. É importante ressaltar que este ambiente deve estar online somente no ambiente de desenvolvimento',
    )
    .setVersion('1.0')
    .addTag('usuario')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.SERVER_PORT);
  console.log(`Aplicação rodando na porta: ${await app.getUrl()} versão 0.1`);
}
bootstrap();
