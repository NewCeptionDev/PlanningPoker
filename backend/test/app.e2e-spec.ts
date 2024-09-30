import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/management/createNewLobby (POST)', async () => {
    request(app.getHttpServer())
      .post('/api/management/createNewLobby')
      .send({
        lobbyName: 'Test',
        availableCards: ['1', '2', '3'],
      })
      .expect(201)
      .then((response) => {
        expect(response.body.lobbyId).toBeDefined();
      });
  });

  it('/api/management/existsLobby/:lobbyId (GET) nonExisting', () => {
    return request(app.getHttpServer())
      .get('/api/management/existsLobby/12345678')
      .expect(200)
      .expect({
        exists: false,
      });
  });

  it('/api/management/existsLobby/:lobbyId (GET) existing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/management/createNewLobby')
      .send({
        lobbyName: 'Test',
        availableCards: ['1', '2', '3'],
      })
      .expect(201);
    return request(app.getHttpServer())
      .get('/api/management/existsLobby/' + response.body.lobbyId)
      .expect(200)
      .expect({
        exists: true,
      });
  });

  it('/api/management/lobbyInformation/:lobbyId (GET) nonExisting', () => {
    return request(app.getHttpServer())
      .get('/api/management/lobbyInformation/12345678')
      .expect(200)
      .expect({
        lobbyExists: false,
      });
  });

  it('/api/management/lobbyInformation/:lobbyId (GET) existing', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/management/createNewLobby')
      .send({
        lobbyName: 'Test',
        availableCards: ['1', '2', '3'],
      })
      .expect(201);
    return request(app.getHttpServer())
      .get('/api/management/lobbyInformation/' + response.body.lobbyId)
      .expect(200)
      .expect({
        lobbyExists: true,
        lobbyName: 'Test',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
