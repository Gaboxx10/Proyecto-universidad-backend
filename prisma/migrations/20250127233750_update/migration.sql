-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClienteVehiculo" (
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "vehiculoId"),
    CONSTRAINT "ClienteVehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClienteVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClienteVehiculo" ("clienteId", "vehiculoId") SELECT "clienteId", "vehiculoId" FROM "ClienteVehiculo";
DROP TABLE "ClienteVehiculo";
ALTER TABLE "new_ClienteVehiculo" RENAME TO "ClienteVehiculo";
CREATE UNIQUE INDEX "ClienteVehiculo_vehiculoId_key" ON "ClienteVehiculo"("vehiculoId");
CREATE TABLE "new_OrdenTrabajoVehiculo" (
    "ordenTrabajoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("ordenTrabajoId", "vehiculoId"),
    CONSTRAINT "OrdenTrabajoVehiculo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrdenTrabajoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrdenTrabajoVehiculo" ("ordenTrabajoId", "vehiculoId") SELECT "ordenTrabajoId", "vehiculoId" FROM "OrdenTrabajoVehiculo";
DROP TABLE "OrdenTrabajoVehiculo";
ALTER TABLE "new_OrdenTrabajoVehiculo" RENAME TO "OrdenTrabajoVehiculo";
CREATE TABLE "new_PresupuestoVehiculo" (
    "presupuestoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("presupuestoId", "vehiculoId"),
    CONSTRAINT "PresupuestoVehiculo_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PresupuestoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PresupuestoVehiculo" ("presupuestoId", "vehiculoId") SELECT "presupuestoId", "vehiculoId" FROM "PresupuestoVehiculo";
DROP TABLE "PresupuestoVehiculo";
ALTER TABLE "new_PresupuestoVehiculo" RENAME TO "PresupuestoVehiculo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
