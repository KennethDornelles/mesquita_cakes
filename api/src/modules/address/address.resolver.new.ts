import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { FindByCepInput } from './dto/find-by-cep.input';
import { ViaCepResponse } from './dto/viacep-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, Roles } from '../../decorators';
import { Role } from '../../enums';
import { User } from '../user/entities/user.entity';
import { PrismaService } from '../../database/prisma/prisma.service';

@Resolver(() => Address)
export class AddressResolver {
  constructor(
    private readonly addressService: AddressService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Address)
  createAddress(
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.addressService.create(createAddressInput, currentUser.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Address], { name: 'addresses' })
  findAll() {
    return this.addressService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Address, { name: 'address' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.addressService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Address], { name: 'myAddresses' })
  findMyAddresses(@CurrentUser() currentUser: User) {
    return this.addressService.findByUser(currentUser.id);
  }

  @Query(() => ViaCepResponse, { name: 'getAddressByCep' })
  getAddressByCep(@Args('findByCepInput') findByCepInput: FindByCepInput) {
    return this.addressService.getAddressByCep(findByCepInput.cep);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Address)
  updateAddress(
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.addressService.update(
      updateAddressInput.id,
      updateAddressInput,
      currentUser.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Address)
  removeAddress(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.addressService.remove(id, currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Address)
  setAddressAsDefault(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.addressService.setAsDefault(id, currentUser.id);
  }

  // Field Resolvers
  @ResolveField(() => User)
  user(@Parent() address: Address) {
    return this.prisma.user.findUnique({
      where: { id: address.userId },
    });
  }
}
