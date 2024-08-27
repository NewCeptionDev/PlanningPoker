import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ManagementService } from './management.service';
import { Socket } from 'socket.io';
import { LobbyGateway } from 'src/gateway/lobby.gateway';
import { Role } from 'src/model/Role';
import { LobbyState } from 'src/model/LobbyState';
import { Lobby } from 'src/model/Lobby';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(forwardRef(() => LobbyGateway))
    private lobbyGateway: LobbyGateway,
  ) {}

  selectCardForUser(lobbyId: string, socket: Socket, cardId: string) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    const user = lobby!.users.find((u) => u.socketId === socket.id);
    if (!user) {
      return;
    }

    if (lobby!.cardCollection.includes(cardId)) {
      user.selectCard(cardId);
    }

    this.lobbyGateway.sendCardSelectionInformation(lobby!, user);
  }

  showCards(lobbyId: string, socket: Socket) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    if (!this.validateUserIsInLobbyAndIsAdming(lobby!, socket)) {
      return;
    }

    lobby!.state = LobbyState.OVERVIEW;
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!);
  }

  resetLobby(lobbyId: string, socket: Socket) {
    if (!ManagementService.activeLobbies.has(lobbyId)) {
      return;
    }

    const lobby = ManagementService.activeLobbies.get(lobbyId);
    if (!this.validateUserIsInLobbyAndIsAdming(lobby!, socket)) {
      return;
    }

    lobby!.state = LobbyState.VOTING;
    lobby!.users.forEach((u) => {
      u.selectCard(undefined);
    });
    this.lobbyGateway.sendFullLobbyInformationToLobby(lobby!);
  }

  private validateUserIsInLobbyAndIsAdming(lobby: Lobby, socket: Socket) {
    const user = lobby.users.find((u) => u.socketId === socket.id);
    if (!user) {
      return false;
    }

    if (!user.roles.includes(Role.ADMIN)) {
      return false;
    }

    return true;
  }
}
