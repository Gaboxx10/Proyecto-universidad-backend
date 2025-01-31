import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString({ message: 'La cédula del cliente debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La cédula del cliente es obligatoria.' })
  cedula_cliente: string;

  @IsString({ message: 'La placa debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa es obligatoria.' })
  placa: string;

  @IsString({ message: 'La marca debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La marca es obligatoria.' })
  marca: string;

  @IsString({ message: 'El modelo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El modelo es obligatorio.' })
  modelo: string;

  @IsString({ message: 'El color debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El color es obligatorio.' })
  color: string;

  @IsString({ message: 'El tipo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo es obligatorio.' })
  tipo: string;

  @IsInt({ message: 'El año debe ser un número entero.' })
  @IsNotEmpty({ message: 'El año es obligatorio.' })
  @Min(1900, { message: 'El año debe ser mayor o igual a 1900.' })
  @Max(new Date().getFullYear(), {
    message: `El año no puede ser mayor que el año actual (${new Date().getFullYear()}).`,
  })
  año: number;

  @IsInt({ message: 'El kilometraje debe ser un número entero.' })
  @IsNotEmpty({ message: 'El kilometraje es obligatorio.' })
  @Min(0, { message: 'El kilometraje debe ser un número positivo o cero.' })
  kilometraje: number;

  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  @IsOptional()
  estado?: string;
}
