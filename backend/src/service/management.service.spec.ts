import { Test, TestingModule } from '@nestjs/testing'
import { ManagementService } from './management.service'

describe('ManagementService', () => {
  let service: ManagementService

  const lobbyId = '12345678'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementService],
    }).compile()

    service = module.get<ManagementService>(ManagementService)
  })

  describe('createNewLobby', () => {
    it('should create new lobby when createNewLobby', () => {
      const lobbyName = 'Test'
      const availableCards: string[] = []

      const result = service.createNewLobby(lobbyName, availableCards)

      // @ts-expect-error accessing private property
      expect(service.activeLobbies.has(result)).toBe(true)
      // @ts-expect-error accessing private property
      const lobby = service.activeLobbies.get(result)
      expect(lobby?.name).toBe(lobbyName)
      expect(lobby?.cardCollection).toEqual(availableCards)
    })

    it('should use different id when createNewLobby given id is already used', () => {
      jest.mock('crypto', () => ({
        randomUUID: jest.fn().mockImplementationOnce(() => lobbyId),
      }))
      // @ts-expect-error accessing private property
      service.activeLobbies.set(lobbyId, {} as any)

      const result = service.createNewLobby('Test', [])
      expect(result).not.toBe(lobbyId)
    })
  })

  describe('discardLobby', () => {
    it('should discard lobby when discardLobby', () => {
      // @ts-expect-error accessing private property
      service.activeLobbies.set(lobbyId, {} as any)
      service.discardLobby(lobbyId)
      // @ts-expect-error accessing private property
      expect(service.activeLobbies.has(lobbyId)).toBe(false)
    })
  })

  describe('getLobby', () => {
    it('should get lobby when getLobby', () => {
      // @ts-expect-error accessing private property
      service.activeLobbies.set(lobbyId, {} as any)
      const result = service.getLobby(lobbyId)
      expect(result).not.toBeUndefined()
    })

    it('should return undefined when getLobby given id is not used', () => {
      const result = service.getLobby(lobbyId)
      expect(result).toBeUndefined()
    })
  })

  describe('hasLobby', () => {
    it('should return true when hasLobby', () => {
      // @ts-expect-error accessing private property
      service.activeLobbies.set(lobbyId, {} as any)
      const result = service.hasLobby(lobbyId)
      expect(result).toBe(true)
    })

    it('should return false when hasLobby given id is not used', () => {
      const result = service.hasLobby(lobbyId)
      expect(result).toBe(false)
    })
  })

  describe('getLobbies', () => {
    it('should return lobbies when getLobbies', () => {
      // @ts-expect-error accessing private property
      service.activeLobbies.set(lobbyId, {} as any)
      const result = service.getLobbies()
      expect(result).not.toBeUndefined()
      expect(result.size).toBe(1)
      expect(result.has(lobbyId)).toBe(true)
    })
  })
})
