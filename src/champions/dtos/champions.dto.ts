import { IsString, IsNumber } from 'class-validator';

export class ChampionDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsNumber()
  winrate: number;
}
