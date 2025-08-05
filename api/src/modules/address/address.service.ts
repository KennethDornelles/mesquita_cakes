import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { ViaCepResponse } from './dto/viacep-response.dto';
import { Address } from './entities/address.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async create(
    createAddressInput: CreateAddressInput,
    userId: string,
  ): Promise<Address> {
    // Verificar se o CEP é válido usando ViaCEP
    const cepData = await this.getAddressByCep(createAddressInput.zipCode);

    if (cepData.erro) {
      throw new BadRequestException('CEP não encontrado');
    }

    // Verificar se os dados fornecidos são compatíveis com o ViaCEP
    const normalizedCep = createAddressInput.zipCode.replace('-', '');
    const viaCepNormalized = cepData.cep.replace('-', '');

    if (normalizedCep !== viaCepNormalized) {
      throw new BadRequestException('CEP inválido');
    }

    // Se está marcando como padrão, desmarcar outros endereços
    if (createAddressInput.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        street: createAddressInput.street,
        number: createAddressInput.number,
        complement: createAddressInput.complement,
        neighborhood: createAddressInput.neighborhood,
        city: createAddressInput.city,
        state: createAddressInput.state,
        zipCode: normalizedCep,
        isDefault: createAddressInput.isDefault || false,
        userId,
      },
    });

    return this.mapPrismaToAddress(address);
  }

  async findAll(): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      orderBy: { isDefault: 'desc' },
    });

    return addresses.map((address) => this.mapPrismaToAddress(address));
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return this.mapPrismaToAddress(address);
  }

  async findByUser(userId: string): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    return addresses.map((address) => this.mapPrismaToAddress(address));
  }

  async getAddressByCep(cep: string): Promise<ViaCepResponse> {
    try {
      const normalizedCep = cep.replace(/\D/g, '');

      if (normalizedCep.length !== 8) {
        throw new BadRequestException('CEP deve ter 8 dígitos');
      }

      const url = `https://viacep.com.br/ws/${normalizedCep}/json/`;
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao consultar CEP no ViaCEP');
    }
  }

  async update(
    id: string,
    updateAddressInput: UpdateAddressInput,
    userId: string,
  ): Promise<Address> {
    const existingAddress = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException(
        `Address with ID ${id} not found or does not belong to user`,
      );
    }

    // Se está atualizando o CEP, validar com ViaCEP
    if (updateAddressInput.zipCode) {
      const cepData = await this.getAddressByCep(updateAddressInput.zipCode);

      if (cepData.erro) {
        throw new BadRequestException('CEP não encontrado');
      }
    }

    // Se está marcando como padrão, desmarcar outros endereços
    if (updateAddressInput.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id },
      data: {
        street: updateAddressInput.street,
        number: updateAddressInput.number,
        complement: updateAddressInput.complement,
        neighborhood: updateAddressInput.neighborhood,
        city: updateAddressInput.city,
        state: updateAddressInput.state,
        zipCode: updateAddressInput.zipCode?.replace(/\D/g, ''),
        isDefault: updateAddressInput.isDefault,
      },
    });

    return this.mapPrismaToAddress(address);
  }

  async remove(id: string, userId: string): Promise<Address> {
    const existingAddress = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException(
        `Address with ID ${id} not found or does not belong to user`,
      );
    }

    // Verificar se há pedidos associados a este endereço
    const ordersWithAddress = await this.prisma.order.count({
      where: { addressId: id },
    });

    if (ordersWithAddress > 0) {
      throw new ConflictException(
        'Cannot delete address that has associated orders',
      );
    }

    const address = await this.prisma.address.delete({
      where: { id },
    });

    // Se era o endereço padrão, marcar outro como padrão (se existir)
    if (address.isDefault) {
      const firstAddress = await this.prisma.address.findFirst({
        where: { userId },
      });

      if (firstAddress) {
        await this.prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return this.mapPrismaToAddress(address);
  }

  async setAsDefault(id: string, userId: string): Promise<Address> {
    const existingAddress = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException(
        `Address with ID ${id} not found or does not belong to user`,
      );
    }

    // Desmarcar todos os outros endereços como padrão
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Marcar este como padrão
    const address = await this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return this.mapPrismaToAddress(address);
  }

  private mapPrismaToAddress(prismaAddress: any): Address {
    return {
      id: prismaAddress.id,
      street: prismaAddress.street,
      number: prismaAddress.number,
      complement: prismaAddress.complement,
      neighborhood: prismaAddress.neighborhood,
      city: prismaAddress.city,
      state: prismaAddress.state,
      zipCode: prismaAddress.zipCode,
      isDefault: prismaAddress.isDefault,
      userId: prismaAddress.userId,
    };
  }
}
