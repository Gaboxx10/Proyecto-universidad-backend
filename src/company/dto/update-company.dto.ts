import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nombre?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    direccion?: string;

    @IsOptional()
    @IsPhoneNumber(null)
    telefono?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    rif?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @ValidateIf(o => !o.nombre && !o.direccion && !o.telefono && !o.rif && !o.email)
    @IsNotEmpty()
    atLeastOneFieldMustBePresent() {
        return true;
    }
}
