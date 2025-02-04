import { 
  IsOptional, 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  IsNotEmpty, 
  ValidateIf, 
  IsNumber, 
  IsPositive, 
  IsInt, 
  Max, 
  Matches 
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
  @Matches(/^[0-9]+$/, { message: 'El teléfono solo puede contener números.' }) 
  telefono?: string;

  @IsOptional()
  @IsString({ message: 'El RIF debe ser una cadena de texto.' })
  @MinLength(10, { message: 'El RIF debe tener al menos 10 caracteres.' })
  @MaxLength(11, { message: 'El RIF no debe exceder los 11 caracteres.' })
  @IsNotEmpty({ message: 'El RIF no puede estar vacío si se proporciona.' })
  @Matches(/^[0-9]+$/, { message: 'El RIF solo puede contener números.' }) 
  rif?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío si se proporciona.' })
  moneda?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser una dirección de correo electrónico válida.' })
  email?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El IVA debe ser un número.' })
  @IsPositive({ message: 'El IVA debe ser un número positivo.' })
  @IsInt({ message: 'El IVA debe ser un número entero.' })
  @Max(25, { message: 'El IVA no puede superar el 25%.' })  
  iva?: number;

  @IsOptional()
  @IsString({ message: 'La razón social debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La razón social no puede estar vacía si se proporciona.' })
  razon_social?: string;

  @ValidateIf(
    (o) => !o.nombre && !o.direccion && !o.telefono && !o.rif && !o.email && !o.iva && !o.razon_social && !o.moneda,
  )
  @IsNotEmpty({ message: 'Debe actualizar al menos uno de los campos: nombre, dirección, teléfono, RIF, email, IVA o razón social.' })
  atLeastOneFieldMustBePresent?: boolean;
}
