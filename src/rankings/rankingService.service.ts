import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class RankingService {

    constructor(private readonly firebaseService: FirebaseService) {}

    async getBestSupportsForAdc(adc: string) {
      return this.firebaseService.getBestSupportsForAdc(adc);
    }
  
    async getBestAdcsForSupport(support: string) {
      return this.firebaseService.getBestAdcsForSupport(support);
    }
}
