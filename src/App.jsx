import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/Home/Home'; // Asegúrate de que la ruta es correcta
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Cambiado para redirigir a Home */}
          <Route path="/login" element={<Login />} />
          {/* Puedes añadir más rutas según sea necesario */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
