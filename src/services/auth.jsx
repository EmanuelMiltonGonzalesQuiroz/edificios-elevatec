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

// Función para registrar un usuario con email y contraseña
export async function registerUser(email, password) {
  try {
    const userDocRef = doc(db, 'users', email);

    const newUser = {
      uid: email,
      email: email,
      username: email.split('@')[0] || email,
      role: 'Usuario',
      password: password, // No almacenar contraseñas en texto plano en producción
      fechaCreacion: new Date().toISOString(),
      phone: "N/A",
      state: 'active' // El usuario se registra como activo
    };

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
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      
      // Verifica si el estado del usuario es "inactive"
      if (userData.state === 'inactive') {
        throw new Error('Su cuenta ha sido deshabilitada.');
      }
      return userData; // Retorna datos si el usuario está activo
    } else {
      // Si el usuario no existe en la base de datos, lo registramos
      const newUser = await registerWithGoogle(user);
      return newUser;
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message);
    throw error;
  }
}

// Función para registrar con Google
export async function registerWithGoogle(user) {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const docSnapshot = await getDoc(userDocRef);

    if (!docSnapshot.exists()) {
      const newUser = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || 'Usuario',
        role: 'Usuario',
        fechaCreacion: new Date().toISOString(),
        state: 'active' // Registro inicial del usuario como activo
      };
      await setDoc(userDocRef, newUser);
    }

    return user;
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

// Función para validar credenciales de usuario con email y contraseña
export async function validateUserCredentials(email, password) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'Usuario no encontrado' };
    } else {
      let userDoc;
      let userId;
      querySnapshot.forEach((doc) => {
        userDoc = doc.data();
        userId = doc.id;
      });

      // Verificar si el usuario está inactivo
      if (userDoc.state === 'inactive') {
        return { success: false, message: 'Su cuenta ha sido deshabilitada.' };
      }

      // Compara contraseñas aquí (se recomienda usar una comparación segura en el backend)
      if (userDoc.password === password) {
        return { success: true, userData: { ...userDoc, id: userId } };
      } else {
        return { success: false, message: 'Contraseña incorrecta' };
      }
    }
  } catch (error) {
    console.error('Error al validar las credenciales:', error.message);
    return { success: false, error: error.message };
  }
}
