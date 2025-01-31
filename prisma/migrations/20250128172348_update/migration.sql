-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Revision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "observacion" TEXT NOT NULL,
    "causa_prob" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "nota" TEXT NOT NULL,
    "diagnosticoId" TEXT NOT NULL,
    CONSTRAINT "Revision_diagnosticoId_fkey" FOREIGN KEY ("diagnosticoId") REFERENCES "Diagnostico" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Revision" ("causa_prob", "diagnosticoId", "id", "nota", "observacion", "solucion") SELECT "causa_prob", "diagnosticoId", "id", "nota", "observacion", "solucion" FROM "Revision";
DROP TABLE "Revision";
ALTER TABLE "new_Revision" RENAME TO "Revision";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
