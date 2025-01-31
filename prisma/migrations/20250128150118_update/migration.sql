/*
  Warnings:

  - You are about to drop the column `num` on the `Factura` table. All the data in the column will be lost.
  - You are about to drop the column `num` on the `Presupuesto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diagnostico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_diagnostico" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Diagnostico" ("created_at", "id") SELECT "created_at", "id" FROM "Diagnostico";
DROP TABLE "Diagnostico";
ALTER TABLE "new_Diagnostico" RENAME TO "Diagnostico";
CREATE TABLE "new_Factura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_factura" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" REAL NOT NULL,
    "iva" REAL NOT NULL,
    "total_pagar" REAL NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Factura" ("created_at", "f_emision", "id", "iva", "pago", "subtotal", "total_pagar") SELECT "created_at", "f_emision", "id", "iva", "pago", "subtotal", "total_pagar" FROM "Factura";
DROP TABLE "Factura";
ALTER TABLE "new_Factura" RENAME TO "Factura";
CREATE TABLE "new_OrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_orden" INTEGER NOT NULL DEFAULT 1,
    "f_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_entrega_estimada" DATETIME NOT NULL,
    "nota_adicional" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OrdenTrabajo" ("created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional") SELECT "created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional" FROM "OrdenTrabajo";
DROP TABLE "OrdenTrabajo";
ALTER TABLE "new_OrdenTrabajo" RENAME TO "OrdenTrabajo";
CREATE TABLE "new_Presupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_presupuesto" INTEGER NOT NULL DEFAULT 1,
    "f_emision" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_validez" DATETIME NOT NULL,
    "total_pagar" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Presupuesto" ("created_at", "f_emision", "f_validez", "id", "total_pagar") SELECT "created_at", "f_emision", "f_validez", "id", "total_pagar" FROM "Presupuesto";
DROP TABLE "Presupuesto";
ALTER TABLE "new_Presupuesto" RENAME TO "Presupuesto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
