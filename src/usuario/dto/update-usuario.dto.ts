import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDontPassDto } from './create-usuario-dont-pass.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDontPassDto) {}
