import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    tipo_cliente: string;

    @IsString()
    @IsNotEmpty()
    nombres: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsString()
    @IsNotEmpty()
    cedula_identidad: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsEmail()
    @IsOptional()
    email: string;
}
