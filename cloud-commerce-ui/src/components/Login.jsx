import React, {useState} from "react";
import { apiService } from "../services/apiService";
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login = ({onLoginSuccess, onGoToRegister}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiService.login(username, password );
            onLoginSuccess(data);


        } catch (err) {
            setError(err.message || 'Credenciales invalidas. Verefica tu correo y contraseña.');
        } finally {
            setLoading(false);
            
        }
    };

    
    return(
        <div className="max-w-lg w-full mx-auto my-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-100">
            <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 px-6 py-6 text-center text-white shadow-sm">
                <h2 className="text-2xl font-bold drop-shadow-sm">Bienvenido de new!</h2>
                <p className="text-pink-100 mt-1 text-sm font-medium">
                    Inicia sesión en tu cuenta de Mercadito hoy mismo
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
                {error && (
                    <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl flex items-start gap-2.5 border border-rose-200 text-sm shadow-sm">
                        <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/*Campos correo*/}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Correo electrónico
                    </label>
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

                {/*Campos contraseña*/}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/*Boton entrar*/}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                    <LogIn className="w-5 h-5" />
                    {loading ? 'Iniciando sesión...' : 'Entrar'}
                </button>

                {/*Enlace al registro*/}
                <div className="text-center text-sm text-gray-500 border-t border-pink-100 pt-5">
                    ¿No tienes una cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToRegister}
                        className="text-pink-600 hover:text-pink-700 hover:underline font-bold transition-colors cursor-pointer"
                    >
                        Regístrate Ahora
                    </button>
                </div>
            </form>
        </div>
    )
}