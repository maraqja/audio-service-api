import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/enums/user_role.enum';


export const ROLES_FIELD ='role'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_FIELD, roles);


// Создание @Roles() декоратора. Этот декоратор позволяет указать, какие роли необходимы для доступа к определенным маршрутам.