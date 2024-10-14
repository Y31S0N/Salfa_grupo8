import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú de áreas

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const areas = ["Electricidad", "Metalúrgica", "General"]; // Áreas disponibles

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 relative">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar cursos..."
          className="border border-black rounded-lg px-4 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
        >
          Buscar
        </button>
        {/* Botón Filtrar */}
        <button
          onClick={toggleMenu}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg ml-2 hover:bg-gray-400 focus:outline-none min-w-[150px] text-center"
          style={{ height: "42px" }} // Misma altura que el botón "Buscar"
        >
          Filtrar por área
        </button>
      </form>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-48">
          {areas.map((area) => (
            <div
              key={area}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log(`Filtrando por ${area}`);
                setIsOpen(false); // Cierra el menú al seleccionar un área
              }}
            >
              {area}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { SearchBar };
