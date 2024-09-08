/*
  Warnings:

  - Added the required column `movieId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "movieId" INTEGER NOT NULL;
