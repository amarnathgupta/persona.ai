/*
  Warnings:

  - A unique constraint covering the columns `[userId,personaId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_personaId_key" ON "Chat"("userId", "personaId");
