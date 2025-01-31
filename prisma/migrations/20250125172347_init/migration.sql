/*
  Warnings:

  - You are about to drop the column `tipo` on the `Cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula_id_detalles]` on the table `Persona` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo_cliente` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Persona" ADD COLUMN "cedula_id_detalles" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "tipo_cliente" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cliente_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("created_at", "datosId", "id") SELECT "created_at", "datosId", "id" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_datosId_key" ON "Cliente"("datosId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Persona_cedula_id_detalles_key" ON "Persona"("cedula_id_detalles");
