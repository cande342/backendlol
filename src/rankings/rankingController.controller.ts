import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './rankingService.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BestSupportsResponseDto } from './dto/best-supports-response';
import { BestAdcsResponseDto } from './dto/best-adcs-response.dto';
import { CounterpickResponseDTO } from './dto/counterpick-response.dto';

@Controller('ranking')
@ApiTags('Ranking') 
export class RankingController {

  ///ESTOS SON LOS ENDPOINTS PARA EL FRONT
  // OBTENER LOS ADCS: http://localhost:3000/ranking/best-adcs/Milio
  //OBTENER LOS SUPPORTS: http://localhost:3000/ranking/best-supports/Caitlyn

    constructor(private readonly rankingsService: RankingService) {}

    /**
       * Endpoint para obtener los mejores supports para un ADC específico.
       */
    @Get('best-supports/:adc')
    @ApiOperation({ summary: 'Obtener los mejores supports para un ADC' })
    @ApiResponse({
      status: 200,
      description: 'Lista de los mejores supports para el ADC',
      type: BestSupportsResponseDto, // Usa el DTO como tipo de respuesta
    })
    @ApiResponse({ status: 404, description: 'No se encontraron datos para el ADC especificado' })
    async getBestSupportsForAdc(@Param('adc') adc: string): Promise<BestSupportsResponseDto> {
      const bestSupports = await this.rankingsService.getBestSupportsForAdc(adc);
      return {
        adc,
        best_supports: bestSupports,
      };
    }

  /**
   * Endpoint para obtener los mejores ADCs para un Support específico.
   */
    @Get('best-adcs/:support')
    @ApiOperation({ summary: 'Obtener los mejores ADCs para un Support' })
    @ApiResponse({
      status: 200,
      description: 'Lista de los mejores ADCs para el Support',
      type: BestAdcsResponseDto,
    })
    @ApiResponse({ status: 404, description: 'No se encontraron datos para el Support especificado' })
    async getBestAdcsForSupport(@Param('support') support: string): Promise<BestAdcsResponseDto> {
      const bestAdcs = await this.rankingsService.getBestAdcsForSupport(support);
      return {
        support,
        best_supports: bestAdcs,
      };
    }

      /**
       * Endpoint para obtener los mejores counters para un Mid Laner.
       */
    @Get('best-counters/:midChamp')
    @ApiOperation({ summary: 'Obtener los mejores counters para un Mid Laner' })
    @ApiResponse({
      status: 200,
      description: 'Lista de los mejores counters para el mid laner',
      type: CounterpickResponseDTO, // Usa el DTO adecuado
    })
    @ApiResponse({ status: 404, description: 'No se encontraron counters para el Mid Laner especificado' })
    async getBestCountersForMidChamp(@Param('midChamp') midChamp: string): Promise<CounterpickResponseDTO> {
      return this.rankingsService.getBestCountersForMidChamp(midChamp);
    }

}
