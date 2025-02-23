import { Module } from '@nestjs/common';
import { RankingController } from './rankingController.controller';
import { RankingService } from './rankingService.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule], 
  controllers: [RankingController], 
  providers: [RankingService],
})
export class RankingModule {}