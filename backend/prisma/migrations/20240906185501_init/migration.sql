/*
  Warnings:

  - The `status` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Gostei', 'NaoGostei');

-- CreateEnum
CREATE TYPE "Label" AS ENUM ('PretendoAssistir', 'Assistido', 'NaoAssistido', 'Assistindo');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "label" "Label" NOT NULL DEFAULT 'PretendoAssistir',
ADD COLUMN     "rating" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" "Status";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";
