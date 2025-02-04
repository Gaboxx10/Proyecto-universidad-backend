import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateProveedoreDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @Matches(/^\d+$/, { message: 'El teléfono debe contener solo números.' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  telefono: string;

  @IsString({ message: 'El RIF debe ser una cadena de texto.' })
  @Matches(/^\d+$/, { message: 'El RIF debe contener solo números.' }) 
  @IsOptional()
  @MinLength(10, { message: 'El RIF debe tener al menos 10 caracteres.' })
  rif?: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  direccion?: string;

  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsOptional()
  nota?: string;
}
