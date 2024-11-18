import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { db } from '../../connection/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Switch from 'react-switch';
import ContractTypeSettings from '../../components/Settings/ContractTypeSettings';
import PlaceTypeSettings from '../../components/Settings/PlaceTypeSettings';

const SettingsModal = ({ onClose }) => {
  const [settings, setSettings] = useState({
    publishDetail: false,
  });
  const [contractTypes, setContractTypes] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const generalSettingsDoc = doc(db, 'settings', 'views_without_login');
      const contractTypesDoc = doc(db, 'settings', 'contractTypes');
      const placeTypesDoc = doc(db, 'settings', 'placeTypes');

      const [generalSnapshot, contractSnapshot, placeSnapshot] = await Promise.all([
        getDoc(generalSettingsDoc),
        getDoc(contractTypesDoc),
        getDoc(placeTypesDoc),
      ]);

      if (generalSnapshot.exists()) {
        setSettings(generalSnapshot.data());
      } else {
        await setDoc(generalSettingsDoc, { publishDetail: false });
      }

      if (contractSnapshot.exists()) {
        const options = contractSnapshot.data().options.map((option) => ({
          ...option,
          enabled: option.enabled ?? true,
        }));
        setContractTypes(options);
      } else {
        const defaultContractTypes = [
          { label: 'Venta', enabled: true },
          { label: 'Alquiler', enabled: true },
          { label: 'Anticrético', enabled: true },
          { label: 'Preventa', enabled: true },
        ];
        await setDoc(contractTypesDoc, { options: defaultContractTypes });
        setContractTypes(defaultContractTypes);
      }

      if (placeSnapshot.exists()) {
        const options = placeSnapshot.data().options.map((option) => ({
          ...option,
          enabled: option.enabled ?? true,
        }));
        setPlaceTypes(options);
      } else {
        const defaultPlaceTypes = [
          { label: 'Departamento', enabled: true },
          { label: 'Edificio', enabled: true },
          { label: 'Casa', enabled: true },
          { label: 'Local', enabled: true },
          { label: 'Oficina', enabled: true },
        ];
        await setDoc(placeTypesDoc, { options: defaultPlaceTypes });
        setPlaceTypes(defaultPlaceTypes);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const generalSettingsDoc = doc(db, 'settings', 'views_without_login');
      const contractTypesDoc = doc(db, 'settings', 'contractTypes');
      const placeTypesDoc = doc(db, 'settings', 'placeTypes');

      await Promise.all([
        setDoc(generalSettingsDoc, settings),
        setDoc(contractTypesDoc, { options: contractTypes }),
        setDoc(placeTypesDoc, { options: placeTypes }),
      ]);

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar configuraciones:', error);
    }
  };

  const handleSwitchChange = (settingName) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [settingName]: !prevSettings[settingName],
    }));
  };

  return (
    <div className="min-w-[40vw]">
      <h3 className="font-semibold text-gray-700 mb-2">
        Vistas de los Usuarios sin Inicio de Sesión
      </h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">
            Detalles de las Publicaciones
          </span>
          <Switch
            onChange={() => handleSwitchChange('publishDetail')}
            checked={settings.publishDetail}
            onColor="#4CAF50"
            offColor="#ccc"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
      </div>

      <ContractTypeSettings
        contractTypes={contractTypes}
        setContractTypes={setContractTypes}
      />

      <PlaceTypeSettings
        placeTypes={placeTypes}
        setPlaceTypes={setPlaceTypes}
      />

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          <FaSave />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
