import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { Role } from 'src/model/Role';
import { Lobby } from 'src/model/Lobby';
import { LobbyState } from 'src/model/LobbyState';
import { LobbyService } from './lobby.service';
import { ManagementService } from './management.service';
import { LobbyGateway } from 'src/gateway/lobby.gateway';

describe('LobbyService', () => {
  let service: LobbyService;
  let lobbyGateway: LobbyGateway;
  let managementService: ManagementService;

  const lobbyId = '1234';
  const userId = '32323';
  const userName = 'TestUser';
  const role = Role.PLAYER;
  const socket = {} as Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyService, LobbyGateway, ManagementService],
    }).compile();

    service = module.get<LobbyService>(LobbyService);
    lobbyGateway = module.get<LobbyGateway>(LobbyGateway);
    managementService = module.get<ManagementService>(ManagementService);
  });

  it('should do nothing when addUserToLobby given lobby does not exist', () => {
    jest.spyOn(managementService, 'hasLobby').mockReturnValue(false);
    const joinRoomSpy = jest.spyOn(lobbyGateway, 'joinRoom');
    const getLobbySpy = jest.spyOn(managementService, 'getLobby');
    const sendLobbyInformationToEveryoneSpy = jest.spyOn(
      service,
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

    const joinRoomSpy = jest.spyOn(lobbyGateway, 'joinRoom').mockReturnValue();
    const sendLobbyInformationToEveryoneSpy = jest
      .spyOn(service, 'sendLobbyInformationToEveryone')
      .mockReturnValue();

    service.addUserToLobby(lobbyId, userId, userName, role, socket);

    expect(joinRoomSpy).toHaveBeenCalledWith(socket, lobbyId);
    expect(sendLobbyInformationToEveryoneSpy).toHaveBeenCalledWith(lobby);
    expect(lobby.users.length).toEqual(1);
    expect(lobby.users[0].id).toEqual(userId);
  });
});
