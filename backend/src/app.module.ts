import { LobbyGateway } from './gateway/lobby.gateway'
import { LobbyService } from './service/lobby.service'
import { ManagementController } from './endpoint/management.controller'
import { ManagementService } from './service/management.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [ManagementController],
  providers: [ManagementService, LobbyGateway, LobbyService],
})
export class AppModule {}
