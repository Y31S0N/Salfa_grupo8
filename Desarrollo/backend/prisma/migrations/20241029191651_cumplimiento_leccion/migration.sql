/*
  Warnings:

  - Added the required column `estado_leccion` to the `LeccionCurso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_modulo` to the `Modulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeccionCurso" ADD COLUMN     "estado_leccion" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Modulo" ADD COLUMN     "estado_modulo" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "CursoArea" (
    "id_curso" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,

    CONSTRAINT "CursoArea_pkey" PRIMARY KEY ("id_curso","id_area")
);

-- CreateTable
CREATE TABLE "RegistroVisualizacionContenido" (
    "id_visualizacion" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "contenidoId" INTEGER NOT NULL,
    "leccionId" INTEGER NOT NULL,
    "tipo_interaccion" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistroVisualizacionContenido_pkey" PRIMARY KEY ("id_visualizacion")
);

-- AddForeignKey
ALTER TABLE "CursoArea" ADD CONSTRAINT "CursoArea_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "CursoCapacitacion"("id_curso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoArea" ADD CONSTRAINT "CursoArea_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVisualizacionContenido" ADD CONSTRAINT "RegistroVisualizacionContenido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVisualizacionContenido" ADD CONSTRAINT "RegistroVisualizacionContenido_contenidoId_fkey" FOREIGN KEY ("contenidoId") REFERENCES "Contenido"("id_contenido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroVisualizacionContenido" ADD CONSTRAINT "RegistroVisualizacionContenido_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "LeccionCurso"("id_leccion") ON DELETE RESTRICT ON UPDATE CASCADE;
