/*
  Warnings:

  - Changed the type of `tipo_interaccion` on the `RegistroVisualizacionContenido` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "imagen_url" TEXT;

-- AlterTable
ALTER TABLE "RegistroVisualizacionContenido" DROP COLUMN "tipo_interaccion",
ADD COLUMN     "tipo_interaccion" BOOLEAN NOT NULL;
