import { Controller, Post } from '@nestjs/common';
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
}
