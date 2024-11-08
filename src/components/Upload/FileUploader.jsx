import React from 'react';

const FileUploader = ({ onChange, label = "Archivos", acceptedTypes = [] }) => {
  // Convierte la lista de tipos aceptados en una cadena para el atributo accept del input
  const acceptTypes = acceptedTypes.length > 0 ? acceptedTypes.join(",") : "";

  return (
    <div>
      <label className="block text-gray-700 text-sm mb-1">{label}</label>
      <input
        type="file"
        accept={acceptTypes} // Define los tipos de archivo aceptados
        multiple
        onChange={onChange}
        className="w-full p-1 border rounded"
      />
    </div>
  );
};

export default FileUploader;
