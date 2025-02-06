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

export class CreateUsuarioDto {
  @IsString({ message: 'El campo "nombres" debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El campo "nombres" debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El campo "nombres" no puede exceder los 50 caracteres.' })
  @IsNotEmpty({ message: 'El campo "nombres" es obligatorio.' })
  nombres: string;

  @IsString({ message: 'El campo "apellidos" debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El campo "apellidos" debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El campo "apellidos" no puede exceder los 50 caracteres.' })
  @IsNotEmpty({ message: 'El campo "apellidos" es obligatorio.' })
  apellidos: string;

  @IsString({ message: 'El campo "cedula_identidad" debe ser un número entero.' })
  @Matches(/^\d+$/, { message: 'El campo "cedula_identidad" debe contener solo números.' })
  @MinLength(7, { message: 'La cédula de identidad debe tener al menos 7 dígitos.' })
  @MaxLength(10, { message: 'La cédula de identidad no puede tener más de 10 dígitos.' })
  @IsNotEmpty({ message: 'El campo "cedula_identidad" es obligatorio.' })
  cedula_identidad: string;

  @IsString({ message: 'El campo "telefono" debe ser una cadena de texto.' })
  @MinLength(11, { message: 'El campo "telefono" debe tener al menos 10 caracteres.' })
  @MaxLength(11, { message: 'El campo "telefono" no puede exceder los 15 caracteres.' })
  @Matches(/^\d+$/, { message: 'El campo "telefono" debe contener solo números.' })
  @IsNotEmpty({ message: 'El campo "telefono" es obligatorio.' })
  telefono: string;

  @IsEmail({}, { message: 'El campo "email" debe ser un correo electrónico válido.' })
  @IsNotEmpty({ message: 'El campo "email" es obligatorio.' })
  email: string;

  @IsString({ message: 'El campo "direccion" debe ser una cadena de texto.' })
  @MinLength(5, { message: 'El campo "direccion" debe tener al menos 5 caracteres.' })
  @MaxLength(100, { message: 'El campo "direccion" no puede exceder los 100 caracteres.' })
  @IsOptional()
  direccion: string;

  @IsString({ message: 'El campo "user_name" debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El campo "user_name" debe tener al menos 3 caracteres.' })
  @MaxLength(20, { message: 'El campo "user_name" no puede exceder los 20 caracteres.' })
  @IsNotEmpty({ message: 'El campo "user_name" es obligatorio.' })
  user_name: string;

  @IsString({ message: 'El campo "contraseña" debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(20, { message: 'La contraseña no puede exceder los 20 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  @IsNotEmpty({ message: 'El campo "contraseña" es obligatorio.' })
  contraseña: string;

  @IsString({ message: 'El campo "confirm_contraseña" debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(20, { message: 'La confirmación de la contraseña no puede exceder los 20 caracteres.' })
  @IsNotEmpty({ message: 'El campo "confirm_contraseña" es obligatorio.' })
   // Validación para comprobar que las contraseñas coincidan
   @ValidateIf((o) => o.contraseña && o.confirm_contraseña)
   @Matches(
     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
     {
       message: 'La confirmación de la contraseña debe coincidir con la contraseña.',
     }
   )
   @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria.' })
  @ValidateIf((o) => o.contraseña !== undefined)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La confirmación de la contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.',
  })
  confirm_contraseña: string;

  @IsString({ message: 'El campo "rol" debe ser una cadena de texto.' })
  @Matches(/^(ROLE|ASISTENTE|MECANICO)$/, {
    message: 'El rol debe ser ASISTENTE, ADMIN o MECANICO.',
  })
  @IsNotEmpty({ message: 'El campo "rol" es obligatorio.' })
  rol: string;

}
