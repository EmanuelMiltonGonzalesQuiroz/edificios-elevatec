import React, { useState } from 'react';

const Table = ({ columnTitles, data, hasIndex = false, buttons = [], onSort }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.(key, direction); // Llama a la función de ordenamiento proporcionada por el padre
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {hasIndex && <th className="px-4 py-2 border">#</th>}
            {columnTitles.map(({ key, title, sortable }, index) => (
              <th
                key={index}
                className="px-4 py-2 border bg-gray-100 font-semibold cursor-pointer"
                onClick={() => sortable && handleSort(key)}
              >
                {title} {sortable && (sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇵')}
              </th>
            ))}
            {buttons.length > 0 && <th className="px-4 py-2 border bg-gray-100 font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={row.id} className="border-b">
              {hasIndex && <td className="px-4 py-2 border text-center">{rowIndex + 1}</td>}
              {columnTitles.map(({ key }, index) => (
                <td key={index} className="px-4 py-2 border text-center">{row[key]}</td>
              ))}
              {buttons.length > 0 && (
                <td className="px-4 py-2 border text-center flex flex-col items-center space-y-1">
                  {buttons.map((Button, buttonIndex) => (
                    <Button key={buttonIndex} row={row} />
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
