import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enums/user_role.enum';
import { ROLES_FIELD } from '../roles/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_FIELD, [ // через рефлектор получаем доступ к ролям, необходимым для доступа к маршруту (настраиваемым метаданным)
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log(requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log(user.data.role)
    // console.log(requiredRoles.some((role) => user.data.role?.includes(role)))
    return requiredRoles.some((role) => user.data.role?.includes(role))
    // return requiredRoles.some((role) => user.role?.includes(role));
  }
}

// Гуард для сравнения ролей пользователя с ролями, требуемые для вызова роута