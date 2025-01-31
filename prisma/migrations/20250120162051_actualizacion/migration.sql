/*
  Warnings:

  - Added the required column `access_token` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Empresa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL DEFAULT 'Auto Service',
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "rif" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Empresa" ("direccion", "id", "nombre", "rif") SELECT "direccion", "id", "nombre", "rif" FROM "Empresa";
DROP TABLE "Empresa";
ALTER TABLE "new_Empresa" RENAME TO "Empresa";
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    CONSTRAINT "Usuario_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("contraseña", "datosId", "id", "rol", "user_name") SELECT "contraseña", "datosId", "id", "rol", "user_name" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_datosId_key" ON "Usuario"("datosId");
CREATE UNIQUE INDEX "Usuario_user_name_key" ON "Usuario"("user_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
