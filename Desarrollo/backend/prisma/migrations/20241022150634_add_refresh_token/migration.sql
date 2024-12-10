/*
  Warnings:

  - Made the column `preguntaId_pregunta` on table `Respuesta` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Respuesta" DROP CONSTRAINT "Respuesta_preguntaId_pregunta_fkey";

-- AlterTable
ALTER TABLE "CursoAsignado" ALTER COLUMN "fecha_acceso" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Respuesta" ALTER COLUMN "preguntaId_pregunta" SET NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "refreshToken" TEXT;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_preguntaId_pregunta_fkey" FOREIGN KEY ("preguntaId_pregunta") REFERENCES "Pregunta"("id_pregunta") ON DELETE RESTRICT ON UPDATE CASCADE;
