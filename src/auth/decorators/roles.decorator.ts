import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserRoles } from 'generated/prisma/enums';

import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => {
    return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};
