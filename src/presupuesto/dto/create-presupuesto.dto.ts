import {
  IsString,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  Matches,
  Max,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class DetallePresupuestoDto {
  @IsString({
    message: 'La descripción del repuesto debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'La descripción del repuesto es obligatoria.' })
  descripcion: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  cantidad: number;

  @IsNumber({}, { message: 'El precio unitario debe ser un número.' })
  @Min(0, { message: 'El precio unitario no puede ser menor a 0.' })
  precio_unitario: number;

  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsOptional()
  @IsNotEmpty({ message: 'La nota debe tener un valor si se proporciona.' })
  nota?: string;
}

export class CreatePresupuestoDto {
  @IsString({ message: 'La placa debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa del vehículo es obligatoria.' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'La placa solo puede contener letras y números.',
  })
  placa: string;

  @IsArray({ message: 'Los detalles deben ser un array de objetos.' })
  @ArrayMinSize(1, {
    message: 'Debe haber al menos un detalle en el presupuesto.',
  })
  @ValidateNested({ each: true, message: 'Cada detalle debe ser válido.' })
  @Type(() => DetallePresupuestoDto)
  detalles: DetallePresupuestoDto[];
}
