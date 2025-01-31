-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "tipo_cliente" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cliente_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("created_at", "datosId", "id", "tipo_cliente") SELECT "created_at", "datosId", "id", "tipo_cliente" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_datosId_key" ON "Cliente"("datosId");
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
