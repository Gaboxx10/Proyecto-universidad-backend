-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "datosId" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "refresh_token" TEXT,
    CONSTRAINT "Usuario_datosId_fkey" FOREIGN KEY ("datosId") REFERENCES "Persona" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("contraseña", "datosId", "id", "refresh_token", "rol", "user_name") SELECT "contraseña", "datosId", "id", "refresh_token", "rol", "user_name" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_datosId_key" ON "Usuario"("datosId");
CREATE UNIQUE INDEX "Usuario_user_name_key" ON "Usuario"("user_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
