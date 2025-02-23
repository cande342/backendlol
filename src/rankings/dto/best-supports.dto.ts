import { ApiProperty } from '@nestjs/swagger';

export class BestSupportDto {
  @ApiProperty({ example: 'Thresh', description: 'Nombre del support' })
  name: string;

  @ApiProperty({ example: 70, description: 'Winrate del support con el ADC' })
  winrate: number;

  @ApiProperty({ example: 50, description: 'Número de partidas jugadas' })
  games: number;
}