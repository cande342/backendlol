import { ApiProperty } from '@nestjs/swagger';

export class CounterPickDTO {
  @ApiProperty({ example: 'Ashe', description: 'Nombre del Mid' })
  name: string;

  @ApiProperty({ example: 65, description: 'Winrate del Mid enemigo' })
  winrate: number;

  @ApiProperty({ example: 100, description: 'Número de partidas jugadas' })
  games: number;
}