import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CounterPickDTO } from './dto/counterpick.dto';
import { CounterpickResponseDTO } from './dto/counterpick-response.dto';

@Injectable()
export class RankingService {

    constructor(private readonly firebaseService: FirebaseService) {}

    async getBestSupportsForAdc(adc: string) {
      return this.firebaseService.getBestSupportsForAdc(adc);
    }
  
    async getBestAdcsForSupport(support: string) {
      return this.firebaseService.getBestAdcsForSupport(support);
    }

    async getBestCountersForMidChamp(midChamp: string): Promise<CounterpickResponseDTO> {
      const data = await this.firebaseService.getBestCountersForMidChamp(midChamp);
    
      return {
        mid: midChamp, 
        counters: data.counters || [] 
      };
    }
    
}
