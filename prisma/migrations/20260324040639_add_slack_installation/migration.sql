-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "authType" TEXT NOT NULL DEFAULT 'toggle';

-- CreateTable
CREATE TABLE "SlackInstallation" (
    "id" TEXT NOT NULL,
    "userIntegrationId" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "installerUserId" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL DEFAULT 'bot',
    "isEnterprise" BOOLEAN NOT NULL DEFAULT false,
    "enterpriseId" TEXT,
    "enterpriseName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlackInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlackInstallation_userIntegrationId_key" ON "SlackInstallation"("userIntegrationId");

-- AddForeignKey
ALTER TABLE "SlackInstallation" ADD CONSTRAINT "SlackInstallation_userIntegrationId_fkey" FOREIGN KEY ("userIntegrationId") REFERENCES "UserIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
