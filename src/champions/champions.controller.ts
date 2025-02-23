import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ChampionsService } from './champions.service';
import { RiotService } from '../riot/riot.service';

@Controller('champions')
export class ChampionsController {
  constructor(
    private readonly championsService: ChampionsService,
    private readonly riotService: RiotService
  ) {}

  @Get('fetch-data')
  async fetchData(
    @Query('summonerName') summonerName: string, 
    @Query('tag') tag: string
  ) {
    if (!summonerName || !tag) {
      throw new HttpException('El nombre del invocador y el tag son requeridos', HttpStatus.BAD_REQUEST);
    }
  
    const puuid = await this.riotService.getSummonerPuuid(summonerName, tag);
    if (!puuid) {
      throw new HttpException('No se encontró el jugador', HttpStatus.NOT_FOUND);
    }
    return this.championsService.fetchAndStoreMatchData(puuid);
  }
  

  @Get('best-supports/:adc')
  async getBestSupports(@Param('adc') adc: string) {
    if (!adc) {
      throw new HttpException('Debe proporcionar un ADC', HttpStatus.BAD_REQUEST);
    }

    return this.championsService.getBestSupportsForADC(adc);
  }

  @Get('best-adcs/:support')
  async getBestADCs(@Param('support') support: string) {
    if (!support) {
      throw new HttpException('Debe proporcionar un soporte', HttpStatus.BAD_REQUEST);
    }

    return this.championsService.getBestADCsForSupport(support);
  }
}
