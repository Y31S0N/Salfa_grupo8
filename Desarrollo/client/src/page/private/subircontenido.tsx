import React, { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { Button } from "../../components/ui/button";

interface SubirContenidoProps {
  leccionId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubirContenido: React.FC<SubirContenidoProps> = ({
  leccionId,
  onClose,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "audio/*",
    "image/*",
    "video/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isAllowedType = allowedTypes.some((type) =>
        type.endsWith("/*")
          ? file.type.startsWith(type.replace("/*", ""))
          : file.type === type
      );

      if (!isAllowedType) {
        setError(
          "Tipo de archivo no permitido. Solo se permiten imágenes, audios, videos, PDFs y documentos de Office."
        );
        return;
      }
      setFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (
      droppedFile &&
      allowedTypes.some((type) => droppedFile.type.match(type))
    ) {
      setFile(droppedFile);
      setError(null);
    } else {
      setFile(null);
      setError("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!file || !leccionId) return;

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("leccionId", leccionId);

      await axios.post(`http://localhost:3000/api/contenido/upload`, formData);

      setError("success");
      onSuccess();
    } catch (error) {
      console.error("Error al subir contenido:", error);
      setError("error");
    } finally {
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Subir Archivos de Lecciones
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sube archivos de audio, imágenes, PDF y documentos de Office para
            tus lecciones
          </p>
        </div>
        <div
          className="mt-8 space-y-6"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Selecciona un archivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={allowedTypes.join(",")}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">o arrastra y suelta</p>
              </div>
              <p className="text-xs text-gray-500">
                Audio, imágenes, PDF y documentos de Office hasta 10MB
              </p>
            </div>
          </div>
          {file && (
            <div className="text-sm text-gray-600">
              Archivo seleccionado: {file.name}
            </div>
          )}
          {error === "error" && (
            <div className="flex items-center text-sm text-red-600">
              <XCircle className="h-5 w-5 mr-2" />
              Tipo de archivo no permitido. Por favor, selecciona un archivo de
              audio, imagen, PDF o documento de Office.
            </div>
          )}
          {error === "success" && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Archivo subido con éxito.
            </div>
          )}
          <div>
            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </button>
            <div className="mt-2"></div>
            <Button
              onClick={onClose}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubirContenido;
