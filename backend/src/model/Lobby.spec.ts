import { Socket } from 'socket.io';
import { Role } from './Role';
import { User } from './User';
import { Lobby } from './Lobby';
import { LobbyState } from './LobbyState';
import { send } from 'process';

describe('Lobby', () => {
  describe('toDisplayLobby', () => {
    it('should return the correct display lobby when toDisplayLobby given not full information', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      expect(lobby.toDisplayLobby(false)).toEqual({
        name: 'TestLobby',
        users: [
          {
            id: '1234',
            name: 'TestUser',
            roles: [Role.PLAYER],
            cardSelected: true,
            selectedCard: undefined,
          },
        ],
        cardCollection: ['1', '2'],
        state: LobbyState.OVERVIEW,
      });
    });

    it('should return the correct display lobby when toDisplayLobbyForUser given full information', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      expect(lobby.toDisplayLobby(true)).toEqual({
        name: 'TestLobby',
        users: [
          {
            id: '1234',
            name: 'TestUser',
            roles: [Role.PLAYER],
            selectedCard: '1',
            cardSelected: true,
          },
        ],
        cardCollection: ['1', '2'],
        state: LobbyState.OVERVIEW,
      });
    });
  });

  describe('toDisplayLobbyForUser', () => {
    it('should return the correct display lobby when toDisplayLobbyForUser', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const secondUser = new User(
        '4321',
        '4321',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user, secondUser],
        ['1', '2'],
        LobbyState.VOTING,
      );

      expect(lobby.toDisplayLobbyForUser(user.id)).toEqual({
        name: 'TestLobby',
        users: [
          {
            id: '1234',
            name: 'TestUser',
            roles: [Role.PLAYER],
            selectedCard: '1',
            cardSelected: true,
          },
          {
            id: '4321',
            name: 'TestUser',
            roles: [Role.PLAYER],
            cardSelected: true,
            selectedCard: undefined,
          },
        ],
        cardCollection: ['1', '2'],
        state: LobbyState.VOTING,
      });
    });

    it('should return the correct display lobby when toDisplayLobbyForUser given lobby state OVERVIEW', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const secondUser = new User(
        '4321',
        '4321',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user, secondUser],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      expect(lobby.toDisplayLobbyForUser(user.id)).toEqual({
        name: 'TestLobby',
        users: [
          {
            id: '1234',
            name: 'TestUser',
            roles: [Role.PLAYER],
            selectedCard: '1',
            cardSelected: true,
          },
          {
            id: '4321',
            name: 'TestUser',
            roles: [Role.PLAYER],
            cardSelected: true,
            selectedCard: '1',
          },
        ],
        cardCollection: ['1', '2'],
        state: LobbyState.OVERVIEW,
      });
    });
  });

  describe('addUser', () => {
    it('should add a user to the lobby and set as admin when addUser given first user in lobby', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      lobby.addUser(user);

      expect(lobby.users.length).toEqual(1);
      expect(lobby.users[0].roles).toContain(Role.ADMIN);
    });

    it('should add a user to the lobby when addUser given not first user in lobby', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const secondUser = new User(
        '4321',
        '4321',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [secondUser],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      lobby.addUser(user);

      expect(lobby.users.length).toEqual(2);
      expect(lobby.users[1].roles).not.toContain(Role.ADMIN);
    });

    it('should not add a user to the lobby when addUser given user already in lobby', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      lobby.addUser(user);

      expect(lobby.users.length).toEqual(1);
    });
  });

  describe('removeUser', () => {
    it('should remove a user from the lobby', () => {
      const socket = { id: '1234' } as Socket;
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      lobby.removeUser(socket);

      expect(lobby.users.length).toEqual(0);
    });
  });

  describe('resetSelectedCards', () => {
    it('should reset the lobby', () => {
      const user = new User(
        '1234',
        '1234',
        'TestUser',
        [Role.PLAYER],
        '1',
        {} as Socket,
      );
      const lobby = new Lobby(
        '1234',
        'TestLobby',
        [user],
        ['1', '2'],
        LobbyState.OVERVIEW,
      );

      lobby.resetSelectedCards();

      expect(lobby.users[0].selectedCard).toEqual(undefined);
    });
  });
});
