import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role enum',
});
