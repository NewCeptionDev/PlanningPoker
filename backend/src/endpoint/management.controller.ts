/* eslint-disable @typescript-eslint/no-shadow */
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ManagementService } from 'src/service/management.service'

@Controller('api/management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {
    // Dependency Injection
  }

  @Post('createNewLobby')
  createNewLobby(
    @Body('lobbyName') lobbyName: string,
    @Body('availableCards') availableCards: string[]
  ): { lobbyId: string } {
    const lobbyId = this.managementService.createNewLobby(lobbyName, availableCards)
    return {
      lobbyId,
    }
  }

  @Get('existsLobby/:lobbyId')
  existsLobby(@Param('lobbyId') lobbyId: string): { exists: boolean } {
    const exists = this.managementService.hasLobby(lobbyId)
    return {
      exists,
    }
  }

  @Get('lobbyInformation/:lobbyId')
  lobbyInformation(@Param('lobbyId') lobbyId: string): {
    lobbyExists: boolean
    lobbyName?: string
  } {
    const lobby = this.managementService.getLobby(lobbyId)
    if (!lobby) {
      return {
        lobbyExists: false,
      }
    }
    return {
      lobbyExists: true,
      lobbyName: lobby.name,
    }
  }
}
