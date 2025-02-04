import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
  IsDefined,
} from 'class-validator';

export class UpdateClientDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(25, { message: 'El nombre no debe exceder los 25 caracteres.' })
  @IsOptional()
  nombres: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  @MaxLength(25, { message: 'El apellido no debe exceder los 25 caracteres.' })
  @IsOptional()
  apellidos: string;

  @IsString({ message: 'La cédula de identidad debe ser una cadena de texto.' })
  @MinLength(8, {
    message: 'La cédula de identidad debe tener al menos 8 caracteres.',
  })
  @MaxLength(11, {
    message: 'La cédula de identidad no debe exceder los 11 caracteres.',
  })
  @Matches(/^\d+$/, {
    message: 'La cédula de identidad solo puede contener números.',
  })
  @IsOptional()
  cedula_identidad: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(11, { message: 'El teléfono debe tener al menos 11 caracteres.' })
  @MaxLength(11, { message: 'El teléfono no debe exceder los 11 caracteres.' })
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números.' })
  @IsOptional()
  telefono: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsOptional()
  direccion: string;

  @IsEmail(
    {},
    {
      message: 'El email debe ser una dirección de correo electrónico válida.',
    },
  )
  @MinLength(3, { message: 'El email debe tener al menos 3 caracteres.' })
  @MaxLength(30, { message: 'El email no debe exceder los 30 caracteres.' })
  @IsOptional()
  email: string;

  @ValidateIf(
    (o) =>
      !o.nombres &&
      !o.apellidos &&
      !o.cedula_identidad &&
      !o.telefono &&
      !o.direccion &&
      !o.email,
  )
  @IsDefined({
    message:
      'Debe actualizar al menos uno de los campos: nombre, apellido, cédula, teléfono, dirección o email.',
  })
  atLeastOneFieldMustBePresent: boolean;
}
