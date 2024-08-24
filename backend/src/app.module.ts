import { ManagementService } from './service/management.service';
import { ManagementController } from './endpoint/managment.controller';
import { LobbyGateway } from './gateway/lobby.gateway';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ManagementController],
  providers: [ManagementService, LobbyGateway],
})
export class AppModule {}
