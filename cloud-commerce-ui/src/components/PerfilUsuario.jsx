import React from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';

export const PerfilUsuario = ({ user }) => {
  const esAdmin = user?.rol === 'ROLE_ADMIN';

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-[#13131f]/90 backdrop-blur-sm rounded-3xl border border-purple-800/30 p-8 shadow-xl shadow-purple-900/30">
        
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-[#a855f7] to-[#f472b6] rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-900/30 mb-4">
            <User className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-extrabold text-purple-100">{user?.nombre || 'Usuario'}</h2>
          <span className="bg-purple-900/50 text-purple-300 font-bold text-xs px-3.5 py-1 rounded-full uppercase mt-2 inline-block border border-purple-700/40">
            {esAdmin ? 'Administrador' : 'Cliente Registrado'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3.5 p-4 bg-purple-950/30 rounded-2xl border border-purple-800/30">
            <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-purple-500 font-semibold block uppercase tracking-wider">Correo Electrónico</span>
              <span className="text-sm font-bold text-purple-100">{user?.username || 'correo@ejemplo.com'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-purple-950/30 rounded-2xl border border-purple-800/30">
            <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-purple-500 font-semibold block uppercase tracking-wider">Teléfono de contacto</span>
              <span className="text-sm font-bold text-purple-100">{user?.telefono || 'No registrado'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-purple-950/30 rounded-2xl border border-purple-800/30">
            <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-purple-500 font-semibold block uppercase tracking-wider">Dirección de Envío</span>
              <span className="text-sm font-bold text-purple-100">{user?.direccion || 'Sin dirección asignada'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};