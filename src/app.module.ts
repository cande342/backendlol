import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { RiotModule } from './riot/riot.module';
import { RankingModule } from './rankings/rankingModule.module';

@Module({
  imports: [FirebaseModule, RiotModule, RankingModule],
  controllers: [AppController],
  providers: [AppService,  FirebaseService],
})
export class AppModule {}
