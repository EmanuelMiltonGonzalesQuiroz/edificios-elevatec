import React, { useState } from 'react';
import DatabaseSelectInput from '../../components/layout/DatabaseSelectInput';

const Filters = ({ onApplyFilters, onClose }) => {
  const [filters, setFilters] = useState({
    transactionType: '',
    placeType: '',
    priceMin: '',
    priceMax: '',
    rooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    currency: '',
    state: '',
    city: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSelectChange = (name) => (selectedOption) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: selectedOption.value }));
  };

  const applyFilters = () => {
    // Normalizar todos los filtros sensibles a texto para ser insensibles a mayúsculas/minúsculas
    const normalizedFilters = {
      ...filters,
      transactionType: filters.transactionType?.toLowerCase() || '',
      placeType: filters.placeType?.toLowerCase() || '',
      currency: filters.currency?.toLowerCase() || '',
      state: filters.state?.toLowerCase() || '',
      city: filters.city?.toLowerCase() || '',
    };
  
    onApplyFilters(normalizedFilters); // Aplica los filtros normalizados
    if (typeof onClose === 'function') onClose(); // Cierra el modal solo si onClose es una función válida
  };

  return (
    <div className="p-4">
      <div className="space-y-2">
        {/* Tipo de Transacción */}
        <DatabaseSelectInput
          label="Tipo de Transacción"
          documentName="contractTypes"
          onChange={handleSelectChange('transactionType')}
          value={filters.transactionType}
        />

        {/* Tipo de Lugar */}
        <DatabaseSelectInput
          label="Tipo de Lugar"
          documentName="placeTypes"
          onChange={handleSelectChange('placeType')}
          value={filters.placeType}
        />

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

        {/* Área */}
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

        {/* Moneda */}
        <label>Moneda</label>
        <select
          name="currency"
          value={filters.currency}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona</option>
          <option value="USD">Dólar (USD)</option>
          <option value="BOB">Boliviano (BOB)</option>
        </select>

        {/* Estado */}
        <label>Estado</label>
        <select
          name="state"
          value={filters.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona</option>
          <option value="priority">Prioridad</option>
          <option value="active">Activo</option>
        </select>

        {/* Botón de Aplicar Filtros */}
        <button onClick={applyFilters} className="bg-blue-600 text-white py-2 w-full px-4 rounded hover:bg-blue-700 transition mt-4">
          Buscar
        </button>
      </div>
    </div>
  );
};

export default Filters;
