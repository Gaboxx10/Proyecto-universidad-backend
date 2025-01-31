/*
  Warnings:

  - You are about to drop the `DetallesPresupuesto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehiculoDiagnostico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `apellido` on the `Persona` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Persona` table. All the data in the column will be lost.
  - You are about to drop the column `segundo_apellido` on the `Persona` table. All the data in the column will be lost.
  - You are about to drop the column `segundo_nombre` on the `Persona` table. All the data in the column will be lost.
  - The primary key for the `PresupuestoVehiculo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PresupuestoVehiculo` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellidos` to the `Persona` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Persona` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DetallesPresupuesto";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VehiculoDiagnostico";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DiagnosticoVehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,

    PRIMARY KEY ("diagnosticoId", "vehiculoId"),
    CONSTRAINT "DiagnosticoVehiculo_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetallePresupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "importe" REAL NOT NULL,
    "presupuestoId" TEXT NOT NULL,
    CONSTRAINT "DetallePresupuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "f_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_entrega_estimada" DATETIME NOT NULL,
    "nota_adicional" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DetalleOrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER,
    "ordenTrabajoId" TEXT NOT NULL,
    CONSTRAINT "DetalleOrdenTrabajo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrdenTrabajoVehiculo" (
    "ordenTrabajoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("ordenTrabajoId", "vehiculoId"),
    CONSTRAINT "OrdenTrabajoVehiculo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenTrabajoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num" INTEGER NOT NULL,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL,
    "iva" REAL NOT NULL,
    "total_pagar" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DetallesFactura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "total" REAL NOT NULL,
    "facturaId" TEXT NOT NULL,
    CONSTRAINT "DetallesFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacturaCliente" (
    "clienteId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "facturaId"),
    CONSTRAINT "FacturaCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacturaCliente_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacturaVehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,

    PRIMARY KEY ("vehiculoId", "facturaId"),
    CONSTRAINT "FacturaVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacturaVehiculo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL DEFAULT 'Auto Service',
    "direccion" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT ''
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cliente_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("created_at", "datosId", "id") SELECT "created_at", "datosId", "id" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_datosId_key" ON "Cliente"("datosId");
CREATE TABLE "new_Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula_identidad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT
);
INSERT INTO "new_Persona" ("cedula_identidad", "email", "id", "telefono") SELECT "cedula_identidad", "email", "id", "telefono" FROM "Persona";
DROP TABLE "Persona";
ALTER TABLE "new_Persona" RENAME TO "Persona";
CREATE UNIQUE INDEX "Persona_cedula_identidad_key" ON "Persona"("cedula_identidad");
CREATE UNIQUE INDEX "Persona_telefono_key" ON "Persona"("telefono");
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");
CREATE TABLE "new_Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num" INTEGER NOT NULL,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_validez" DATETIME NOT NULL,
    "total_pagar" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Presupuesto" ("f_emision", "f_validez", "id", "num", "total_pagar") SELECT "f_emision", "f_validez", "id", "num", "total_pagar" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
CREATE TABLE "new_PresupuestoVehiculo" (
    "presupuestoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("presupuestoId", "vehiculoId"),
    CONSTRAINT "PresupuestoVehiculo_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PresupuestoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PresupuestoVehiculo" ("presupuestoId", "vehiculoId") SELECT "presupuestoId", "vehiculoId" FROM "PresupuestoVehiculo";
DROP TABLE "PresupuestoVehiculo";
ALTER TABLE "new_PresupuestoVehiculo" RENAME TO "PresupuestoVehiculo";
CREATE TABLE "new_Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Vehiculo" ("año", "color", "created_at", "id", "kilometraje", "marca", "modelo", "placa", "tipo") SELECT "año", "color", "created_at", "id", "kilometraje", "marca", "modelo", "placa", "tipo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FacturaCliente_facturaId_key" ON "FacturaCliente"("facturaId");

-- CreateIndex
CREATE UNIQUE INDEX "FacturaVehiculo_facturaId_key" ON "FacturaVehiculo"("facturaId");
