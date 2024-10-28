import { Link } from "react-router-dom";
import capacitacion from "@/assets/capacitacion.png";
import mantenimiento from "@/assets/mantenimiento.png";
import seguridad from "@/assets/seguridad.png";
import { PublishAlert, DisableAlert } from "../../components/ui/mensaje_alerta";
import { SearchBar } from "../../components/ui/barra_busqueda"; // Asegúrate de que la ruta sea correcta

// Definir la interfaz para las propiedades
interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string; // Nueva propiedad para el enlace
}

// Componente de la carta
const Card: React.FC<CardProps> = ({ image, title, description, link }) => {
  return (
    <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6 flex flex-col h-full">
      <Link to={link}>
        <img className="w-full h-48 object-cover" src={image} alt={title} />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold mb-2 break-words">{title}</h5>
        <p className="text-gray-700 break-words flex-grow">{description}</p>
        <div className="flex flex-col items-center mt-auto space-y-1">
          <PublishAlert onConfirm={() => console.log("Curso publicado")} />
          <Link to="/modificar_curso">
            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
              Modificar
            </button>
          </Link>
          <DisableAlert onConfirm={() => console.log("Curso deshabilitado")} />
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function Listado_cursos() {
  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Cursos disponibles
      </h2>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        <Card
          image={capacitacion}
          title="Capacitación Minera"
          description="En este curso aprenderás sobre los conceptos básicos de la industria minera"
          link="/vercurso"
        />
        <Card
          image={mantenimiento}
          title="Mantención de maquinaria"
          description="Curso sobre mantenimiento y reparación de maquinaria pesada en la industria minera."
          link="/vercurso"
        />
        <Card
          image={seguridad}
          title="Seguridad Industrial"
          description="Capacitación enfocada en las normativas de seguridad industrial"
          link="/vercurso"
        />
        <Card
          image={capacitacion}
          title="Capacitación Avanzada"
          description="Curso avanzado de capacitación minera para profesionales."
          link="/vercurso"
        />
        <Card
          image={mantenimiento}
          title="Mantenimiento Preventivo"
          description="Aprende las mejores prácticas de mantenimiento preventivo."
          link="/vercurso"
        />
        <Card
          image={seguridad}
          title="Seguridad y Prevención"
          description="Capacitación en seguridad y prevención de riesgos laborales."
          link="/vercurso"
        />
      </div>

      {/* Botón para agregar un nuevo curso */}
      <div className="flex justify-center mt-6">
        <Link to="/agregar_cursos">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            + Agregar Nuevo Curso
          </button>
        </Link>
      </div>
    </>
  );
}