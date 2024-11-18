// src/utils/filterPublications.js

export const filterPublications = (
  publicationsData,
  enabledContractTypes,
  enabledPlaceTypes,
  userMap
) => {
  return publicationsData
    .filter((pub) => {
      // Verificar si el usuario que subió la publicación está activo
      const uploader = userMap[pub.uploadedBy];
      if (!uploader || uploader.state === 'inactive' || uploader.state === 'deleted') {
        return false;
      }

      // Normalizar a minúsculas para evitar problemas de mayúsculas
      const transactionType = pub.transactionType?.toLowerCase() || '';
      const placeType = pub.placeType?.toLowerCase() || '';

      // Verificar si los tipos están habilitados
      const transactionTypeEnabled = enabledContractTypes.includes(transactionType);
      const placeTypeEnabled = enabledPlaceTypes.includes(placeType);

      if (!transactionTypeEnabled || !placeTypeEnabled) {
        return false;
      }

      // Si pasa las verificaciones anteriores, incluimos la publicación
      return true;
    })
    .sort((a, b) => {
      if (a.state === 'priority' && b.state !== 'priority') return -1;
      if (a.state !== 'priority' && b.state === 'priority') return 1;
      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });
};
