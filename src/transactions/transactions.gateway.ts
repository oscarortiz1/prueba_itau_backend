import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Transaction } from './domain/entities/transaction.entity';

interface GatewayClient extends Socket {
  data: Socket['data'] & { userId?: string };
}

@Injectable()
@WebSocketGateway({ namespace: 'transactions', cors: { origin: true, credentials: true } })
export class TransactionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(TransactionsGateway.name);

  async handleConnection(client: GatewayClient): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      this.logger.warn('Conexion rechazada: token no provisto');
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('auth.jwtSecret'),
      });
      const userId = payload.sub as string;
      client.data.userId = userId;
      client.join(this.room(userId));
      this.logger.debug(`Cliente conectado a sala ${this.room(userId)}`);
    } catch (error) {
      this.logger.warn(`Conexion rechazada: token invalido (${error.message})`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: GatewayClient): void {
    if (client.data?.userId) {
      client.leave(this.room(client.data.userId));
    }
  }

  emitCreated(userId: string, transaction: Transaction): void {
    this.server.to(this.room(userId)).emit('transaction.created', transaction);
  }

  emitUpdated(userId: string, transaction: Transaction): void {
    this.server.to(this.room(userId)).emit('transaction.updated', transaction);
  }

  emitDeleted(userId: string, transactionId: string): void {
    this.server.to(this.room(userId)).emit('transaction.deleted', { id: transactionId });
  }

  private extractToken(client: Socket): string | undefined {
    const { token } = client.handshake.auth as { token?: string };
    if (token) {
      return token;
    }

    const headerToken = client.handshake.headers.authorization;
    if (headerToken && headerToken.startsWith('Bearer ')) {
      return headerToken.substring(7);
    }

    const queryToken = client.handshake.query['token'];
    if (typeof queryToken === 'string') {
      return queryToken;
    }

    return undefined;
  }

  private room(userId: string): string {
    return `user:${userId}`;
  }
}
