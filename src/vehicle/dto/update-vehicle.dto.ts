import {
  IsString,
  IsOptional,
  Matches,
  IsInt,
  Min,
  IsNumber,
  ValidateIf,
  IsDefined,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsString({ message: 'La placa debe ser una cadena de caracteres.' })
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'La placa debe contener solo números y letras, sin símbolos.',
  })
  placa: string;

  @IsOptional()
  @IsString({ message: 'La marca debe ser una cadena de caracteres.' })
  marca: string;

  @IsOptional()
  @IsString({ message: 'El modelo debe ser una cadena de caracteres.' })
  modelo: string;

  @IsOptional()
  @IsString({ message: 'El color debe ser una cadena de caracteres.' })
  color: string;

  @IsOptional()
  @IsString({ message: 'El tipo debe ser una cadena de caracteres.' })
  tipo: string;

  @IsOptional()
  @IsInt({ message: 'El año debe ser un número entero.' })
  @Min(1900, { message: 'El año debe ser un valor mayor o igual a 1900.' })
  año: number;

  @IsOptional()
  @IsNumber({}, { message: 'El kilometraje debe ser un número.' })
  kilometraje: number;

  @IsString({ message: 'La cédula debe ser una cadena de caracteres.' })
  @Matches(/^\d+$/, {
    message: 'La cédula solo debe contener números, no se permiten símbolos.',
  })
  cedula_cliente: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(REGISTRADO|EN DIAGNOSTICO|EN REPARACION|EN MANTENIMIENTO|EN ESPERA|REPARADO|NULL|NO REPARABLE|ENTREGADO)$/,
  )
  estado: string;

  @ValidateIf(
    (o) =>
      !o.placa &&
      !o.marca &&
      !o.modelo &&
      !o.color &&
      !o.tipo &&
      !o.año &&
      !o.kilometraje &&
      !o.cedula_cliente &&
      !o.estado,
  )
  @IsDefined({
    message:
      'Debe actualizar al menos uno de los campos: placa, marca, modelo, color, tipo, año, kilometraje o cédula del cliente.',
  })
  atLeastOneFieldMustBePresent: boolean;
}
