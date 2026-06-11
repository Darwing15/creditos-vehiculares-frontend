import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// Layout
import MainLayout from '../layouts/MainLayout';

// Páginas
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Creditos from '../pages/Creditos';
import Cobranza from '../pages/Cobranza';
import Inventario from '../pages/Inventario';
import Caja from '../pages/Caja';
import Usuarios from '../pages/Usuarios';
import Sucursales from '../pages/Sucursales';
import Reportes from '../pages/Reportes';
import Configuracion from '../pages/Configuracion';

export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Router>
      <Routes>
        {/* Ruta Pública: Si ya inició sesión, lo manda directo al dashboard */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Rutas Protegidas: Si NO ha iniciado sesión, los bota al login */}
        <Route
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          {/* 1. Al entrar a la raíz "/" con sesión iniciada, redirige limpiamente a "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="creditos" element={<Creditos />} />
          <Route path="cobranza" element={<Cobranza />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="caja" element={<Caja />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="sucursales" element={<Sucursales />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}