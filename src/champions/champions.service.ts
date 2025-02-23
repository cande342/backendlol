import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { RiotService } from 'src/riot/riot.service';

interface SupportData {
  name: string;
  winrate: number;
  games: number;
}

export interface CombinationData {
  adc: string;
  best_supports: SupportData[];
  total_games: number;
}

@Injectable()
export class ChampionsService {
  constructor(
    @Inject('FIRESTORE') private readonly firestore: Firestore,
    private readonly riotService: RiotService
  ) {
  }


  // ACA ESTAN TODOS LOS METODOS QUE PARTICIPAN EN LA CARGA DE DATOS DE FIREBASE
  async fetchAndStoreMatchData(puuid: string) {
  
    const matchIds = await this.riotService.getMatchIdsByPuuid(puuid, 10);
    if (matchIds.length === 0) {
      console.warn(`⚠️ No se encontraron partidas para el PUUID: ${puuid}`);
      return { message: 'No se encontraron partidas para el jugador' };
    }
  
    for (const matchId of matchIds) {
  
      const matchData = await this.riotService.getMatchDetails(matchId);
      if (!matchData) {
        console.warn(`⚠️ No se pudieron obtener detalles para la partida: ${matchId}`);
        continue;
      }
  
      const queueId = matchData.info.queueId;
      if (queueId !== 420 && queueId !== 440) {
        console.warn(`⚠️ Partida ${matchId} no es clasificatoria (queueId: ${queueId}), ignorando.`);
        continue;
      }

  
      const participants = matchData.info.participants;
  
      const player = participants.find(p => p.puuid === puuid);
      if (!player) {
        console.warn(`⚠️ Jugador con PUUID ${puuid} no encontrado en la partida ${matchId}`);
        continue;
      }
      const teamId = player.teamId;
  
      const teamPlayers = participants.filter(p => p.teamId === teamId);
  
      // Filtrar jugadores en la bot lane basándose en teamPosition
      const adc = teamPlayers.find(p => p.teamPosition === 'BOTTOM');
      const supp = teamPlayers.find(p => p.teamPosition === 'UTILITY');
  
      // Validar que se hayan encontrado ADC y Support
      if (!adc || !supp) {
        console.warn(`⚠️ No se pudo determinar ADC y SUPP en ${matchId}`);
        continue;
      }
  
      // Guardar los datos en Firestore
      await this.updateCombinationData(adc.championName, supp.championName, adc.win);
      await this.updateCombinationData(supp.championName, adc.championName, adc.win, true);
    }

    return { message: 'Datos de partidas procesados correctamente' };
  }



  async updateCombinationData(adc: string, supp: string, win: boolean, isSupportMode = false) {
    try {
      console.log(`🔥 Se ejecutó updateCombinationData con ${adc} y ${supp}, win: ${win}`);
      const collectionName = isSupportMode ? 'combinations-supports' : 'combinations';
      const docRef = this.firestore.collection(collectionName).doc(adc);
      const doc = await docRef.get();
  
      // Inicializar datos si el documento no existe
      let data: CombinationData = doc.exists
        ? (doc.data() as CombinationData)
        : { adc, best_supports: [], total_games: 0 };
  
      // Validar estructura de datos
      if (!Array.isArray(data.best_supports)) {
        data.best_supports = [];
      }
  
      // Encontrar o crear el soporte
      let supportIndex = data.best_supports.findIndex(s => s.name === supp);
      if (supportIndex === -1) {
        data.best_supports.push({ name: supp, winrate: 0, games: 0 });
        supportIndex = data.best_supports.length - 1;
      }
  
      // Actualizar estadísticas
      data.best_supports[supportIndex].games += 1;
      if (win) {
        data.best_supports[supportIndex].winrate =
          ((data.best_supports[supportIndex].games - 1) * data.best_supports[supportIndex].winrate + 100) /
          data.best_supports[supportIndex].games;
      } else {
        data.best_supports[supportIndex].winrate =
          ((data.best_supports[supportIndex].games - 1) * data.best_supports[supportIndex].winrate) /
          data.best_supports[supportIndex].games;
      }
      data.total_games += 1;
  
      // Ordenar y truncar los mejores soportes
      data.best_supports.sort((a, b) => {
        if (b.winrate !== a.winrate) {
          return b.winrate - a.winrate; // Primero por winrate
        }
        return b.games - a.games; // Luego por número de juegos
      });
      data.best_supports = data.best_supports.slice(0, 3);
  
      // Guardar los datos actualizados
      await docRef.set(data);
    } catch (error) {
      console.error(`⚠️ Error al actualizar la combinación para ${adc} y ${supp}:`, error.message);
    }
  }


  async getBestSupportsForADC(adc: string) {
    const doc = await this.firestore.collection('combinations').doc(adc).get();
    return doc.exists ? (doc.data() as CombinationData) : { adc, best_supports: [] };
  }


  async getBestADCsForSupport(support: string) {
    const snapshot = await this.firestore.collection('combinations-supports').get();
    
    let results: CombinationData[] = [];
    snapshot.forEach(doc => {
      const data = doc.data() as CombinationData;
      if (data.best_supports.some(s => s.name === support)) {
        results.push(data);
      }
    });

    return results.length > 0 ? results : { support, best_adcs: [] };
  }
}