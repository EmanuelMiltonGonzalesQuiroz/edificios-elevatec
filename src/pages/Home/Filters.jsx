import React, { useState } from 'react';

const Filters = ({ onApplyFilters }) => {
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
    onApplyFilters(filters);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Filtros</h2>
      <div className="space-y-2">
        <label>Tipo de Transacción</label>
        <select name="transactionType" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Todos</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="anticretico">Anticrético</option>
          <option value="preventa">Preventa</option>
        </select>
        <label>Rango de Precio</label>
        <div className="flex space-x-2">
          <input type="number" name="priceMin" placeholder="Mínimo" onChange={handleChange} className="w-1/2 p-2 border rounded" />
          <input type="number" name="priceMax" placeholder="Máximo" onChange={handleChange} className="w-1/2 p-2 border rounded" />
        </div>
        <label>Habitaciones</label>
        <input type="number" name="rooms" placeholder="Cantidad de habitaciones" onChange={handleChange} className="w-full p-2 border rounded" />
        <label>Baños</label>
        <input type="number" name="bathrooms" placeholder="Cantidad de baños" onChange={handleChange} className="w-full p-2 border rounded" />
        <label>Área (m²)</label>
        <div className="flex space-x-2">
          <input type="number" name="areaMin" placeholder="Mínimo" onChange={handleChange} className="w-1/2 p-2 border rounded" />
          <input type="number" name="areaMax" placeholder="Máximo" onChange={handleChange} className="w-1/2 p-2 border rounded" />
        </div>
        <button onClick={applyFilters} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
