import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LobbyGateway } from 'src/gateway/lobby.gateway';
import { LobbyService } from 'src/service/lobby.service';
import { ManagementService } from 'src/service/management.service';
import { io, Socket } from 'socket.io-client';
import { LobbyState } from 'src/model/LobbyState';

describe('LobbyGateway', () => {
  let app: INestApplication;
  let managementService: ManagementService;
  let ws: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [LobbyGateway, LobbyService, ManagementService],
    }).compile();

    app = moduleFixture.createNestApplication();
    managementService = app.get<ManagementService>(ManagementService);
    await app.listen(3000);

    ws = io('ws://localhost:3000');
  });

  it('should receive lobby information after joining', async () => {
    const lobbyId = managementService.createNewLobby('123', ['1', '2', '3']);

    const userId = '32323';
    const name = 'TestUser';
    const role = 'PLAYER';

    ws.emit('joinLobby', { lobbyId, userId, name, role });

    await new Promise<void>((resolve) => {
      ws.on('fullLobbyInformation', (data) => {
        expect(data).toBeDefined();
        expect.objectContaining({
          name,
          users: [expect.objectContaining({ id: userId, name, roles: [role] })],
          cardCollection: ['1', '2', '3'],
          state: LobbyState.VOTING,
        });
        resolve();
      });
    });
  });

  it('should receive updated lobby information after selecting card', async () => {
    const lobbyId = managementService.createNewLobby('123', ['1', '2', '3']);

    const userId = '32323';
    const name = 'TestUser';
    const role = 'PLAYER';

    ws.emit('joinLobby', { lobbyId, userId, name, role });
    ws.emit('selectCard', { lobbyId, cardId: '1' });

    let callCount = 0;
    await new Promise<void>((resolve) => {
      ws.on('fullLobbyInformation', (data) => {
        callCount++;

        if (callCount === 2) {
          expect(data).toBeDefined();
          expect.objectContaining({
            name,
            users: [
              expect.objectContaining({
                id: userId,
                name,
                roles: [role],
                selectedCard: '1',
              }),
            ],
            cardCollection: ['1', '2', '3'],
            state: LobbyState.VOTING,
          });
          resolve();
        }
      });
    });
  });

  it('should receive updated lobby information after show cards', async () => {
    const lobbyId = managementService.createNewLobby('123', ['1', '2', '3']);

    const userId = '32323';
    const name = 'TestUser';
    const role = 'PLAYER';

    ws.emit('joinLobby', { lobbyId, userId, name, role });
    ws.emit('selectCard', { lobbyId, cardId: '1' });
    ws.emit('showCards', { lobbyId });

    let callCount = 0;
    await new Promise<void>((resolve) => {
      ws.on('fullLobbyInformation', (data) => {
        callCount++;

        if (callCount === 3) {
          expect(data).toBeDefined();
          expect.objectContaining({
            name,
            users: [
              expect.objectContaining({
                id: userId,
                name,
                roles: [role],
                selectedCard: '1',
              }),
            ],
            cardCollection: ['1', '2', '3'],
            state: LobbyState.OVERVIEW,
          });
          resolve();
        }
      });
    });
  });

  it('should receive updated lobby information after reset', async () => {
    const lobbyId = managementService.createNewLobby('123', ['1', '2', '3']);

    const userId = '32323';
    const name = 'TestUser';
    const role = 'PLAYER';

    ws.emit('joinLobby', { lobbyId, userId, name, role });
    ws.emit('selectCard', { lobbyId, cardId: '1' });
    ws.emit('showCards', { lobbyId });
    ws.emit('reset', { lobbyId });

    let callCount = 0;
    await new Promise<void>((resolve) => {
      ws.on('fullLobbyInformation', (data) => {
        callCount++;

        if (callCount === 4) {
          expect(data).toBeDefined();
          expect.objectContaining({
            name,
            users: [
              expect.objectContaining({
                id: userId,
                name,
                roles: [role],
                selectedCard: undefined,
              }),
            ],
            cardCollection: ['1', '2', '3'],
            state: LobbyState.OVERVIEW,
          });
          resolve();
        }
      });
    });
  });

  it('should discard lobby after disconnect of last connected user', async () => {
    const lobbyId = managementService.createNewLobby('123', ['1', '2', '3']);

    const userId = '32323';
    const name = 'TestUser';
    const role = 'PLAYER';

    ws.emit('joinLobby', { lobbyId, userId, name, role });
    ws.emit('leaveLobby', { lobbyId, userId });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(managementService.hasLobby(lobbyId)).toBe(false);
  });

  afterAll(async () => {
    ws.close();
    await app.close();
  });
});
