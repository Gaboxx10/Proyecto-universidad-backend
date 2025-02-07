import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsString,
  IsNumber,
  IsInt,
  Min,
  ArrayNotEmpty,
  ValidateNested,
  Matches,
} from 'class-validator';

export class DetalleOrdenDto {
  @IsNotEmpty({ message: 'La observación es obligatoria.' })
  @IsString({ message: 'La observación debe ser una cadena de texto.' })
  observacion: string;

  @IsNotEmpty({ message: 'La solución es obligatoria.' })
  @IsString({ message: 'La solución debe ser una cadena de texto.' })
  solucion: string;

  @IsNotEmpty({ message: 'La descripción del repuesto es obligatoria.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  descripcion: string;

  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La nota debe tener un valor si se proporciona.' })
  nota?: string;
}

export class CreateOrdenesTrabajoDto {
  @IsString({ message: 'La placa del vehículo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa del vehículo es obligatoria.' })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'La placa solo debe contener letras y números.',
  })
  placa_vehiculo: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de entrega estimada debe ser una fecha válida.' },
  )
  f_entrega_estimada?: string;

  @IsArray({ message: 'Las observaciones deben ser un array.' })
  @ArrayNotEmpty({ message: 'Debe haber al menos una observación.' })
  @ValidateNested({ each: true, message: 'Cada observación debe ser válida.' })
  @Type(() => DetalleOrdenDto)
  detalles: DetalleOrdenDto[];

  @IsOptional()
  @IsString({ message: 'La nota adicional debe ser una cadena de texto.' })
  @IsNotEmpty({
    message: 'La nota adicional debe tener un valor si se proporciona.',
  })
  nota_adicional?: string;
}
