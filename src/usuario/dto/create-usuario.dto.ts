import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, ValidateIf } from "class-validator";

export class CreateUsuarioDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    @MaxLength(25, { message: 'El nombre no debe exceder los 25 caracteres.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    nombres: string;

    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
    @MaxLength(25, { message: 'El apellido no debe exceder los 25 caracteres.' })
    @IsNotEmpty({ message: 'El apellido es obligatorio.' })
    apellidos: string;

    @IsString({ message: 'La cédula de identidad debe ser una cadena de texto.' })
    @MinLength(8, { message: 'La cédula de identidad debe tener al menos 8 caracteres.' })
    @MaxLength(11, { message: 'La cédula de identidad no debe exceder los 11 caracteres.' })
    @IsNotEmpty({ message: 'La cédula de identidad es obligatoria.' })
    cedula_identidad: string;

    @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
    @MinLength(11, { message: 'El teléfono debe tener 11 caracteres.' })
    @MaxLength(11, { message: 'El teléfono debe tener exactamente 11 caracteres.' })
    @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
    telefono: string;

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
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
    user_name: string;

    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(25, { message: 'La contraseña no debe exceder los 25 caracteres.' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    contraseña: string;

    @MinLength(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(25, { message: 'La confirmación de la contraseña no debe exceder los 25 caracteres.' })
    @IsString({ message: 'La confirmación de la contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria.' })
    confirm_contraseña: string;

    @IsString({ message: 'El rol debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El rol es obligatorio.' })
    rol: string;

    // Validación de contraseñas coincidentes
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
