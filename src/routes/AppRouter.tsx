import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/* Layout */
import MainLayout from '../layouts/MainLayout';

/* Paginas */
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
import RequireModule from '../components/RequireModule';

/** 
 * Usa la politica de modulos tambien para URLs directas. 
 * @author DarwinG 
 */
export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <Router>
      <Routes>
        {/* Ruta Publica: Si ya inicio sesion, lo manda directo al dashboard */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Rutas Protegidas: Si NO ha iniciado sesion, los bota al login */}
        <Route
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          {/* 1. Al entrar a la raiz "/" con sesion iniciada, redirige limpiamente a "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<RequireModule moduleId="dashboard"><Dashboard /></RequireModule>} />
          <Route path="clientes" element={<RequireModule moduleId="clientes"><Clientes /></RequireModule>} />
          <Route path="creditos" element={<RequireModule moduleId="creditos"><Creditos /></RequireModule>} />
          <Route path="cobranza" element={<RequireModule moduleId="cobranza"><Cobranza /></RequireModule>} />
          <Route path="inventario" element={<RequireModule moduleId="inventario"><Inventario /></RequireModule>} />
          <Route path="caja" element={<RequireModule moduleId="caja"><Caja /></RequireModule>} />
          <Route path="usuarios" element={<RequireModule moduleId="usuarios"><Usuarios /></RequireModule>} />

          <Route path="sucursales" element={<RequireModule moduleId="sucursales"><Sucursales /></RequireModule>} />
          <Route path="reportes" element={<RequireModule moduleId="reportes"><Reportes /></RequireModule>} />
          <Route path="configuracion" element={<RequireModule moduleId="configuracion"><Configuracion /></RequireModule>} />
        </Route>

        {/* Redireccion por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}