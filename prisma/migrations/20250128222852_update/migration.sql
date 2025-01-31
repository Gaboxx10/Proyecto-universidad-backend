/*
  Warnings:

  - You are about to drop the `ClienteVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiagnosticoVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacturaCliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacturaVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrdenTrabajoVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresupuestoVehiculo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `vehiculosId` on the `Diagnostico` table. All the data in the column will be lost.
  - Added the required column `vehiculoId` to the `Diagnostico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehiculoId` to the `OrdenTrabajo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehiculoId` to the `Presupuesto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ClienteVehiculo_vehiculoId_key";

-- DropIndex
DROP INDEX "FacturaCliente_facturaId_key";

-- DropIndex
DROP INDEX "FacturaVehiculo_facturaId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ClienteVehiculo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DiagnosticoVehiculo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacturaCliente";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacturaVehiculo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OrdenTrabajoVehiculo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PresupuestoVehiculo";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetalleOrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER,
    "ordenTrabajoId" TEXT NOT NULL,
    CONSTRAINT "DetalleOrdenTrabajo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetalleOrdenTrabajo" ("cantidad", "descripcion", "id", "observacion", "ordenTrabajoId", "solucion") SELECT "cantidad", "descripcion", "id", "observacion", "ordenTrabajoId", "solucion" FROM "DetalleOrdenTrabajo";
DROP TABLE "DetalleOrdenTrabajo";
ALTER TABLE "new_DetalleOrdenTrabajo" RENAME TO "DetalleOrdenTrabajo";
CREATE TABLE "new_DetallePresupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "importe" REAL NOT NULL,
    "presupuestoId" TEXT NOT NULL,
    CONSTRAINT "DetallePresupuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetallePresupuesto" ("cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId") SELECT "cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId" FROM "DetallePresupuesto";
DROP TABLE "DetallePresupuesto";
ALTER TABLE "new_DetallePresupuesto" RENAME TO "DetallePresupuesto";
CREATE TABLE "new_DetallesFactura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "total" REAL NOT NULL,
    "facturaId" TEXT NOT NULL,
    CONSTRAINT "DetallesFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DetallesFactura" ("cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total") SELECT "cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total" FROM "DetallesFactura";
DROP TABLE "DetallesFactura";
ALTER TABLE "new_DetallesFactura" RENAME TO "DetallesFactura";
CREATE TABLE "new_Diagnostico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_diagnostico" INTEGER NOT NULL DEFAULT 1,
    "vehiculoId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Diagnostico_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Diagnostico" ("created_at", "id", "num_diagnostico") SELECT "created_at", "id", "num_diagnostico" FROM "Diagnostico";
DROP TABLE "Diagnostico";
ALTER TABLE "new_Diagnostico" RENAME TO "Diagnostico";
CREATE TABLE "new_Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_factura" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL,
    "iva" REAL NOT NULL,
    "total_pagar" REAL NOT NULL,
    "clienteId" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehiculoId" TEXT,
    CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Factura_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Factura" ("created_at", "f_emision", "id", "iva", "num_factura", "pago", "subtotal", "total_pagar") SELECT "created_at", "f_emision", "id", "iva", "num_factura", "pago", "subtotal", "total_pagar" FROM "Factura";
DROP TABLE "Factura";
ALTER TABLE "new_Factura" RENAME TO "Factura";
CREATE TABLE "new_OrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_orden" INTEGER NOT NULL DEFAULT 1,
    "f_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_entrega_estimada" DATETIME NOT NULL,
    "nota_adicional" TEXT,
    "vehiculoId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrdenTrabajo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrdenTrabajo" ("created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional", "num_orden") SELECT "created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional", "num_orden" FROM "OrdenTrabajo";
DROP TABLE "OrdenTrabajo";
ALTER TABLE "new_OrdenTrabajo" RENAME TO "OrdenTrabajo";
CREATE TABLE "new_Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_presupuesto" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_validez" DATETIME NOT NULL,
    "total_pagar" REAL NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Presupuesto_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Presupuesto" ("created_at", "f_emision", "f_validez", "id", "num_presupuesto", "total_pagar") SELECT "created_at", "f_emision", "f_validez", "id", "num_presupuesto", "total_pagar" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
CREATE TABLE "new_Revision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "causa_prob" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,
    CONSTRAINT "Revision_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Revision" ("causa_prob", "diagnosticoId", "id", "nota", "observacion", "solucion") SELECT "causa_prob", "diagnosticoId", "id", "nota", "observacion", "solucion" FROM "Revision";
DROP TABLE "Revision";
ALTER TABLE "new_Revision" RENAME TO "Revision";
CREATE TABLE "new_Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "clienteId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Null',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vehiculo" ("año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo") SELECT "año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
