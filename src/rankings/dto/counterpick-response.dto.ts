// src/ranking/dto/best-supports-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CounterPickDTO } from './counterpick.dto';


export class CounterpickResponseDTO {
  @ApiProperty({ example: 'Ashe', description: 'Nombre del ADC' })
  mid: string;

  @ApiProperty({ type: [CounterPickDTO], description: 'Lista de los mejores supports para el ADC' })
  counters: CounterPickDTO[];
}