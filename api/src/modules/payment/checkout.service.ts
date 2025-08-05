import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PixCheckoutResponse } from './dto/pix-checkout.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CheckoutService {
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
    });

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${orderId} not found or does not belong to user`,
      );
    }

    // Gerar dados do PIX
    const paymentId = randomUUID();
    const amount = parseFloat(order.total.toString());
    const pixCode = this.generatePixCode(amount);
    const pixQrCode = this.generatePixQrCode(pixCode);

    // Atualizar o pedido para indicar que está aguardando pagamento PIX
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: 'PIX',
        paymentStatus: 'PENDING',
      },
    });

    return {
      paymentId,
      pixCode,
      pixQrCode,
      expiresInMinutes: 30,
      instructions:
        'Escaneie o QR Code com o app do seu banco ou copie e cole o código PIX. O pagamento expira em 30 minutos.',
      amount,
    };
  }

  private generatePixCode(amount: number): string {
    // Simulação de código PIX simplificado
    const amountStr = amount.toFixed(2);
    const timestamp = Date.now();
    return `00020126580014br.gov.bcb.pix0136${randomUUID()}520400005303986540${amountStr.length}${amountStr}5802BR5913MESQUITA CAKES6014SAO PAULO62070503***${timestamp}6304XXXX`;
  }

  private generatePixQrCode(pixCode: string): string {
    // Em produção, usar uma biblioteca real de QR Code como qrcode
    // Aqui vamos retornar uma URL base64 simulada
    const base64QrCode = Buffer.from(`QR_CODE_FOR_${pixCode}`).toString(
      'base64',
    );
    return `data:image/png;base64,${base64QrCode}`;
  }

  async simulatePixPayment(orderId: string, userId: string): Promise<boolean> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        paymentStatus: 'PENDING',
      },
    });

    if (!order) {
      return false;
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
}
