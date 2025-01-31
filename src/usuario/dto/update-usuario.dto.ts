import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUsuarioDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @IsOptional()
    nombres: string;

    @IsString()
    @MinLength(3)
    @MaxLength(25)
    @IsOptional()
    apellidos: string;

    @IsString()
    @MinLength(8)
    @MaxLength(11)
    @IsOptional()
    cedula_identidad: string;

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @IsOptional()
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
    @IsOptional()
    user_name: string;

    @MinLength(8)
    @MaxLength(25)
    @IsString()
    @IsOptional()
    contraseña: string;
    
    @MinLength(8)
    @MaxLength(25)
    @IsString()
    @IsOptional()
    confirm_contraseña: string; 

}
