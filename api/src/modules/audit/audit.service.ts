import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface AuditLogData {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(data: AuditLogData): void {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        userId: data.userId || 'anonymous',
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        metadata: data.metadata,
        ip: data.ip,
        userAgent: data.userAgent,
      };

      console.log('🔍 AUDIT LOG:', JSON.stringify(logEntry, null, 2));
    } catch (error) {
      console.error('❌ Failed to log audit entry:', error);
    }
  }

  logCreate(
    userId: string,
    resource: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): void {
    this.log({
      userId,
      action: AuditAction.CREATE,
      resource,
      resourceId,
      metadata,
    });
  }

  logUpdate(
    userId: string,
    resource: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): void {
    this.log({
      userId,
      action: AuditAction.UPDATE,
      resource,
      resourceId,
      metadata,
    });
  }

  logDelete(
    userId: string,
    resource: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): void {
    this.log({
      userId,
      action: AuditAction.DELETE,
      resource,
      resourceId,
      metadata,
    });
  }

  logLogin(userId: string, ip?: string, userAgent?: string): void {
    this.log({
      userId,
      action: AuditAction.LOGIN,
      resource: 'auth',
      ip,
      userAgent,
    });
  }

  logLogout(userId: string, ip?: string, userAgent?: string): void {
    this.log({
      userId,
      action: AuditAction.LOGOUT,
      resource: 'auth',
      ip,
      userAgent,
    });
  }
}
