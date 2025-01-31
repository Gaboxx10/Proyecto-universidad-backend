import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateClientDto {
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

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @IsOptional()
    direccion: string;  

    @IsEmail()
    @MinLength(3)
    @MaxLength(30)
    @IsOptional()
    email: string;

}
