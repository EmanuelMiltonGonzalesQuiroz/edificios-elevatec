import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../connection/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdAttachEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png'; 

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Para alternar entre registro e inicio de sesión
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (email === '' || password === '') {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      login(userCredential.user);
      window.location.href = '/';
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleRegister = async () => {
    setError('');
    if (email === '' || password === '') {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await userCredential.user.sendEmailVerification();

      const userData = {
        username: email.split('@')[0],
        email: email,
        password: password,
        phone: "60195213257",
        role: "Usuario",
        fechaCreacion: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      alert('Se ha enviado un correo de verificación a tu email.');
      login(userCredential.user);
      window.location.href = '/';
    } catch (err) {
      setError('Error al registrarse. Verifica los datos ingresados.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userData = {
        username: result.user.displayName || result.user.email.split('@')[0],
        email: result.user.email,
        phone: result.user.phoneNumber || "N/A",
        role: "Usuario",
        fechaCreacion: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', result.user.uid), userData);

      login(result.user);
      window.location.href = '/';
    } catch (error) {
      setError('Error al iniciar sesión con Google.');
    }
  };

  const handleKeyDown = (event, nextField) => {
    if (event.key === 'Enter') {
      if (nextField) {
        nextField.focus();
      } else {
        isRegistering ? handleRegister() : handleLogin();
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegistering ? 'Regístrate' : 'Inicia Sesión'}
        </h2>
        <LoginFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={error}
          handleLogin={isRegistering ? handleRegister : handleLogin}
          handleKeyDown={handleKeyDown}
          isRegistering={isRegistering}
        />
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded mt-4 hover:bg-gray-100 transition flex justify-center items-center"
        >
          <FcGoogle size={20} className="mr-2" /> Iniciar/Registrarse con Google
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Componente LoginFields (mueve este código aquí si no estaba definido)
const LoginFields = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  handleLogin,
  handleKeyDown,
  isRegistering,
}) => {
  let passwordInputRef = null;

  return (
    <>
      <div className="mb-4 relative">
        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
          Correo Electrónico
        </label>
        <div className="flex items-center border rounded bg-gray-100 overflow-hidden">
          <MdAttachEmail className="text-gray-500 ml-3" size={24} />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
          />
        </div>
      </div>
      <div className="mb-4 relative">
        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
          Contraseña
        </label>
        <div className="flex items-center border rounded bg-gray-100 overflow-hidden">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            ref={(input) => (passwordInputRef = input)}
            onKeyDown={(e) => handleKeyDown(e, null)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-3 text-gray-600 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
      </button>
    </>
  );
};

export default LoginForm;
