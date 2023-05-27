import {
	BadGatewayException,
	BadRequestException,
	ConflictException,
	ForbiddenException,
	GatewayTimeoutException,
	Injectable,
	InternalServerErrorException,
	MethodNotAllowedException,
	NotAcceptableException,
	NotFoundException,
	NotImplementedException,
	PayloadTooLargeException,
	RequestTimeoutException,
	ServiceUnavailableException,
	UnauthorizedException,
	UnprocessableEntityException,
	UnsupportedMediaTypeException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BusinessError, ServiceError } from '@/shared/interfaces';

@Injectable()
export class ServiceErrorHandler {
	handleBusinessError(error: BusinessError) {
		const { type, message } = error;

		if (type === ServiceError.INTERNAL_SERVER_ERROR) {
			throw new InternalServerErrorException(message);
		} else if (type === ServiceError.SERVICE_UNAVAILABLE) {
			throw new ServiceUnavailableException(message);
		} else if (type === ServiceError.BAD_GATEWAY) {
			throw new BadGatewayException(message);
		} else if (type === ServiceError.BAD_REQUEST) {
			throw new BadRequestException(message);
		} else if (type === ServiceError.FORBIDDEN) {
			throw new ForbiddenException(message);
		} else if (type === ServiceError.UNAUTHORIZED) {
			throw new UnauthorizedException(message);
		} else if (type === ServiceError.NOT_FOUND) {
			throw new NotFoundException(message);
		} else if (type === ServiceError.CONFLICT_EXCEPTION) {
			throw new ConflictException(message);
		} else if (type === ServiceError.GATEWAY_TIMED_OUT) {
			throw new GatewayTimeoutException(message);
		} else if (type === ServiceError.NOT_ACCEPTABLE) {
			throw new NotAcceptableException(message);
		} else if (type === ServiceError.NOT_IMPLEMENTED) {
			throw new NotImplementedException(message);
		} else if (type === ServiceError.METHOD_NOT_ALLOWED) {
			throw new MethodNotAllowedException(message);
		} else if (type === ServiceError.REQUEST_TIMED_OUT) {
			throw new RequestTimeoutException(message);
		} else if (type === ServiceError.UNSUPPORTED_MEDIA_TYPE) {
			throw new UnsupportedMediaTypeException(message);
		} else if (type === ServiceError.UNPROCESSABLE_ENTITY) {
			throw new UnprocessableEntityException(message);
		} else if (type === ServiceError.PAYLOAD_TOO_LARGE) {
			throw new PayloadTooLargeException(message);
		} else throw new NotFoundException(message);
	}

	handlePrismaError(
		error:
			| Prisma.PrismaClientUnknownRequestError
			| Prisma.PrismaClientKnownRequestError
			| Prisma.PrismaClientValidationError
	) {
		if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			throw new InternalServerErrorException('Prisma Client Unknown Request Error');
		} else if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const { code, message } = error;
			const errorMessageArr = message.split('\n');
			throw new InternalServerErrorException(
				`Prisma error code: ${code}, message: ${errorMessageArr.slice(-1)}`
			);
		} else {
			console.log(error);
			throw new InternalServerErrorException('Prisma Client Validation Error');
		}
	}
}
