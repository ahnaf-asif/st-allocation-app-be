import { Injectable } from '@nestjs/common';

import { ServiceErrorHandler } from './service-error-handler';
import { IServiceData } from '@/shared/interfaces';

@Injectable()
export class ControllerErrorHandler {
  constructor(private serviceErrorHandler: ServiceErrorHandler) {}
  handleResponse(resp: IServiceData) {
    if (resp.businessError) {
      return this.serviceErrorHandler.handleBusinessError(resp.businessError);
    } else if (resp.prismaError) {
      return this.serviceErrorHandler.handlePrismaError(resp.prismaError);
    } else return resp.data;
  }
}
