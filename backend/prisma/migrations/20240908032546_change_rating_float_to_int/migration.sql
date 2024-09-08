/*
  Warnings:

  - You are about to alter the column `rating` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[userId,movieId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_userId_movieId_key" ON "Movie"("userId", "movieId");
