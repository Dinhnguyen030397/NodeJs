import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AccessInterceptor implements NestInterceptor {
  constructor(private readonly requiredPermission: string) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = await context.switchToHttp().getRequest();
    const permissions: string[] = await request['permissions'];
    console.log(permissions)
    for (const permission of permissions) {
      if (permission === this.requiredPermission) return next.handle();
    }
    throw new ForbiddenException('Không có quyền truy cập.');
  }
}
