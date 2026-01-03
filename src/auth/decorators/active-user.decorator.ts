import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActiveUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si pedimos una propiedad específica (ej: @ActiveUser('orgId'))
    return data ? user?.[data] : user;
  },
);