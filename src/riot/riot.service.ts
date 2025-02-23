import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RiotService {
        private readonly API_KEY = 'RGAPI-95f10313-6d65-48bd-87c1-67bd59c82051';
        private readonly BASE_URL = 'https://americas.api.riotgames.com/'
      
        constructor(private readonly httpService: HttpService) {}
      
        async getMatchIdsByPuuid(puuid: string, count: number = 10): Promise<string[]> {
          const url = `${this.BASE_URL}lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
      
          try {
            const response = await lastValueFrom(
              this.httpService.get(url, { headers: { 'X-Riot-Token': this.API_KEY } })
            );
            return response?.data || [];
          } catch (error) {
            console.error('❌ Error obteniendo partidas:', error.response?.data || error.message);
            return [];
          }
        }
      
        async getMatchDetails(matchId: string): Promise<any> {
          const url = `${this.BASE_URL}lol/match/v5/matches/${matchId}`;
      
          try {
            const response = await lastValueFrom(
              this.httpService.get(url, { headers: { 'X-Riot-Token': this.API_KEY } })
            );
            return response?.data || null;
          } catch (error) {
            console.error(`❌ Error obteniendo detalles de la partida ${matchId}:`, error.response?.data || error.message);
            return null;
          }
        }
      
        async getSummonerPuuid(summonerName: string, tag: string): Promise<string | null> {
          const url = `${this.BASE_URL}riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}`;
      
          try {
            const response = await lastValueFrom(
              this.httpService.get(url, { headers: { 'X-Riot-Token': this.API_KEY } })
            );
            return response?.data?.puuid || null;
          } catch (error) {
            console.error(`❌ Error obteniendo PUUID para ${summonerName}#${tag}:`, error.response?.data || error.message);
            return null;
          }
        }
}
