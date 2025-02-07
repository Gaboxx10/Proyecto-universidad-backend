import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsString({ message: 'El campo "nombres" debe ser una cadena de texto.' })
  @MinLength(3, {
    message: 'El campo "nombres" debe tener al menos 3 caracteres.',
  })
  @MaxLength(25, {
    message: 'El campo "nombres" no puede exceder los 25 caracteres.',
  })
  @IsOptional()
  nombres?: string;

  @IsString({ message: 'El campo "apellidos" debe ser una cadena de texto.' })
  @MinLength(3, {
    message: 'El campo "apellidos" debe tener al menos 3 caracteres.',
  })
  @MaxLength(25, {
    message: 'El campo "apellidos" no puede exceder los 25 caracteres.',
  })
  @IsOptional()
  apellidos?: string;

  @IsString({
    message: 'El campo "cedula_identidad" debe ser una cadena de texto.',
  })
  @Matches(/^\d+$/, {
    message: 'El campo "cedula_identidad" debe contener solo números.',
  })
  @MinLength(8, {
    message: 'La cédula de identidad debe tener al menos 8 caracteres.',
  })
  @MaxLength(11, {
    message: 'La cédula de identidad no puede exceder los 11 caracteres.',
  })
  @IsOptional()
  cedula_identidad?: string;

  @IsString({ message: 'El campo "telefono" debe ser una cadena de texto.' })
  @Matches(/^\d{11}$/, {
    message: 'El campo "telefono" debe contener exactamente 11 dígitos.',
  })
  @IsOptional()
  telefono?: string;

  @IsEmail(
    {},
    { message: 'El campo "email" debe ser un correo electrónico válido.' },
  )
  @MinLength(3, {
    message: 'El campo "email" debe tener al menos 3 caracteres.',
  })
  @MaxLength(30, {
    message: 'El campo "email" no puede exceder los 30 caracteres.',
  })
  @IsOptional()
  email?: string;

  @IsString({ message: 'El campo "direccion" debe ser una cadena de texto.' })
  @IsOptional()
  direccion?: string;

  @MinLength(5, {
    message: 'El campo "user_name" debe tener al menos 5 caracteres.',
  })
  @MaxLength(20, {
    message: 'El campo "user_name" no puede exceder los 20 caracteres.',
  })
  @IsString({ message: 'El campo "user_name" debe ser una cadena de texto.' })
  @IsOptional()
  user_name?: string;

  @IsString({ message: 'El campo "contraseña" debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(20, {
    message: 'La contraseña no puede exceder los 20 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  @IsOptional({ message: 'El campo "contraseña" es obligatorio.' })
  contraseña: string;

  @IsString({
    message: 'El campo "confirm_contraseña" debe ser una cadena de texto.',
  })
  @MinLength(8, {
    message:
      'La confirmación de la contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(20, {
    message:
      'La confirmación de la contraseña no puede exceder los 20 caracteres.',
  })
  @IsOptional({ message: 'El campo "confirm_contraseña" es obligatorio.' })

  @ValidateIf((o) => o.contraseña && o.confirm_contraseña)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La confirmación de la contraseña debe coincidir con la contraseña.',
  })
  @IsOptional({ message: 'La confirmación de la contraseña es obligatoria.' })
  @ValidateIf((o) => o.contraseña !== undefined)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La confirmación de la contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  confirm_contraseña: string;

  @IsString({ message: 'El campo "rol" debe ser una cadena de texto.' })
  @Matches(/^(ASISTENTE|MECANICO)$/, {
    message: 'El rol debe ser ASISTENTE O MECANICO.',
  })
  @IsOptional()
  rol: string;
}
