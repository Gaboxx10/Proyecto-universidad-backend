-- AlterTable
ALTER TABLE "Diagnostico" ADD COLUMN "vehiculosId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Null',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vehiculo_id_fkey" FOREIGN KEY ("id") REFERENCES "Diagnostico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehiculo" ("año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo") SELECT "año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
