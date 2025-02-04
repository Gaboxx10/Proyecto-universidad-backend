-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
