/*
  Warnings:

  - Added the required column `pago` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entrada` to the `FacturaVehiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salida` to the `FacturaVehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num" INTEGER NOT NULL,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL,
    "iva" REAL NOT NULL,
    "total_pagar" REAL NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Factura" ("created_at", "f_emision", "id", "iva", "num", "subtotal", "total_pagar") SELECT "created_at", "f_emision", "id", "iva", "num", "subtotal", "total_pagar" FROM "Factura";
DROP TABLE "Factura";
ALTER TABLE "new_Factura" RENAME TO "Factura";
CREATE TABLE "new_FacturaVehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "entrada" DATETIME NOT NULL,
    "salida" DATETIME NOT NULL,

    PRIMARY KEY ("vehiculoId", "facturaId"),
    CONSTRAINT "FacturaVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacturaVehiculo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FacturaVehiculo" ("facturaId", "vehiculoId") SELECT "facturaId", "vehiculoId" FROM "FacturaVehiculo";
DROP TABLE "FacturaVehiculo";
ALTER TABLE "new_FacturaVehiculo" RENAME TO "FacturaVehiculo";
CREATE UNIQUE INDEX "FacturaVehiculo_facturaId_key" ON "FacturaVehiculo"("facturaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
