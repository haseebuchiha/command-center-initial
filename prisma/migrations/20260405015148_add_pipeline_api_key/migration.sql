-- AlterTable
ALTER TABLE "SlackInstallation" ADD COLUMN     "pipelineApiKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SlackInstallation_pipelineApiKey_key" ON "SlackInstallation"("pipelineApiKey");
