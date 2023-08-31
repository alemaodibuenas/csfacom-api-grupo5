import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export default class LogsMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl, ip } = request;
      const userAgent = request.get('user-agent') || '';
      const { statusCode, statusMessage } = response;
      const user = request.user?.['email'] || '';

      const obj = {
        method: method,
        url: originalUrl,
        statusCode: statusCode,
        statusMessage: statusMessage,
        userAgent: userAgent,
        ip: ip,
        user: user,
      };

      const message = JSON.stringify(obj);

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
