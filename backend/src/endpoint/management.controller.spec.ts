import { Test, TestingModule } from '@nestjs/testing';
import { ManagementController } from './managment.controller';
import { ManagementService } from 'src/service/management.service';
import { Lobby } from 'src/model/Lobby';

describe('ManagementController', () => {
  let controller: ManagementController;
  let service: ManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementController],
      providers: [ManagementService],
    }).compile();

    controller = module.get<ManagementController>(ManagementController);
    service = module.get<ManagementService>(ManagementService);
  });

  describe('createNewLobby', () => {
    it('should create new lobby when createNewLobby', () => {
      const createNewLobbySpy = jest
        .spyOn(service, 'createNewLobby')
        .mockReturnValue('12345678');

      const result = controller.createNewLobby('Test', ['1', '2', '3']);

      expect(createNewLobbySpy).toHaveBeenCalledWith('Test', ['1', '2', '3']);
      expect(result).toEqual({
        lobbyId: '12345678',
      });
    });
  });

  describe('existsLobby', () => {
    it('should return true when existsLobby', () => {
      const existsLobbySpy = jest
        .spyOn(service, 'hasLobby')
        .mockReturnValue(true);

      const result = controller.existsLobby('12345678');

      expect(existsLobbySpy).toHaveBeenCalledWith('12345678');
      expect(result).toEqual({
        exists: true,
      });
    });
  });

  describe('lobbyInformation', () => {
    it('should return lobby information when lobbyInformation', () => {
      const getLobbySpy = jest
        .spyOn(service, 'getLobby')
        .mockReturnValue({ name: 'Test' } as Lobby);

      const result = controller.lobbyInformation('12345678');

      expect(getLobbySpy).toHaveBeenCalledWith('12345678');
      expect(result).toEqual({
        lobbyExists: true,
        lobbyName: 'Test',
      });
    });

    it('should return false when lobbyInformation given id is not used', () => {
      const getLobbySpy = jest
        .spyOn(service, 'getLobby')
        .mockReturnValue(undefined);

      const result = controller.lobbyInformation('12345678');

      expect(getLobbySpy).toHaveBeenCalledWith('12345678');
      expect(result).toEqual({
        lobbyExists: false,
      });
    });
  });
});
