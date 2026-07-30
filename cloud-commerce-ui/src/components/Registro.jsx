import React, { useState } from "react";
import { apiService } from "../services/apiService";
import {
    UserPlus, User, Mail, Lock, Phone, MapPin,
    AlertCircle, CheckCircle
} from 'lucide-react';

export const Registro = ({ onRegisterSuccess, onGoToLogin }) => {

    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // El registro público SIEMPRE crea un cliente.
        // El rol no se envía como algo elegible por el usuario:
        // el backend debe asignar ROLE_CLIENTE por defecto en este endpoint,
        // sin importar lo que llegue (o no) en el payload.
        const payload = {
            username,
            password,
            nombre,
            direccion,
            telefono
        };

        try {
            await apiService.registro(payload);
            setSuccess('¡Registro completado con éxito! Ahora puedes iniciar sesión.');
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al completar el registro. Intenta con otro correo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg w-full mx-auto my-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 px-6 py-6 text-center text-white shadow-sm">
                <h2 className="text-2xl font-bold drop-shadow-sm">Crear una Cuenta</h2>
                <p className="text-pink-100 mt-1 text-sm font-medium">
                    Únete a MercaditoLibre hoy mismo
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
                {error && (
                    <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl flex items-start gap-2.5 border border-rose-200 text-sm shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-start gap-2.5 border border-emerald-200 text-sm shadow-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                {/*Nombre Completo*/}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                            placeholder="Tu nombre completo"
                        />
                    </div>
                </div>

                {/*Correo electrónico*/}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                            placeholder="tucorreo@ejemplo.com"
                        />
                    </div>
                </div>

                {/*Contraseña*/}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                        />
                    </div>
                </div>

                {/* Información adicional del cliente (siempre visible, ya que todo registro público es Cliente) */}
                <div className="space-y-4 border-t border-pink-100 pt-4">
                    <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider">Información Adicional</h3>

                    {/*Teléfono de contacto*/}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de contacto</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                                placeholder="55 1234 5678"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                                placeholder="Calle, número, colonia"
                            />
                        </div>
                    </div>
                </div>

                {/*Boton Registrarse*/}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
                >
                    <UserPlus className="w-5 h-5" />
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>

                {/*ir al login*/}
                <div className="text-center text-sm text-gray-500 border-t border-pink-100 pt-5">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToLogin}
                        className="text-pink-600 hover:text-pink-700 hover:underline font-bold transition-colors cursor-pointer"
                    >
                        Inicia sesión
                    </button>
                </div>
            </form>
        </div>
    )
}