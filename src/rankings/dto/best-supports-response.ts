// src/ranking/dto/best-supports-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BestSupportDto } from './best-supports.dto';

export class BestSupportsResponseDto {
  @ApiProperty({ example: 'Ashe', description: 'Nombre del ADC' })
  adc: string;

  @ApiProperty({ type: [BestSupportDto], description: 'Lista de los mejores supports para el ADC' })
  best_supports: BestSupportDto[];
}