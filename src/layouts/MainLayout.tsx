import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Wallet, Motorbike,
  CircleDollarSign, BarChart3, UserCog, Store, Settings,
  Bell, Search, Menu, LogOut
} from 'lucide-react';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { name: 'Dashboard', path: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Clientes', path: 'clientes', icon: <Users size={20} /> },
    { name: 'Créditos', path: 'creditos', icon: <FileText size={20} /> },
    { name: 'Cobranza', path: 'cobranza', icon: <Wallet size={20} /> },
    { name: 'Inventario', path: 'inventario', icon: <Motorbike size={20} /> },
    { name: 'Caja', path: 'caja', icon: <CircleDollarSign size={20} /> },
    { name: 'Reportes', path: 'reportes', icon: <BarChart3 size={20} /> },
    { name: 'Usuarios', path: 'usuarios', icon: <UserCog size={20} /> },
    { name: 'Sucursales', path: 'sucursales', icon: <Store size={20} /> },
    { name: 'Configuración', path: 'configuracion', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* SIDEBAR (Barra Lateral) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo de la empresa */}
        <div className="flex items-center justify-center h-16 bg-emerald-950 text-white font-bold text-lg tracking-wide gap-2">
          <Motorbike size={24} className="text-emerald-400" />
          <span>Créditos Vehiculares</span>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-emerald-800 text-white font-medium'
                  : 'hover:bg-emerald-800/50 hover:text-white'
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-emerald-500'}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Perfil inferior en el Sidebar */}
        <div className="p-4 bg-emerald-950 border-t border-emerald-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin Tocache</p>
              <p className="text-xs text-emerald-400 truncate">admin@empresa.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-emerald-400 hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CONTENIDO PRINCIPAL (Header + Vistas) */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER (Encabezado) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Buscador global */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cliente, crédito..."
                className="bg-transparent border-none outline-none pl-2 text-sm w-full text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* ÁREA DE RENDERIZADO DE PANTALLAS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* El componente Outlet renderiza la ruta hija activa */}
          <Outlet />
        </main>

      </div>
    </div>
  );
}