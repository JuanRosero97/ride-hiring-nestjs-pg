import { IsLongitude, IsLatitude, IsNotEmpty, IsInt } from 'class-validator';

export class newTravelDto {
  @IsNotEmpty()
  @IsLatitude()
  lat_start: string;

  @IsNotEmpty()
  @IsLongitude()
  long_start: string;
}

export class closeTravelDto {
  @IsNotEmpty()
  @IsLatitude()
  lat_end: string;

  @IsNotEmpty()
  @IsLongitude()
  long_end: string;

  @IsNotEmpty()
  @IsInt()
  installments: number;
}
