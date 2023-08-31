import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import Permission from './permission.enum';
import { ForbiddenException } from 'src/exceptions/forbidden.exception';

const PermissionGuard = (...permission: Permission[]): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (!user || !user.permissions.some((e) => permission.includes(e))) {
        throw new ForbiddenException('Acesso negado. Você não tem permissão.');
      }

      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
