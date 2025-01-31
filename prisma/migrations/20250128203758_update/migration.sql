-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClienteVehiculo" (
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "vehiculoId"),
    CONSTRAINT "ClienteVehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClienteVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ClienteVehiculo" ("clienteId", "vehiculoId") SELECT "clienteId", "vehiculoId" FROM "ClienteVehiculo";
DROP TABLE "ClienteVehiculo";
ALTER TABLE "new_ClienteVehiculo" RENAME TO "ClienteVehiculo";
CREATE UNIQUE INDEX "ClienteVehiculo_vehiculoId_key" ON "ClienteVehiculo"("vehiculoId");
CREATE TABLE "new_DetalleOrdenTrabajo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER,
    "ordenTrabajoId" TEXT NOT NULL,
    CONSTRAINT "DetalleOrdenTrabajo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetalleOrdenTrabajo" ("cantidad", "descripcion", "id", "observacion", "ordenTrabajoId", "solucion") SELECT "cantidad", "descripcion", "id", "observacion", "ordenTrabajoId", "solucion" FROM "DetalleOrdenTrabajo";
DROP TABLE "DetalleOrdenTrabajo";
ALTER TABLE "new_DetalleOrdenTrabajo" RENAME TO "DetalleOrdenTrabajo";
CREATE TABLE "new_DetallePresupuesto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "importe" REAL NOT NULL,
    "presupuestoId" TEXT NOT NULL,
    CONSTRAINT "DetallePresupuesto_presupuestoId_fkey" FOREIGN KEY ("presupuestoId") REFERENCES "Presupuesto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetallePresupuesto" ("cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId") SELECT "cantidad", "descripcion", "id", "importe", "nota", "precio_unitario", "presupuestoId" FROM "DetallePresupuesto";
DROP TABLE "DetallePresupuesto";
ALTER TABLE "new_DetallePresupuesto" RENAME TO "DetallePresupuesto";
CREATE TABLE "new_DetallesFactura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" REAL NOT NULL,
    "total" REAL NOT NULL,
    "facturaId" TEXT NOT NULL,
    CONSTRAINT "DetallesFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetallesFactura" ("cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total") SELECT "cantidad", "descripcion", "facturaId", "id", "precio_unitario", "total" FROM "DetallesFactura";
DROP TABLE "DetallesFactura";
ALTER TABLE "new_DetallesFactura" RENAME TO "DetallesFactura";
CREATE TABLE "new_FacturaCliente" (
    "clienteId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,

    PRIMARY KEY ("clienteId", "facturaId"),
    CONSTRAINT "FacturaCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacturaCliente_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FacturaCliente" ("clienteId", "facturaId") SELECT "clienteId", "facturaId" FROM "FacturaCliente";
DROP TABLE "FacturaCliente";
ALTER TABLE "new_FacturaCliente" RENAME TO "FacturaCliente";
CREATE UNIQUE INDEX "FacturaCliente_facturaId_key" ON "FacturaCliente"("facturaId");
CREATE TABLE "new_FacturaVehiculo" (
    "vehiculoId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "entrada" DATETIME NOT NULL,
    "salida" DATETIME NOT NULL,

    PRIMARY KEY ("vehiculoId", "facturaId"),
    CONSTRAINT "FacturaVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacturaVehiculo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FacturaVehiculo" ("entrada", "facturaId", "salida", "vehiculoId") SELECT "entrada", "facturaId", "salida", "vehiculoId" FROM "FacturaVehiculo";
DROP TABLE "FacturaVehiculo";
ALTER TABLE "new_FacturaVehiculo" RENAME TO "FacturaVehiculo";
CREATE UNIQUE INDEX "FacturaVehiculo_facturaId_key" ON "FacturaVehiculo"("facturaId");
CREATE TABLE "new_OrdenTrabajoVehiculo" (
    "ordenTrabajoId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,

    PRIMARY KEY ("ordenTrabajoId", "vehiculoId"),
    CONSTRAINT "OrdenTrabajoVehiculo_ordenTrabajoId_fkey" FOREIGN KEY ("ordenTrabajoId") REFERENCES "OrdenTrabajo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenTrabajoVehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrdenTrabajoVehiculo" ("ordenTrabajoId", "vehiculoId") SELECT "ordenTrabajoId", "vehiculoId" FROM "OrdenTrabajoVehiculo";
DROP TABLE "OrdenTrabajoVehiculo";
ALTER TABLE "new_OrdenTrabajoVehiculo" RENAME TO "OrdenTrabajoVehiculo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
