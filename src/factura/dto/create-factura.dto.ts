import {
  IsString,
  Matches,
  IsDate,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFacturaDto {
  @IsString({ message: 'La placa debe ser una cadena de texto.' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'La placa solo puede contener letras y números.',
  })
  @IsNotEmpty({ message: 'La placa es obligatoria.' })
  placa: string;

  @IsDate({
    message: 'La fecha de entrada del vehículo debe ser una fecha válida.',
  })
  @IsNotEmpty({ message: 'La fecha de entrada del vehículo es obligatoria.' })
  @Type(() => Date) // Transforma la cadena a Date
  f_entrada_veh: Date;

  @IsDate({
    message: 'La fecha de salida del vehículo debe ser una fecha válida.',
  })
  @IsNotEmpty({ message: 'La fecha de salida del vehículo es obligatoria.' })
  @Type(() => Date) // Transforma la cadena a Date
  f_salida_veh: Date;

  @Matches(/^\d+$/, {
    message: 'La cédula del cliente solo debe contener números.',
  })
  @IsString({ message: 'La cédula debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La cédula del cliente es obligatoria.' })
  cedula_cliente: string;

  @IsArray({ message: 'Los detalles deben ser un arreglo.' })
  @ArrayNotEmpty({
    message: 'Debe proporcionar al menos un detalle en la factura.',
  })
  details: details[];
}

class details {
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  descripcion: string;

  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  cantidad: number;

  @IsNotEmpty({ message: 'El precio unitario es obligatorio.' })
  precio_unitario: number;
}
