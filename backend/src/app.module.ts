import { ManagementService } from './service/management.service';
import { ManagementController } from './endpoint/management.controller';
import { LobbyGateway } from './gateway/lobby.gateway';
import { Module } from '@nestjs/common';
import { LobbyService } from './service/lobby.service';

@Module({
  imports: [],
  controllers: [ManagementController],
  providers: [ManagementService, LobbyGateway, LobbyService],
})
export class AppModule {}
