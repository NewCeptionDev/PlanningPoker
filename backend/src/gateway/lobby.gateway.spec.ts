import { Test, TestingModule } from '@nestjs/testing';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from 'src/service/lobby.service';
import { Role } from 'src/model/Role';
import { Socket } from 'socket.io';
import { ManagementService } from 'src/service/management.service';

describe('LobbyGateway', () => {
  let gateway: LobbyGateway;
  let service: LobbyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyGateway, LobbyService, ManagementService],
    }).compile();

    gateway = module.get<LobbyGateway>(LobbyGateway);
    service = module.get<LobbyService>(LobbyService);
  });

  describe('handleJoinLobby', () => {
    it('should join lobby when joinLobby', () => {
      const lobbyId = '1234';
      const userId = '32323';
      const name = 'TestUser';
      const role = Role.PLAYER;
      const socket = { id: '23232' } as Socket;

      const joinLobbySpy = jest
        .spyOn(service, 'addUserToLobby')
        .mockImplementation();

      gateway.handleJoinLobby(lobbyId, userId, name, role, socket);

      expect(joinLobbySpy).toHaveBeenCalledWith(
        lobbyId,
        userId,
        name,
        role,
        socket,
      );
    });
  });

  describe('handleSelectCard', () => {
    it('should select card when selectCard', () => {
      const lobbyId = '1234';
      const cardId = '32323';
      const socket = { id: '23232' } as Socket;

      const selectCardSpy = jest
        .spyOn(service, 'selectCardForUser')
        .mockImplementation();

      gateway.handleSelectCard(lobbyId, cardId, socket);

      expect(selectCardSpy).toHaveBeenCalledWith(lobbyId, socket, cardId);
    });
  });

  describe('handleLeaveLobby', () => {
    it('should leave lobby when leaveLobby', () => {
      const lobbyId = '1234';
      const socket = { id: '23232' } as Socket;

      const leaveLobbySpy = jest
        .spyOn(service, 'removeUserFromLobby')
        .mockImplementation();

      gateway.handleLeaveLobby(lobbyId, socket);

      expect(leaveLobbySpy).toHaveBeenCalledWith(lobbyId, socket);
    });
  });

  describe('handleShowCards', () => {
    it('should show cards when showCards', () => {
      const lobbyId = '1234';
      const socket = { id: '23232' } as Socket;

      const showCardsSpy = jest
        .spyOn(service, 'showCards')
        .mockImplementation();

      gateway.handleShowCards(lobbyId, socket);

      expect(showCardsSpy).toHaveBeenCalledWith(lobbyId, socket);
    });
  });

  describe('handleReset', () => {
    it('should reset lobby when reset', () => {
      const lobbyId = '1234';
      const socket = { id: '23232' } as Socket;

      const resetLobbySpy = jest
        .spyOn(service, 'resetLobby')
        .mockImplementation();

      gateway.handleReset(lobbyId, socket);

      expect(resetLobbySpy).toHaveBeenCalledWith(lobbyId, socket);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from all lobbies when disconnect', () => {
      const socket = { id: '23232' } as Socket;

      const removeUserFromAllLobbiesSpy = jest
        .spyOn(service, 'removeUserFromAllLobbies')
        .mockImplementation();

      gateway.handleDisconnect(socket);

      expect(removeUserFromAllLobbiesSpy).toHaveBeenCalledWith(socket);
    });
  });
});
