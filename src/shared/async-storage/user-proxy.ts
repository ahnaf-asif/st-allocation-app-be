import { InjectableProxy } from 'nestjs-cls';

@InjectableProxy()
export class UserProxy {
  id: number;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  isAdmin: boolean;
}
