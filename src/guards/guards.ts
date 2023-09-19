import jwtDecode from 'jwt-decode';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	ForbiddenException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PrismaService } from '@/prisma/prisma.service';
import { UserProxy } from '@/shared/async-storage';

@Injectable()
export class BaseAccess extends AuthGuard('jwt') {}

@Injectable()
export class AuthAccess extends BaseAccess {
	constructor(private prisma: PrismaService, private userProxy: UserProxy) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (!(await super.canActivate(context)) as boolean) return false;
		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization.split(' ')[1];

		const { user } = await jwtDecode(token as string) as any;
		const { id } = user;

		const latestUserData = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!latestUserData) throw new ForbiddenException('User does not exist');

		Object.keys(latestUserData).forEach(key => {
			this.userProxy[key] = latestUserData[key];
		});

		return true;
	}
}

@Injectable()
export class AdminAccess extends BaseAccess implements CanActivate {
	constructor(private prisma: PrismaService, private userProxy: UserProxy) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (!(await super.canActivate(context)) as boolean) return false;

		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization.split(' ')[1];

		const { user } = await jwtDecode(token as string) as any;
		const { id } = user;

		const latestUserData = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!latestUserData) throw new ForbiddenException('User does not exist');

		if (!latestUserData.isAdmin) throw new UnauthorizedException('You do not have admin access');

		Object.keys(latestUserData).forEach(key => {
			this.userProxy[key] = latestUserData[key];
		});

		return true;
	}
}

export class SuperAdminAccess extends BaseAccess implements CanActivate {
	constructor(private prisma: PrismaService, private userProxy: UserProxy) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (!(await super.canActivate(context)) as boolean) return false;

		const request = context.switchToHttp().getRequest();
		const token = request.headers.authorization.split(' ')[1];

		const xyz = await jwtDecode(token as string) as any;
		const user = xyz.user;

		if (!user) throw new ForbiddenException('User does not exist');
		if (!user.isAdmin) throw new UnauthorizedException('You do not have admin access');
		if (!user.isSuperAdmin) throw new UnauthorizedException('You do not have super admin access');
		this.userProxy = {...user};
		return true;
	}
}
