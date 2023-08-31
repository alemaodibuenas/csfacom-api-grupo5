import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Matches,
} from 'class-validator';
import Permission from 'src/auth/permissions/permission.enum';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { RegExHelpers } from 'src/helpers/regex.helper';
import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
// import { Permissao } from 'src/permissao/entities/permissao.entity';
// import { Pessoa } from 'src/pessoa/entities/pessoa.entity';

export class CreateUsuarioDontPassDto {
  @ApiProperty({
    example: 'email@email.com',
    description: `O e-mail é necessário para o login, mas não necessariamente precisa ser o mesmo e-mail da rede social que estiver conectada. Login sem rede social precisa de uma senha.`,
  })
  @IsNotEmpty({ message: MessagesHelper.EMAIL_EMPTY })
  @IsEmail({}, { message: MessagesHelper.EMAIL_VALID })
  email: string;

  @ApiProperty({
    example: '{"id": "32c809a9-e7af-4cc5-bb6b-dbfe6645d33a"}',
  })
  @IsObject()
  @IsNotEmpty()
  pessoa: Pessoa;

  @ApiProperty({
    example: '[Admin, Pessoa]',
    description: `Necessário para realização do ações no sistema`,
  })
  @IsArray({ message: MessagesHelper.PERMISSION_EMPTY })
  @IsEnum(Permission, {
    each: true,
    message: MessagesHelper.PERMISSION_NOT_FOUND,
  })
  permissions: Permission[];
}
