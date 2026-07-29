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
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-pink-200/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo del Sitio */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setVistaActual('catalogo')}
          >
            <ShoppingBag className="h-8 w-8 text-pink-200 group-hover:text-white transition-colors animate-pulse" />
            <span className="ml-2 font-extrabold text-lg tracking-wide drop-shadow-sm">Mercadito Libre</span>
          </div>

          {/* Links de navegación */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setVistaActual('catalogo')}
              className={`px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/20 cursor-pointer ${
                vistaActual === 'catalogo' ? 'bg-white/25 font-bold shadow-sm backdrop-blur-sm' : ''
              }`}
            >
              Catálogo
            </button>

            {/* Botón para clientes */}
            {isCliente && (
              <button
                onClick={() => setVistaActual('miscompras')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/20 cursor-pointer ${
                  vistaActual === 'miscompras' ? 'bg-white/25 font-bold shadow-sm backdrop-blur-sm' : ''
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 hover:bg-white/20 cursor-pointer ${
                  vistaActual === 'admin-panel' ? 'bg-white/25 font-bold shadow-sm backdrop-blur-sm' : ''
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
                <div className="flex items-center gap-2 bg-pink-950/30 px-3.5 py-1.5 rounded-full border border-pink-300/30 shadow-inner">
                  <User className="w-4 h-4 text-pink-200 flex-shrink-0" />
                  
                  {/* Nombre o Correo */}
                  <span className="text-sm font-semibold truncate max-w-[150px]" title={user.nombre || user.username}>
                    {user.nombre || user.username}
                  </span>

                  {/* Badge para el Rol */}
                  <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-white/20 tracking-wider flex-shrink-0">
                    {rolFormateado}
                  </span>
                </div>

                {/* Carrito de Compras para Clientes */}
                {isCliente && (
                  <button 
                    onClick={openCart}
                    className="relative p-2 rounded-full hover:bg-white/20 transition-all cursor-pointer group"
                  >
                    <ShoppingCart className="w-6 h-6 text-white group-hover:text-pink-100" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold border-2 border-pink-600 animate-bounce shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Botón para Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-rose-900/40 hover:text-rose-200 transition-all cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setVistaActual('login')}
                  className="px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all hover:bg-white/20 cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setVistaActual('register')}
                  className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-md shadow-pink-900/10 cursor-pointer"
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