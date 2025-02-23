import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChampionsService } from './champions/champions.service';
import { ChampionsController } from './champions/champions.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { RiotModule } from './riot/riot.module';
import { RankingModule } from './rankings/rankingModule.module';

@Module({
  imports: [FirebaseModule, RiotModule, RankingModule],
  controllers: [AppController, ChampionsController],
  providers: [AppService, ChampionsService,  FirebaseService],
})
export class AppModule {}
