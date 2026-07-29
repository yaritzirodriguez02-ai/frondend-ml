import React from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';

export const PerfilUsuario = ({ user }) => {
  const esAdmin = user?.rol === 'ROLE_ADMIN';

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-pink-100 p-8 shadow-xl shadow-pink-100/50">
        
        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-200 mb-4">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-pink-950">{user?.nombre || 'Usuario'}</h2>
          <span className="bg-pink-100 text-pink-700 font-bold text-xs px-3.5 py-1 rounded-full uppercase mt-2 inline-block border border-pink-200">
            {esAdmin ? 'Administrador' : 'Cliente Registrado'}
          </span>
        </div>

        {/* Datos de contacto */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5 p-4 bg-pink-50/30 rounded-2xl border border-pink-100">
            <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Correo Electrónico</span>
              <span className="text-sm font-bold text-gray-800">{user?.username || 'correo@ejemplo.com'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-pink-50/30 rounded-2xl border border-pink-100">
            <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Teléfono de contacto</span>
              <span className="text-sm font-bold text-gray-800">{user?.telefono || 'No registrado'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-pink-50/30 rounded-2xl border border-pink-100">
            <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Dirección de Envío</span>
              <span className="text-sm font-bold text-gray-800">{user?.direccion || 'Sin dirección asignada'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};