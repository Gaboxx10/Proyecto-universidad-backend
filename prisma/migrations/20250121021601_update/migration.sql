/*
  Warnings:

  - Added the required column `tipo_persona` to the `Persona` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula_identidad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "tipo_persona" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Persona" ("apellidos", "cedula_identidad", "direccion", "email", "id", "nombres", "telefono") SELECT "apellidos", "cedula_identidad", "direccion", "email", "id", "nombres", "telefono" FROM "Persona";
DROP TABLE "Persona";
ALTER TABLE "new_Persona" RENAME TO "Persona";
CREATE UNIQUE INDEX "Persona_cedula_identidad_key" ON "Persona"("cedula_identidad");
CREATE UNIQUE INDEX "Persona_telefono_key" ON "Persona"("telefono");
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
