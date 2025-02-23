import { ApiProperty } from '@nestjs/swagger';
import { BestAdcDto } from './best-adc.dto';

export class BestAdcsResponseDto {
  @ApiProperty({ example: 'Thresh', description: 'Nombre del Support' })
  support: string;

  @ApiProperty({ type: [BestAdcDto], description: 'Lista de los mejores ADCs para el Support' })
  best_supports: BestAdcDto[];
}