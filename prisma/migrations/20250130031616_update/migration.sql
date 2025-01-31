-- CreateTable
CREATE TABLE "SeedStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "executed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "num_orden" INTEGER NOT NULL DEFAULT 1,
    "f_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "f_entrega_estimada" DATETIME,
    "nota_adicional" TEXT,
    "vehiculoId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrdenTrabajo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrdenTrabajo" ("created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional", "num_orden", "vehiculoId") SELECT "created_at", "f_creacion", "f_entrega_estimada", "id", "nota_adicional", "num_orden", "vehiculoId" FROM "OrdenTrabajo";
DROP TABLE "OrdenTrabajo";
ALTER TABLE "new_OrdenTrabajo" RENAME TO "OrdenTrabajo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SeedStatus_name_key" ON "SeedStatus"("name");
