-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Diagnostico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_diagnostico" INTEGER NOT NULL DEFAULT 1,
    "vehiculosId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Diagnostico_vehiculosId_fkey" FOREIGN KEY ("vehiculosId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Diagnostico" ("created_at", "id", "num_diagnostico", "vehiculosId") SELECT "created_at", "id", "num_diagnostico", "vehiculosId" FROM "Diagnostico";
DROP TABLE "Diagnostico";
ALTER TABLE "new_Diagnostico" RENAME TO "Diagnostico";
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Vehiculo" ("año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo") SELECT "año", "color", "created_at", "estado", "id", "kilometraje", "marca", "modelo", "placa", "tipo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
