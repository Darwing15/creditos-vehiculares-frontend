import AppRouter from './routes/AppRouter';

function App() {
  return (
    // Más adelante, aquí envolveremos el AppRouter con proveedores de contexto
    // como <AuthProvider> o configuraciones de alertas globales.
    <AppRouter />
  );
}

export default App;