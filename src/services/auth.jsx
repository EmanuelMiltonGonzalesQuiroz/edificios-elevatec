import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../connection/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../connection/firebase';

// Función para verificar si el usuario existe por correo electrónico
export async function checkUserExists(email) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error('Error al verificar si el usuario existe:', error.message);
    throw error;
  }
}

export async function registerUser(email, password) {
  try {
    // Crear un UID ficticio a partir del email (en producción se usaría un UID generado por el sistema de autenticación)

    // Referencia al documento del usuario
    const userDocRef = doc(db, 'users', email);

    // Datos del nuevo usuario
    const newUser = {
      uid: email,
      email: email,
      username: email.split('@')[0] || email,
      role: 'Usuario',
      password: password, // Nota: No almacenar contraseñas en texto plano en producción
      fechaCreacion: new Date().toISOString(),
      phone: "N/A"
    };

    // Guardar el nuevo usuario en Firestore
    await setDoc(userDocRef, newUser);
    console.log('Usuario registrado exitosamente:', newUser);
    return newUser;

  } catch (error) {
    console.error('Error al registrar al usuario:', error.message);
    alert(`Error al registrar al usuario: ${error.message}`);
    throw error;
  }
}
// Función para iniciar sesión con Google
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message);
    throw error;
  }
}

// Función para registrar con Google
export async function registerWithGoogle(user) {
  try {
    // Verifica si el usuario ya existe
    const userDocRef = doc(db, 'users', user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      const newUser = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || 'Usuario',
        role: 'Usuario',
        fechaCreacion: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUser); // Crea el documento con el UID como ID
    }

    return user; // Retorna el objeto de usuario de Google
  } catch (error) {
    console.error('Error al registrar al usuario con Google:', error.message);
    throw error;
  }
}

// Función para verificar si el usuario existe por UID
export async function checkUserExistsByUID(uid) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnapshot = await getDoc(userDocRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  } catch (error) {
    console.error('Error al verificar si el usuario existe por UID:', error.message);
    throw error;
  }
}

// Función para validar credenciales de usuario (sin almacenamiento de contraseñas en texto plano)
export async function validateUserCredentials(email, password) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No se encontró el email en Firestore.');
      return { success: false };
    } else {
      let userDoc;
      let userId;
      querySnapshot.forEach((doc) => {
        userDoc = doc.data();
        userId = doc.id;
        console.log('Datos obtenidos de Firestore:', userDoc);
      });

      // Compara contraseñas aquí (se recomienda usar una comparación segura en el backend)
      if (userDoc.password === password) {
        console.log('Credenciales correctas');
        return { success: true, userData: { ...userDoc, id: userId } };
      } else {
        console.log('Password incorrecto.');
        return { success: false };
      }
    }
  } catch (error) {
    console.error('Error al validar las credenciales:', error.message);
    return { success: false, error: error.message };
  }
}
