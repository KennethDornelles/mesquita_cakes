import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PixCheckoutResponse } from './dto/pix-checkout.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPixCheckout(
    orderId: string,
    userId: string,
  ): Promise<PixCheckoutResponse> {
    // Verificar se o pedido existe e pertence ao usuário
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new ForbiddenException('Pedido não encontrado ou sem permissão');
    }

    // Verificar se o pedido já foi processado
    if (order.paymentStatus !== 'PENDING') {
      throw new ConflictException('Pedido já foi processado');
    }

    // Gerar código PIX
    const pixCode = this.generatePixCode(Number(order.total), orderId);
    const pixQrCode = this.generateQrCode(pixCode);

    // Atualizar o pedido com informações do PIX
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: 'PIX',
      },
    });

    return {
      paymentId: `pix_${orderId}`,
      amount: Number(order.total),
      pixCode,
      pixQrCode,
      expiresInMinutes: 30,
      instructions:
        'Escaneie o QR Code com o app do seu banco ou copie e cole o código PIX.',
    };
  }

  async simulatePixPayment(orderId: string, userId: string): Promise<boolean> {
    // Verificar se o pedido existe e pertence ao usuário
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new ForbiddenException('Pedido não encontrado ou sem permissão');
    }

    if (order.paymentStatus === 'PAID') {
      throw new ConflictException('Pedido já foi pago');
    }

    // Simular pagamento aprovado
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    return true;
  }

  private generatePixCode(amount: number, orderId: string): string {
    // Implementação simplificada do código PIX brasileiro
    const merchantName = 'MESQUITA CAKES';
    const merchantCity = 'BRASILIA';
    const transactionId = orderId.substring(0, 25);

    // Formato básico do código PIX (EMV)
    const payload = [
      '00020126', // Payload Format Indicator
      '580014br.gov.bcb.pix2582br.gov.bcb.pix', // Merchant Account Information
      '52045273', // Merchant Category Code (5273 = Food delivery)
      '5303986', // Transaction Currency (986 = BRL)
      `54${amount.toFixed(2).replace('.', '')}`, // Transaction Amount
      '5802BR', // Country Code
      `59${String(merchantName.length).padStart(2, '0')}${merchantName}`, // Merchant Name
      `60${String(merchantCity.length).padStart(2, '0')}${merchantCity}`, // Merchant City
      `622605${String(transactionId.length).padStart(2, '0')}${transactionId}`, // Additional Data
      '6304', // CRC16 placeholder
    ].join('');

    // Em produção, calcular CRC16 real
    return payload + 'D123';
  }

  private generateQrCode(pixCode: string): string {
    // Em produção, usar biblioteca como qrcode para gerar QR Code real baseado no pixCode
    // Por enquanto, retornar um QR Code base64 simulado
    // TODO: Implementar QR Code real usando: qrcode.generate(pixCode)

    // Simulação baseada no comprimento do código PIX
    const qrSize = pixCode.length > 100 ? 'large' : 'small';
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==${qrSize}`;
  }
}
