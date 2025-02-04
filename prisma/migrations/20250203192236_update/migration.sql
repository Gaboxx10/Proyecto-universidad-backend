/*
  Warnings:

  - You are about to alter the column `importe` on the `DetallePresupuesto` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `precio_unitario` on the `DetallePresupuesto` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `total_pagar` on the `Presupuesto` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetallePresupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "importe" REAL NOT NULL,
    "presupuestoId" TEXT NOT NULL,
    CONSTRAINT "DetallePresupuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetallePresupuesto" ("cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId") SELECT "cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId" FROM "DetallePresupuesto";
DROP TABLE "DetallePresupuesto";
ALTER TABLE "new_DetallePresupuesto" RENAME TO "DetallePresupuesto";
CREATE TABLE "new_Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_presupuesto" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_validez" DATETIME NOT NULL,
    "total_pagar" REAL NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Presupuesto_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Presupuesto" ("created_at", "f_emision", "f_validez", "id", "num_presupuesto", "total_pagar", "vehiculoId") SELECT "created_at", "f_emision", "f_validez", "id", "num_presupuesto", "total_pagar", "vehiculoId" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
