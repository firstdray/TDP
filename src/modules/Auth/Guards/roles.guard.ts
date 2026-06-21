import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requireRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requireRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException("User not authenticated");
        }

        const hasRole = requireRoles.includes(user.role);

        if (!hasRole) {
            throw new ForbiddenException('You do not have permission to access this resource')
        }

        return true
    }
}