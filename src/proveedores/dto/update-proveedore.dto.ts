import {
  IsString,
  IsOptional,
  MinLength,
  ValidateIf,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class UpdateProveedoreDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsOptional()
  nombre?: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsOptional()
  telefono?: string;

  @IsString({ message: 'El RIF debe ser una cadena de texto.' })
  @IsOptional()
  @MinLength(10, { message: 'El RIF debe tener al menos 10 caracteres.' })
  @Matches(/^\d+$/, {
    message: 'El RIF solo puede contener números.',
  })
  rif?: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  direccion?: string;

  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsOptional()
  nota?: string;

  @ValidateIf(
    (o) => !o.nombre && !o.telefono && !o.rif && !o.direccion && !o.nota,
  )
  @IsNotEmpty({
    message:
      'Debe actualizar al menos uno de los campos: nombre, teléfono, RIF, dirección o nota.',
  })
  atLeastOneFieldMustBePresent: boolean;
}
