import { db } from '../../connection/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const checkSetting = async (settingName) => {
  try {
    const settingsDoc = doc(db, 'settings', 'views_without_login');
    const settingsSnapshot = await getDoc(settingsDoc);

    if (settingsSnapshot.exists()) {
      const data = settingsSnapshot.data();
      return data[settingName] || false; // Devuelve el valor de la configuración o false si no existe
    } else {
      console.warn("No se encontró la configuración.");
      return false; // Retorna false si el documento no existe
    }
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    return false; // Retorna false en caso de error
  }
};
