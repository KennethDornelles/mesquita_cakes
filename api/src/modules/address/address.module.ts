import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [AddressResolver, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
