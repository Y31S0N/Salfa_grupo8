/*
  Warnings:

  - You are about to drop the column `areaId_area` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `contrasena` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_areaId_area_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "areaId_area",
DROP COLUMN "contrasena",
ADD COLUMN     "areaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id_area") ON DELETE SET NULL ON UPDATE CASCADE;
