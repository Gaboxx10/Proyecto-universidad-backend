import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class DetallePresupuestoDto {
  @IsNotEmpty({ message: 'La observación es obligatoria.' })
  @IsString({ message: 'La observación debe ser una cadena de texto.' })
  observacion: string;

  @IsNotEmpty({ message: 'La solución es obligatoria.' })
  @IsString({ message: 'La solución debe ser una cadena de texto.' })
  solucion: string;

  @IsNotEmpty({ message: 'La descripción del repuesto es obligatoria.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  descripcion: string;

  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(0, { message: 'La cantidad debe ser al menos 1.' })
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'La nota debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La nota debe tener un valor si se proporciona.' })
  nota?: string;
}

export class CreateOrdenesTrabajoDto {
  @IsString({ message: 'La placa del vehículo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La placa del vehículo es obligatoria.' })
  placa_vehiculo: string;

  @IsOptional()
  @IsDateString()
  f_entrega_estimada: string;

  @IsArray({ message: 'Los detalles deben ser un array de objetos.' })
  @IsNotEmpty({ message: 'Debe haber al menos un detalle en el presupuesto.' })
  detalles: DetallePresupuestoDto[];

  @IsOptional()
  @IsString({ message: 'La nota adicional debe ser una cadena de texto.' })
  @IsNotEmpty({
    message: 'La nota adicional debe tener un valor si se proporciona.',
  })
  nota_adicional?: string;
}
