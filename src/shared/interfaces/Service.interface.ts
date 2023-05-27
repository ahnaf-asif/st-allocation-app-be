import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError
} from '@prisma/client/runtime';

export enum ServiceError {
	BAD_REQUEST = 'BAD_REQUEST',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
	NOT_ACCEPTABLE = 'NOT_ACCEPTABLE',
	REQUEST_TIMED_OUT = 'REQUEST_TIMED_OUT',
	CONFLICT_EXCEPTION = 'CONFLICT_EXCEPTION',
	PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
	UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
	UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
	NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
	METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
	BAD_GATEWAY = 'BAD_GATEWAY',
	SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
	GATEWAY_TIMED_OUT = 'GATEWAY_TIMED_OUT'
}

export interface BusinessError {
	type: ServiceError;
	message: string;
}

export interface IServiceData {
	data?: unknown;
	businessError?: BusinessError;
	prismaError?:
		| PrismaClientKnownRequestError
		| PrismaClientUnknownRequestError
		| PrismaClientValidationError;
}
