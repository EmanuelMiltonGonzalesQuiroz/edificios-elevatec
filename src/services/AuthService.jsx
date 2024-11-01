// src/services/AuthService.js

import { auth, db } from '../connection/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';

export const checkUserExists = async (email) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    let userData;
    querySnapshot.forEach((doc) => {
      userData = { ...doc.data(), id: doc.id };
    });
    return userData;
  } else {
    return null;
  }
};

export const checkUserExistsByUID = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return { ...userDoc.data(), id: uid };
  } else {
    return null;
  }
};


export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = {
      username: email.split('@')[0],
      email: email,
      phone: '60195213257',
      role: 'Usuario',
      fechaCreacion: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    return { ...userData, id: userCredential.user.uid };
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error; // Propaga el error para manejarlo en el nivel superior
  }
};


export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const registerWithGoogle = async (user) => {
  const userData = {
    username: user.displayName || user.email.split('@')[0],
    email: user.email,
    phone: user.phoneNumber || 'N/A',
    role: 'Usuario',
    fechaCreacion: new Date().toISOString(),
  };
  await setDoc(doc(db, 'users', user.uid), userData);
  return { ...userData, id: user.uid };
};
