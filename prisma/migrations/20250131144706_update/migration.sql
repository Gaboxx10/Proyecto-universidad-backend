-- AlterTable
ALTER TABLE "Proveedores" ADD COLUMN "rif" TEXT;
ALTER TABLE "Proveedores" ADD COLUMN "rif_detalles" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL DEFAULT 'Auto Service',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT '',
    "rif_detalles" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Empresa" ("direccion", "email", "id", "nombre", "rif", "telefono") SELECT "direccion", "email", "id", "nombre", "rif", "telefono" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
