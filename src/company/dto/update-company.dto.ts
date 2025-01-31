import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío si se proporciona.' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección no puede estar vacía si se proporciona.' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MinLength(11, { message: 'El teléfono debe tener al menos 11 caracteres.' })
  @MaxLength(11, { message: 'El teléfono no debe exceder los 11 caracteres.' })
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'El RIF debe ser una cadena de texto.' })
  @MinLength(10, { message: 'El RIF debe tener al menos 10 caracteres.' })
  @MaxLength(11, { message: 'El RIF no debe exceder los 11 caracteres.' })
  @IsNotEmpty({ message: 'El RIF no puede estar vacío si se proporciona.' })
  rif?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida.' })
  email?: string;

  @ValidateIf(
    (o) => !o.nombre && !o.direccion && !o.telefono && !o.rif && !o.email,
  )
  @IsNotEmpty({ message: 'Debe actualizar al menos uno de los campos: nombre, dirección, teléfono, RIF o email.' })
  atLeastOneFieldMustBePresent?: boolean;
}
