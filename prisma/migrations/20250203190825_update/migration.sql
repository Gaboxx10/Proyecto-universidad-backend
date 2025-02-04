/*
  Warnings:

  - You are about to alter the column `importe` on the `DetallePresupuesto` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `precio_unitario` on the `DetallePresupuesto` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `precio_unitario` on the `DetallesFactura` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `total` on the `DetallesFactura` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `iva` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `iva` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `subtotal` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `total_pagar` on the `Factura` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `total_pagar` on the `Presupuesto` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

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
CREATE TABLE "new_DetallesFactura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "total" REAL NOT NULL,
    "facturaId" TEXT NOT NULL,
    CONSTRAINT "DetallesFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetallesFactura" ("cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total") SELECT "cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total" FROM "DetallesFactura";
DROP TABLE "DetallesFactura";
ALTER TABLE "new_DetallesFactura" RENAME TO "DetallesFactura";
CREATE TABLE "new_Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL DEFAULT '',
    "razon_social" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT '',
    "rif_detalles" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "logo" TEXT DEFAULT '',
    "moneda" TEXT NOT NULL DEFAULT 'Bs',
    "iva" REAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_Empresa" ("direccion", "email", "id", "iva", "logo", "moneda", "nombre", "razon_social", "rif", "rif_detalles", "telefono") SELECT "direccion", "email", "id", "iva", "logo", "moneda", "nombre", "razon_social", "rif", "rif_detalles", "telefono" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
CREATE TABLE "new_Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_factura" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL,
    "iva" REAL NOT NULL,
    "total_pagar" REAL NOT NULL,
    "f_entrada_veh" DATETIME NOT NULL,
    "f_salida_veh" DATETIME NOT NULL,
    "clienteId" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehiculoId" TEXT,
    CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Factura_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Factura" ("clienteId", "created_at", "f_emision", "f_entrada_veh", "f_salida_veh", "id", "iva", "num_factura", "pago", "subtotal", "total_pagar", "vehiculoId") SELECT "clienteId", "created_at", "f_emision", "f_entrada_veh", "f_salida_veh", "id", "iva", "num_factura", "pago", "subtotal", "total_pagar", "vehiculoId" FROM "Factura";
DROP TABLE "Factura";
ALTER TABLE "new_Factura" RENAME TO "Factura";
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
