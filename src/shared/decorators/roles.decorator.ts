import { SetMetadata } from '@nestjs/common';
import { Rol } from 'src/constants/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_KEY, roles);