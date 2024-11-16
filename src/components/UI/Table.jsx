import React from 'react';

const Table = ({ columnTitles, data, hasIndex = false, buttons = [] }) => {
  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {hasIndex && <th className="px-4 py-2 border">#</th>}
            {columnTitles.map((title, index) => (
              <th key={index} className="px-4 py-2 border bg-gray-100 font-semibold">
                {title}
              </th>
            ))}
            {buttons.length > 0 && <th className="px-4 py-2 border bg-gray-100 font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id} className="border-b">
              {hasIndex && <td className="px-4 py-2 border text-center">{rowIndex + 1}</td>}
              <td className="px-4 py-2 border text-center">{row.username}</td>
              <td className="px-4 py-2 border text-center">{row.email}</td>
              <td className="px-4 py-2 border text-center">{row.phone}</td>
              <td className="px-4 py-2 border text-center">{row.role}</td>
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
