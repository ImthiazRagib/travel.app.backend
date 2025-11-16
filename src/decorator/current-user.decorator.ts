import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/models/users.model';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // set by AuthGuard (Passport JWT)

    if (!user) return null;

    // If a specific property is requested, return it
    if (data) {
      return user[data];
    }

    // Otherwise, return the whole user
    return user;
  },
);
