import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/models/users.model';

export const CurrentUser = createParamDecorator(
    (data: keyof User | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user; // set by AuthGuard (Passport JWT)

        if (!user) return null;

        // Remove password field if present
        const { password, ...userWithoutPassword } = user;

        // If a specific property is requested, return it (except password)
        if (data) {
            if (data === 'password') return undefined;
            return userWithoutPassword[data];
        }

        // Otherwise, return the whole user without password
        return userWithoutPassword;
    },
);
