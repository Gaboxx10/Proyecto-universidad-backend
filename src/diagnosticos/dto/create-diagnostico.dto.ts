import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiagnosticoDto {
  @IsString({ message: 'La placa del vehículo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa del vehículo es obligatoria.' })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'La placa solo puede contener letras y números, sin símbolos.',
  })
  placa_vehiculo: string;

  @IsArray({ message: 'Las observaciones deben ser un array.' })
  @ArrayNotEmpty({ message: 'Debe haber al menos una observación.' })
  @ValidateNested({ each: true, message: 'Cada observación debe ser válida.' })
  @Type(() => ObservacionDto)
  observaciones: ObservacionDto[];
}

export class ObservacionDto {
  @IsString({ message: 'La observación debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La observación es obligatoria.' })
  observacion: string;

  @IsString({ message: 'La causa probable debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La causa probable es obligatoria.' })
  causa_prob: string;

  @IsString({ message: 'La solución debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La solución es obligatoria.' })
  solucion: string;

  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsOptional()
  @IsNotEmpty({
    message: 'La nota no puede estar vacía si se proporciona.',
    always: true,
  })
  nota?: string;
}
