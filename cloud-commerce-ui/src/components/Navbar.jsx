import React from 'react';
import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, ListOrdered, ShoppingBag } from 'lucide-react';

export const Navbar = ({ vistaActual, setVistaActual, user, onLogout, cartCount, openCart }) => {
  const handleLogout = () => {
    apiService.logout();
    onLogout();
    setVistaActual('catalogo');
  };

  const isCliente = user && user.rol === 'ROLE_CLIENTE';
  const isAdmin = user && user.rol === 'ROLE_ADMIN';

  // Formateamos el rol para remover "ROLE_" y mostrar solo "ADMIN" o "CLIENTE"
  const rolFormateado = user?.rol ? user.rol.replace('ROLE_', '') : '';

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1a0a2e] via-[#2d0a3e] to-[#0d0d1a] text-white shadow-lg shadow-purple-900/30 backdrop-blur-md border-b border-purple-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo del Sitio */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setVistaActual('catalogo')}
          >
            <ShoppingBag className="h-8 w-8 text-purple-400 group-hover:text-[#f472b6] transition-colors" />
            <span className="ml-2 font-extrabold text-lg tracking-wide drop-shadow-sm font-mono">Mercadito Libre</span>
          </div>

          {/* Links de navegación */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setVistaActual('catalogo')}
              className={`px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer font-mono ${
                vistaActual === 'catalogo' ? 'bg-[#c084fc]/20 text-[#c084fc] shadow-sm backdrop-blur-sm' : 'text-purple-200'
              }`}
            >
              Catálogo
            </button>

            {/* Botón para clientes */}
            {isCliente && (
              <button
                onClick={() => setVistaActual('miscompras')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer font-mono ${
                  vistaActual === 'miscompras' ? 'bg-[#c084fc]/20 text-[#c084fc] shadow-sm backdrop-blur-sm' : 'text-purple-200'
                }`}
              >
                <ListOrdered className="w-4 h-4"/>
                Mis Compras
              </button>
            )}

            {/* Botón para administradores */}
            {isAdmin && (
              <button
                onClick={() => setVistaActual('admin-panel')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/10 cursor-pointer font-mono ${
                  vistaActual === 'admin-panel' ? 'bg-[#c084fc]/20 text-[#c084fc] shadow-sm backdrop-blur-sm' : 'text-purple-200'
                }`}
              >
                <ListOrdered className="w-4 h-4"/>
                Admin Panel 
              </button>
            )}

            {/* Sección de usuario / autenticación */}
            {user ? (
              <>
                {/* Píldora de Usuario y Rol claramente visible */}
                <div className="flex items-center gap-2 bg-purple-950/40 px-3.5 py-1.5 rounded-full border border-purple-700/40 shadow-inner">
                  <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm font-semibold truncate max-w-[150px] font-mono text-purple-200" title={user.nombre || user.username}>
                    {user.nombre || user.username}
                  </span>
                  <span className="bg-[#c084fc]/20 text-[#c084fc] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-purple-600/40 tracking-wider flex-shrink-0">
                    {rolFormateado}
                  </span>
                </div>

                {/* Carrito de Compras para Clientes */}
                {isCliente && (
                  <button 
                    onClick={openCart}
                    className="relative p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <ShoppingCart className="w-6 h-6 text-purple-200 group-hover:text-[#f472b6]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#f472b6] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border-2 border-purple-700 shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Botón para Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-pink-950/40 text-purple-300 hover:text-[#f472b6] transition-all cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setVistaActual('login')}
                  className="px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all hover:bg-white/10 cursor-pointer font-mono text-purple-200"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setVistaActual('register')}
                  className="bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white hover:from-[#7c3aed] hover:to-[#ec4899] px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-md shadow-purple-900/30 cursor-pointer font-mono"
                >
                  Registrarse 
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};