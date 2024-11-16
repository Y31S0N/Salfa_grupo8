/*
  Warnings:

  - The `imagen_url` column on the `Area` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Area" DROP COLUMN "imagen_url",
ADD COLUMN     "imagen_url" BYTEA;
