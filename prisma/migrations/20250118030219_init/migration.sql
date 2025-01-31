-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT NOT NULL,
    "cedula_identidad" INTEGER NOT NULL,
    "telefono" INTEGER NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    CONSTRAINT "Usuario_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    CONSTRAINT "Cliente_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "año" INTEGER NOT NULL,
    "kilometraje" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Detalle_vehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    CONSTRAINT "Detalle_vehiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Detalle_vehiculo_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Persona_cedula_identidad_key" ON "Persona"("cedula_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_telefono_key" ON "Persona"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_email_key" ON "Persona"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_datosId_key" ON "Usuario"("datosId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_datosId_key" ON "Cliente"("datosId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Detalle_vehiculo_vehiculoId_key" ON "Detalle_vehiculo"("vehiculoId");
