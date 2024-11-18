// src/services/settingsService.js

import { db } from '../connection/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getEnabledTypes = async () => {
  const contractTypesDoc = doc(db, 'settings', 'contractTypes');
  const placeTypesDoc = doc(db, 'settings', 'placeTypes');

  const [contractSnapshot, placeSnapshot] = await Promise.all([
    getDoc(contractTypesDoc),
    getDoc(placeTypesDoc),
  ]);

  let enabledContractTypes = [];
  let enabledPlaceTypes = [];

  if (contractSnapshot.exists()) {
    const options = contractSnapshot.data().options;
    enabledContractTypes = options
      .filter((opt) => opt.enabled)
      .map((opt) => opt.label.toLowerCase());
  }

  if (placeSnapshot.exists()) {
    const options = placeSnapshot.data().options;
    enabledPlaceTypes = options
      .filter((opt) => opt.enabled)
      .map((opt) => opt.label.toLowerCase());
  }

  return { enabledContractTypes, enabledPlaceTypes };
};
