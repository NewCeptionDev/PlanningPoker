/**
 * @jest-environment node
 */

describe('actions', () => {
  const redirectMockFunction = jest.fn().mockImplementation()
  const default_env = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
    process.env = { ...default_env }
    jest.mock('next/navigation', () => ({
      redirect: redirectMockFunction,
    }))
  })

  describe('createLobby', () => {
    it('should redirect to lobby when createLobby given call is successful', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: true,
        json: async () => {
          return {
            lobbyId: '1234',
          }
        },
      }
      jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')
      formdata.append('cardGroup', 'Simple')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(redirectMockFunction).toHaveBeenCalledWith('/1234')
    })

    it('should not redirect when createLobby given call is not successful', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: false,
        json: async () => {},
      }
      jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')
      formdata.append('cardGroup', 'Simple')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(redirectMockFunction).not.toHaveBeenCalled()
    })

    it('should not redirect when createLobby given lobbyName not given', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      const formdata = new FormData()
      formdata.append('cardGroup', 'Simple')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when createLobby given cardGroup not given', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should not redirect when createLobby given cardGroup is custom and customCards not given', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')
      formdata.append('cardGroup', 'Custom')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('should correctly parse customCards when createLobby given cardGroup is custom and customCards given', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: true,
        json: async () => {
          return {
            lobbyId: '1234',
          }
        },
      }
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')
      formdata.append('cardGroup', 'Custom')
      formdata.append('customCards', 'a,b,c')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(fetchSpy).toHaveBeenCalledWith('http://localhost/api/management/createNewLobby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lobbyName: 'test',
          availableCards: ['a', 'b', 'c'],
        }),
      })
    })

    it('should use adjusted url when createLobby given custom url', async () => {
      process.env = {
        ...default_env,
        NEXT_PUBLIC_CUSTOM_URL: 'https://example.com',
      }

      // @ts-expect-error only partially defined
      const response: Response = {
        ok: true,
        json: async () => {
          return {
            lobbyId: '1234',
          }
        },
      }
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyName', 'test')
      formdata.append('cardGroup', 'Custom')
      formdata.append('customCards', 'a,b,c')

      const actions = require('src/app/actions')
      await actions.createLobby(formdata)

      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/api/management/createNewLobby', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lobbyName: 'test',
          availableCards: ['a', 'b', 'c'],
        }),
      })
    })
  })

  describe('joinLobby', () => {
    it('should redirect to lobby when joinLobby given call is successful', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: true,
        json: async () => {
          return {
            exists: true,
          }
        },
      }
      jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyId', '1234')

      const actions = require('src/app/actions')
      await actions.joinLobby(formdata)

      expect(redirectMockFunction).toHaveBeenCalledWith('/1234')
    })

    it('should not redirect when joinLobby given lobby does not exist', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: true,
        json: async () => {
          return {
            exists: false,
          }
        },
      }
      jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyId', '1234')

      const actions = require('src/app/actions')
      await actions.joinLobby(formdata)

      expect(redirectMockFunction).not.toHaveBeenCalled()
    })

    it('should not redirect when joinLobby given call is not successful', async () => {
      // @ts-expect-error only partially defined
      const response: Response = {
        ok: false,
        json: async () => {},
      }
      jest.spyOn(global, 'fetch').mockResolvedValue(response)

      const formdata = new FormData()
      formdata.append('lobbyId', '1234')

      const actions = require('src/app/actions')
      await actions.joinLobby(formdata)

      expect(redirectMockFunction).not.toHaveBeenCalled()
    })

    it('should not redirect when joinLobby given lobbyId not given', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch')

      const formdata = new FormData()

      const actions = require('src/app/actions')
      await actions.joinLobby(formdata)

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('fetchLobbyInformation', () => {
    it('should call fetch when fetchLobbyInformation', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({} as Response)

      const actions = require('src/app/actions')
      await actions.fetchLobbyInformation('1234')

      expect(fetchSpy).toHaveBeenCalledWith('http://localhost/api/lobbyInformation/1234', {
        method: 'GET',
      })
    })
  })
})
