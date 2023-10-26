import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { PessoaModule } from './pessoa/pessoa.module';
import { AuthModule } from './auth/auth.module';
import { FotoModule } from './foto/foto.module';
import { LoggerModule } from './logger/logger.module';
import { CaslModule } from './casl/casl.module';
import { NoticiasModule } from './noticias/noticias.module';
import LogsMiddleware from './logger/logs.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    } as TypeOrmModuleOptions),
    UsuarioModule,
    PessoaModule,
    AuthModule,
    FotoModule,
    LoggerModule,
    CaslModule,
    NoticiasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
