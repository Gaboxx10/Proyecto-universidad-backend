import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @MinLength(8)
    @MaxLength(11)
    @IsNotEmpty()
    cedula_identidad: string;

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @IsNotEmpty()
    telefono: string;   

    @IsEmail()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    direccion?: string;

    @MinLength(5)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @MinLength(8)
    @MaxLength(25)
    @IsString()
    @IsNotEmpty()
    contraseña: string; 

    @MinLength(8)
    @MaxLength(25)
    @IsString()
    confirm_contraseña: string; 

    @IsString()
    @IsNotEmpty()
    rol: string;
}
