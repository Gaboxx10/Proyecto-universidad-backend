import { IsString, IsDateString, IsArray, IsInt, IsNumber, Min, Max, ValidateNested, ArrayMinSize, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class DetallePresupuestoDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;

  @IsString()
  @IsOptional()
  nota: string;
}

export class CreatePresupuestoDto {
  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetallePresupuestoDto)
  detalles: DetallePresupuestoDto[];
}
