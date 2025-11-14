import { SetMetadata } from '@nestjs/common';

// Custom decorator to attach roles metadata to route handlers
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
