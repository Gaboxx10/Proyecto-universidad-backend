-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT '',
    "rif_detalles" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Empresa" ("direccion", "email", "id", "nombre", "rif", "rif_detalles", "telefono") SELECT "direccion", "email", "id", "nombre", "rif", "rif_detalles", "telefono" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
CREATE TABLE "new_Proveedores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "rif" TEXT,
    "rif_detalles" TEXT,
    "nota" TEXT
);
INSERT INTO "new_Proveedores" ("direccion", "id", "nombre", "rif", "rif_detalles", "telefono") SELECT "direccion", "id", "nombre", "rif", "rif_detalles", "telefono" FROM "Proveedores";
DROP TABLE "Proveedores";
ALTER TABLE "new_Proveedores" RENAME TO "Proveedores";
CREATE UNIQUE INDEX "Proveedores_telefono_key" ON "Proveedores"("telefono");
CREATE UNIQUE INDEX "Proveedores_rif_key" ON "Proveedores"("rif");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
