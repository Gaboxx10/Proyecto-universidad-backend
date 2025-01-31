/*
  Warnings:

  - You are about to drop the `Detalle_vehiculo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contraseña` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Detalle_vehiculo_vehiculoId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Detalle_vehiculo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ClienteVehiculo" (
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "vehiculoId"),
    CONSTRAINT "ClienteVehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClienteVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "causa_prob" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,
    CONSTRAINT "Revision_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VehiculoDiagnostico" (
    "vehiculoId" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,

    PRIMARY KEY ("diagnosticoId", "vehiculoId"),
    CONSTRAINT "VehiculoDiagnostico_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VehiculoDiagnostico_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num" INTEGER NOT NULL,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_validez" DATETIME NOT NULL,
    "total_pagar" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "DetallesPresupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "importe" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "PresupuestoVehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "presupuestoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    CONSTRAINT "PresupuestoVehiculo_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PresupuestoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cliente_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("datosId", "id") SELECT "datosId", "id" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_datosId_key" ON "Cliente"("datosId");
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    CONSTRAINT "Usuario_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("datosId", "id") SELECT "datosId", "id" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_datosId_key" ON "Usuario"("datosId");
CREATE UNIQUE INDEX "Usuario_user_name_key" ON "Usuario"("user_name");
CREATE TABLE "new_Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Vehiculo" ("año", "color", "id", "kilometraje", "marca", "modelo", "placa", "tipo") SELECT "año", "color", "id", "kilometraje", "marca", "modelo", "placa", "tipo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ClienteVehiculo_vehiculoId_key" ON "ClienteVehiculo"("vehiculoId");
