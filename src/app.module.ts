import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
//mport { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { DiagnosticosModule } from './diagnosticos/diagnosticos.module';
import { ClientModule } from './client/client.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PresupuestoModule } from './presupuesto/presupuesto.module';
import { OrdenesTrabajoModule } from './ordenes-trabajo/ordenes-trabajo.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { CompanyModule } from './company/company.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [PrismaModule, UsuarioModule, SharedModule, AuthModule, DiagnosticosModule, ClientModule, VehicleModule, PresupuestoModule, OrdenesTrabajoModule, ProveedoresModule, CompanyModule, PdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
