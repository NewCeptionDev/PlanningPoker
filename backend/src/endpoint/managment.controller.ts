import { Controller, Get, Param, Post } from '@nestjs/common';
import { ManagementService } from 'src/service/management.service';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('createNewLobby')
  createNewLobby(): { lobbyId: string } {
    const lobbyId = this.managementService.createNewLobby();
    return {
      lobbyId: lobbyId,
    };
  }

  @Get('existsLobby/:lobbyId')
  existsLobby(@Param('lobbyId') lobbyId: string): { exists: boolean } {
    console.log('called with: ' + lobbyId);
    const exists = ManagementService.activeLobbies.has(lobbyId);
    return {
      exists: exists,
    };
  }
}
