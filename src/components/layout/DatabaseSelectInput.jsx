import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../connection/firebase';
import { doc, getDoc } from 'firebase/firestore';

const DatabaseSelectInput = ({ label, documentName, onChange, value }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const docRef = doc(db, 'settings', documentName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setOptions(data.options.map(option => ({ label: option.label, value: option.label })));
      } else {
        console.error(`El documento ${documentName} no existe en Firestore.`);
      }
    };

    fetchOptions();
  }, [documentName]);

  return (
    <div>
      <label className="block text-gray-700 text-sm mb-1">{label}</label>
      <Select
        options={options}
        onChange={onChange}
        value={options.find(option => option.value === value)}
        className="mb-2"
      />
    </div>
  );
};

export default DatabaseSelectInput;
