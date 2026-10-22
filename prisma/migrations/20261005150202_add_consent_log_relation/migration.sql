-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConsentLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "anonymousId" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "functional" BOOLEAN NOT NULL DEFAULT false,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "userAgent" TEXT,
    "hashedIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConsentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ConsentLog" ("action", "analytics", "anonymousId", "createdAt", "functional", "id", "marketing", "policyVersion", "userAgent", "userId") SELECT "action", "analytics", "anonymousId", "createdAt", "functional", "id", "marketing", "policyVersion", "userAgent", "userId" FROM "ConsentLog";
DROP TABLE "ConsentLog";
ALTER TABLE "new_ConsentLog" RENAME TO "ConsentLog";
CREATE INDEX "ConsentLog_anonymousId_idx" ON "ConsentLog"("anonymousId");
CREATE INDEX "ConsentLog_userId_idx" ON "ConsentLog"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
