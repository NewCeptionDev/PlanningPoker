import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { Role } from 'src/model/Role';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';
import { LobbyService } from './lobby.service';
import { ManagementService } from './management.service';
import { LobbyGateway } from 'src/gateway/lobby.gateway';
import { User } from 'src/model/User';

describe('LobbyService', () => {
  let service: LobbyService;
  let lobbyGateway: LobbyGateway;
  let managementService: ManagementService;

  const lobbyId = '1234';
  const userId = '32323';
  const socketId = '23232';
  const userName = 'TestUser';
  const role = Role.PLAYER;
  const socket = { id: socketId } as Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyService, LobbyGateway, ManagementService],
    }).compile();

    service = module.get<LobbyService>(LobbyService);
    lobbyGateway = module.get<LobbyGateway>(LobbyGateway);
    managementService = module.get<ManagementService>(ManagementService);
  });

  describe('addUserToLobby', () => {
    it('should do nothing when addUserToLobby given lobby does not exist', () => {
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
      const joinRoomSpy = jest.spyOn(lobbyGateway, 'joinRoom');
      const getLobbySpy = jest.spyOn(managementService, 'getLobby');
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        service as any,
        'sendLobbyInformationToEveryone',
      );

      service.addUserToLobby(lobbyId, userId, userName, role, socket);

      expect(joinRoomSpy).not.toHaveBeenCalled();
      expect(getLobbySpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should create user and join lobby when addUserToLobby given lobby exists', () => {
      const lobby = new Lobby(lobbyId, 'Test', [], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const joinRoomSpy = jest
        .spyOn(lobbyGateway, 'joinRoom')
        .mockImplementation();
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.addUserToLobby(lobbyId, userId, userName, role, socket);

      expect(joinRoomSpy).toHaveBeenCalledWith(socket, lobbyId);
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalledWith(lobby);
      expect(lobby.users.length).toEqual(1);
      expect(lobby.users[0].id).toEqual(userId);
    });
  });

  describe('removeUserFromLobby', () => {
    it('should do nothing when removeUserFromLobby given lobby does not exist', () => {
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
      const leaveRoomSpy = jest.spyOn(lobbyGateway, 'leaveRoom');
      const getLobbySpy = jest.spyOn(managementService, 'getLobby');
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        service as any,
        'sendLobbyInformationToEveryone',
      );

      service.removeUserFromLobby(lobbyId, socket);

      expect(leaveRoomSpy).not.toHaveBeenCalled();
      expect(getLobbySpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should remove user from lobby when removeUserFromLobby given lobby exists', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const secondUser = new User(
        '23422',
        '32324',
        userName,
        [Role.PLAYER],
        undefined,
        {
          id: '32324',
        } as Socket,
      );
      const lobby = new Lobby(
        lobbyId,
        'Test',
        [user, secondUser],
        [],
        LobbyState.VOTING,
      );
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const leaveRoomSpy = jest
        .spyOn(lobbyGateway, 'leaveRoom')
        .mockImplementation();
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();
      const discardLobbySpy = jest
        .spyOn(managementService, 'discardLobby')
        .mockImplementation();

      service.removeUserFromLobby(lobbyId, socket);

      expect(leaveRoomSpy).toHaveBeenCalledWith(socket, lobbyId);
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalledWith(lobby);
      expect(discardLobbySpy).not.toHaveBeenCalled();
      expect(lobby.users.length).toEqual(1);
      expect(lobby.users[0].id).toEqual(secondUser.id);
    });

    it('should remove user from lobby when removeUserFromLobby and discard lobby given lobby exists and has only one user', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const leaveRoomSpy = jest
        .spyOn(lobbyGateway, 'leaveRoom')
        .mockImplementation();
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        service as any,
        'sendLobbyInformationToEveryone',
      );
      const discardLobbySpy = jest
        .spyOn(managementService, 'discardLobby')
        .mockImplementation();

      service.removeUserFromLobby(lobbyId, socket);

      expect(leaveRoomSpy).toHaveBeenCalledWith(socket, lobbyId);
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
      expect(discardLobbySpy).toHaveBeenCalledWith(lobbyId);
      expect(lobby.users.length).toEqual(0);
    });

    it('should do nothing when removeUserFromLobby given user is not in lobby', () => {
      const secondUser = new User(
        '23422',
        '32324',
        userName,
        [Role.PLAYER],
        undefined,
        {
          id: '32324',
        } as Socket,
      );
      const lobby = new Lobby(
        lobbyId,
        'Test',
        [secondUser],
        [],
        LobbyState.VOTING,
      );
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const leaveRoomSpy = jest.spyOn(lobbyGateway, 'leaveRoom');
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        service as any,
        'sendLobbyInformationToEveryone',
      );
      const discardLobbySpy = jest.spyOn(managementService, 'discardLobby');

      service.removeUserFromLobby(lobbyId, socket);

      expect(leaveRoomSpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
      expect(discardLobbySpy).not.toHaveBeenCalled();
      expect(lobby.users.length).toEqual(1);
      expect(lobby.users[0].id).toEqual(secondUser.id);
    });
  });

  describe('selectCardForUser', () => {
    it('should do nothing when selectCardForUser given lobby does not exist', () => {
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
      const getLobbySpy = jest.spyOn(managementService, 'getLobby');
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        service as any,
        'sendLobbyInformationToEveryone',
      );

      service.selectCardForUser(lobbyId, socket, undefined);

      expect(getLobbySpy).not.toHaveBeenCalled();
      expect(validateUserSpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when selectCardForUser given user is not in lobby', () => {
      const lobby = new Lobby(lobbyId, 'Test', [], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.selectCardForUser(lobbyId, socket, undefined);

      expect(validateUserSpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when selectCardForUser given user is not a player', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.OBSERVER],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.selectCardForUser(lobbyId, socket, undefined);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when selectCardForUser given selected card is not valid', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.selectCardForUser(lobbyId, socket, '1');

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should update the selected card when selectCardForUser given selected card undefined', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        '1',
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.selectCardForUser(lobbyId, socket, undefined);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalled();
      expect(user.selectedCard).toBeUndefined();
    });

    it('should update the selected card when selectCardForUser given selected card not undefined', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const lobby = new Lobby(
        lobbyId,
        'Test',
        [user],
        ['1'],
        LobbyState.VOTING,
      );
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsPlayer',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(service as any, 'sendLobbyInformationToEveryone')
        .mockImplementation();

      service.selectCardForUser(lobbyId, socket, '1');

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalled();
      expect(user.selectedCard).toBe('1');
    });
  });

  describe('showCards', () => {
    it('should do nothing when showCards given lobby does not exist', () => {
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
      const getLobbySpy = jest.spyOn(managementService, 'getLobby');
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.showCards(lobbyId, socket);

      expect(getLobbySpy).not.toHaveBeenCalled();
      expect(validateUserSpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when showCards given user is not in lobby', () => {
      const lobby = new Lobby(lobbyId, 'Test', [], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.showCards(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when showCards given user is not admin', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.showCards(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when showCards given lobby is already in state OVERVIEW', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.ADMIN],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.OVERVIEW);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.showCards(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should update lobby state when showCards', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.ADMIN],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(lobbyGateway, 'sendFullLobbyInformationToLobby')
        .mockImplementation();

      service.showCards(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalled();
      expect(lobby.state).toEqual(LobbyState.OVERVIEW);
    });
  });

  describe('resetLobby', () => {
    it('should do nothing when resetLobby given lobby does not exist', () => {
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
      const getLobbySpy = jest.spyOn(managementService, 'getLobby');
      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.resetLobby(lobbyId, socket);

      expect(getLobbySpy).not.toHaveBeenCalled();
      expect(validateUserSpy).not.toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when resetLobby given user is not in lobby', () => {
      const lobby = new Lobby(lobbyId, 'Test', [], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.resetLobby(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when resetLobby given user is not admin', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.PLAYER],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.resetLobby(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should do nothing when resetLobby given lobby is already in state VOTING', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.ADMIN],
        undefined,
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.VOTING);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest.spyOn(
        lobbyGateway,
        'sendFullLobbyInformationToLobby',
      );

      service.resetLobby(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).not.toHaveBeenCalled();
    });

    it('should update lobby state when resetLobby', () => {
      const user = new User(
        userId,
        socketId,
        userName,
        [Role.ADMIN],
        '1',
        socket,
      );
      const lobby = new Lobby(lobbyId, 'Test', [user], [], LobbyState.OVERVIEW);
      jest.spyOn(managementService, 'hasLobby').mockReturnValue(true);
      jest.spyOn(managementService, 'getLobby').mockReturnValue(lobby);

      const validateUserSpy = jest.spyOn(
        service as any,
        'validateUserIsInLobbyAndIsAdmin',
      );
      const sendLobbyInformationToEveryoneSpy = jest
        .spyOn(lobbyGateway, 'sendFullLobbyInformationToLobby')
        .mockImplementation();

      service.resetLobby(lobbyId, socket);

      expect(validateUserSpy).toHaveBeenCalled();
      expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalled();
      expect(lobby.state).toEqual(LobbyState.VOTING);
      expect(user.selectedCard).toBeUndefined();
    });
  });
});
