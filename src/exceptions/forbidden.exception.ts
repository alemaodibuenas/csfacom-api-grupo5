import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: false,
        message: message || 'Negado!',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
