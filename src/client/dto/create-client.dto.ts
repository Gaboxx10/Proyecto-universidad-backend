import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'El tipo de cliente debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de cliente es obligatorio.' })
  @Matches(/^(PERSONA_NATURAL|EMPRESA)$/, {
    message: 'El tipo de cliente debe ser PERSONA_NATURAL o EMPRESA.',
  })
  tipo_cliente: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombres: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  apellidos: string;

  @IsString({
    message: 'La cédula de identidad o RIF debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'La cédula de identidad o RIF es obligatoria.' })
  @MinLength(7, {
    message: 'La cédula de identidad o RIF debe tener al menos 8 caracteres.',
  })
  @MaxLength(11, {
    message: 'La cédula de identidado RIF no debe exceder los 11 caracteres.',
  })
  @Matches(/^\d+$/, {
    message: 'La cédula de identidad o RIF solo puede contener números.',
  })
  cedula_identidad: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @MinLength(11, { message: 'El teléfono debe tener al menos 11 caracteres.' })
  @MaxLength(11, { message: 'El teléfono no debe exceder los 11 caracteres.' })
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números.' })
  telefono: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  direccion: string;

  @IsEmail(
    {},
    {
      message: 'El email debe ser una dirección de correo electrónico válida.',
    },
  )
  @IsOptional()
  email: string;
}
