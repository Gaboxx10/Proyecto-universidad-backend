/*
  Warnings:

  - The primary key for the `Empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL DEFAULT 'Auto Service',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Empresa" ("direccion", "email", "id", "nombre", "rif", "telefono") SELECT "direccion", "email", "id", "nombre", "rif", "telefono" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
