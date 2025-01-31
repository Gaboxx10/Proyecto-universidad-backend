import { PartialType } from '@nestjs/swagger';
import { CreateOrdenesTrabajoDto } from './create-ordenes-trabajo.dto';

export class UpdateOrdenesTrabajoDto extends PartialType(CreateOrdenesTrabajoDto) {}
