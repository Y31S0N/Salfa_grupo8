/*
  Warnings:

  - You are about to drop the column `imagen_url` on the `Area` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "imagen_url",
ADD COLUMN     "imagen" BYTEA;
