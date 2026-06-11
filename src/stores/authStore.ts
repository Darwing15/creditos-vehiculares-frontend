import { create } from 'zustand';

interface UsuarioMock {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    sucursal: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: UsuarioMock | null;
    login: (email: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: (email) => set({
        isAuthenticated: true,
        user: {
            id: 1,
            nombre: 'Rosalina Gonzales Marchena', // Data mock de tu personal existente
            email: email,
            rol: 'Administrador',
            sucursal: 'Sede Central (Tocache)'
        }
    }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));