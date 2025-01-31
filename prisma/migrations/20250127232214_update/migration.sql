-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClienteVehiculo" (
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "vehiculoId"),
    CONSTRAINT "ClienteVehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClienteVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClienteVehiculo" ("clienteId", "vehiculoId") SELECT "clienteId", "vehiculoId" FROM "ClienteVehiculo";
DROP TABLE "ClienteVehiculo";
ALTER TABLE "new_ClienteVehiculo" RENAME TO "ClienteVehiculo";
CREATE UNIQUE INDEX "ClienteVehiculo_vehiculoId_key" ON "ClienteVehiculo"("vehiculoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
