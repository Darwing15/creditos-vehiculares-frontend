import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Motorbike, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginGlobal = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación: Aceptamos cualquier credencial para el prototipo con data mock
    if (email && password) {
      loginGlobal(email); // Inyecta el usuario mock al estado global
      navigate('/dashboard'); // Redirige al dashboard de inmediato
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">

      {/* SECCIÓN IZQUIERDA: Branding y Color de la Selva */}
      <div className="hidden lg:flex w-1/2 bg-emerald-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-800 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

        <div className="relative z-10 flex items-center gap-3 text-white">
          <Motorbike size={32} strokeWidth={2.5} />
          <h1 className="text-2xl font-bold tracking-wide">Inversiones Sotomayor</h1>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Impulsando el progreso <br /> en el corazón de Tocache.
          </h2>
          <p className="text-emerald-100 text-lg max-w-md">
            Gestiona tus créditos, clientes e inventario de manera eficiente, rápida y segura desde cualquier sucursal.
          </p>
        </div>
        <div className="relative z-10 text-emerald-200 text-sm">
          &copy; {new Date().getFullYear()} Sistema Web de Créditos. Tocache, Perú.
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Bienvenido de nuevo</h2>
              <p className="text-slate-500 mt-2">Ingresa tus credenciales de acceso</p>
            </div>

            {/* Campo Correo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                  placeholder="ejemplo@tienda.com"
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 block">Contraseña</label>
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Opción Recordarme */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600 cursor-pointer">
                Recordarme en este equipo
              </label>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex justify-center items-center"
            >
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}