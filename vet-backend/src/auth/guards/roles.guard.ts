import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lee los roles requeridos definidos en el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si el endpoint no especifica ningún @Roles(), permite el acceso libre a cualquier autenticado
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtiene el usuario inyectado previamente por el JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // 4. Verifica si el rol del usuario está dentro de los permitidos
    return requiredRoles.includes(user?.role);
  }
}