import { IsString, IsArray, ArrayNotEmpty, IsObject, ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiagnosticoDto {
  @IsString()
  @IsNotEmpty()
  placa_vehiculo: string; 

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ObservacionDto) 
  observaciones: ObservacionDto[]; 

}

export class ObservacionDto {
  @IsString()
  @IsNotEmpty()
  observacion: string; 

  @IsString()
  @IsNotEmpty()
  causa_prob: string; 

  @IsString()
  @IsNotEmpty()
  solucion: string; 

  @IsString()
  @IsOptional()
  nota: string; 
  
}
