import { ApiProperty } from '@nestjs/swagger';

export class BestAdcDto {
  @ApiProperty({ example: 'Ashe', description: 'Nombre del ADC' })
  name: string;

  @ApiProperty({ example: 65, description: 'Winrate del ADC con el Support' })
  winrate: number;

  @ApiProperty({ example: 100, description: 'Número de partidas jugadas' })
  games: number;
}