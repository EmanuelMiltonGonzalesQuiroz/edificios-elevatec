import React, { useState } from 'react';

const Filters = ({ onApplyFilters, onClose }) => {
  const [filters, setFilters] = useState({
    transactionType: '',
    priceMin: '',
    priceMax: '',
    rooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    onApplyFilters(filters); // Aplica los filtros
    if (typeof onClose === 'function') onClose(); // Cierra el modal solo si onClose es una función válida
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        {/* Tipo de Transacción */}
        <label>Tipo de Transacción</label>
        <select name="transactionType" value={filters.transactionType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="anticretico">Anticrético</option>
          <option value="preventa">Preventa</option>
        </select>

        {/* Rango de Precio */}
        <label>Rango de Precio</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="priceMin"
            placeholder="Mínimo"
            value={filters.priceMin}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Máximo"
            value={filters.priceMax}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
        </div>

        {/* Otros Campos de Filtro */}
        <label>Habitaciones</label>
        <input
          type="number"
          name="rooms"
          placeholder="Cantidad de habitaciones"
          value={filters.rooms}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label>Baños</label>
        <input
          type="number"
          name="bathrooms"
          placeholder="Cantidad de baños"
          value={filters.bathrooms}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label>Área (m²)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="areaMin"
            placeholder="Mínimo"
            value={filters.areaMin}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            name="areaMax"
            placeholder="Máximo"
            value={filters.areaMax}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          />
        </div>

        {/* Botón de Aplicar Filtros */}
        <button onClick={applyFilters} className="bg-blue-600 text-white py-2 w-full px-4 rounded hover:bg-blue-700 transition mt-4">
          Buscar
        </button>
      </div>
    </div>
  );
};

export default Filters;
