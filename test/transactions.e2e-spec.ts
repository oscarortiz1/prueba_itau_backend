import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let httpServer: any;
  let authToken: string;
  let createdId: string;

  const email = 'usuario@test.com';
  const password = 'ClaveSegura123';

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri();
    process.env.JWT_SECRET = 'e2e-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('registers a user', async () => {
    const response = await request(httpServer)
      .post('/api/v1/auth/register')
      .send({ email, password, confirmPassword: password })
      .expect(201);

    expect(response.body).toMatchObject({
      message: 'Usuario registrado correctamente.',
      user: {
        email,
      },
    });
  });

  it('authenticates the user and returns a token', async () => {
    const response = await request(httpServer)
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user.email', email);

    authToken = response.body.accessToken;
  });

  it('creates a transaction', async () => {
    const payload = {
      type: 'income',
      title: 'Pago de nómina',
      amount: 1200.5,
      category: 'Salario',
      occurredAt: new Date('2025-01-15T10:00:00.000Z').toISOString(),
    };

    const response = await request(httpServer)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      type: payload.type,
      title: payload.title,
      amount: payload.amount,
      category: payload.category,
    });
    expect(response.body).toHaveProperty('id');

    createdId = response.body.id;
  });

  it('retrieves the created transaction', async () => {
    const response = await request(httpServer)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', createdId);
  });

  it('updates the transaction', async () => {
    const response = await request(httpServer)
      .patch(`/api/v1/transactions/${createdId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Pago actualizado', amount: 1300 })
      .expect(200);

    expect(response.body).toMatchObject({
      id: createdId,
      title: 'Pago actualizado',
      amount: 1300,
    });
  });

  it('deletes the transaction', async () => {
    await request(httpServer)
      .delete(`/api/v1/transactions/${createdId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);
  });

  it('returns an empty list after deletion', async () => {
    const response = await request(httpServer)
      .get('/api/v1/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
