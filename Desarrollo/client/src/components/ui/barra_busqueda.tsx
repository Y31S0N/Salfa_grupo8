// components/ui/barra_busqueda.tsx
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  setFilter: (filter: 'habilitados' | 'deshabilitados') => void; // Prop para establecer el filtro
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setFilter }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("Filtrar por estado");

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

  const handleFilterChange = (filter: 'habilitados' | 'deshabilitados') => {
    setFilter(filter);
    setFilterText(filter === 'habilitados' ? 'Cursos Habilitados' : 'Cursos Deshabilitados');
    setIsOpen(false); // Cierra el menú al seleccionar un estado
  };

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
          className="bg-gray-300 text-black rounded-lg ml-2 hover:bg-gray-400 focus:outline-none min-w-[200px] text-center" // Establecido a un ancho mínimo más grande
          style={{ height: "42px", padding: "0 8px", whiteSpace: "nowrap" }} // Asegura que el texto no se divida
        >
          {filterText}
        </button>
      </form>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 w-48">
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleFilterChange('habilitados')}
          >
            Habilitados
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleFilterChange('deshabilitados')}
          >
            Deshabilitados
          </div>
        </div>
      )}
    </div>
  );
};

export { SearchBar };
