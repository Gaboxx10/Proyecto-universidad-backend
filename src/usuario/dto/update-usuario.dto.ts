import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, ValidateIf } from "class-validator";

export class UpdateUsuarioDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(25, { message: 'El nombre no debe exceder los 25 caracteres.' })
    @IsOptional()
    nombres?: string;

    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
    @MaxLength(25, { message: 'El apellido no debe exceder los 25 caracteres.' })
    @IsOptional()
    apellidos?: string;

    @IsString({ message: 'La cédula de identidad debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La cédula de identidad debe tener al menos 8 caracteres.' })
    @MaxLength(11, { message: 'La cédula de identidad no debe exceder los 11 caracteres.' })
    @IsOptional()
    cedula_identidad?: string;

    @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
    @MinLength(11, { message: 'El teléfono debe tener 11 caracteres.' })
    @MaxLength(11, { message: 'El teléfono debe tener exactamente 11 caracteres.' })
    @IsOptional()
    telefono?: string;

    @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
    @MinLength(3, { message: 'El correo electrónico debe tener al menos 3 caracteres.' })
    @MaxLength(30, { message: 'El correo electrónico no debe exceder los 30 caracteres.' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    @IsOptional()
    direccion?: string;

    @MinLength(5, { message: 'El nombre de usuario debe tener al menos 5 caracteres.' })
    @MaxLength(20, { message: 'El nombre de usuario no debe exceder los 20 caracteres.' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
    @IsOptional()
    user_name?: string;

    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(25, { message: 'La contraseña no debe exceder los 25 caracteres.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsOptional()
    contraseña?: string;

    @MinLength(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(25, { message: 'La confirmación de la contraseña no debe exceder los 25 caracteres.' })
    @IsString({ message: 'La confirmación de la contraseña debe ser una cadena de texto.' })
    @IsOptional()
    confirm_contraseña?: string;

    // Validación de que la contraseña y la confirmación coincidan
    @ValidateIf((o) => o.contraseña && o.confirm_contraseña)
    @Matches(
      /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
      { message: 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número.' }
    )
    @IsOptional()
    validatePasswords() {
        if (this.contraseña !== this.confirm_contraseña) {
            throw new Error('Las contraseñas no coinciden.');
        }
    }
}
