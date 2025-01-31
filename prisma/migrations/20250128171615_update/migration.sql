-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DiagnosticoVehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,

    PRIMARY KEY ("diagnosticoId", "vehiculoId"),
    CONSTRAINT "DiagnosticoVehiculo_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DiagnosticoVehiculo" ("diagnosticoId", "vehiculoId") SELECT "diagnosticoId", "vehiculoId" FROM "DiagnosticoVehiculo";
DROP TABLE "DiagnosticoVehiculo";
ALTER TABLE "new_DiagnosticoVehiculo" RENAME TO "DiagnosticoVehiculo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
