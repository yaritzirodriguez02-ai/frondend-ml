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
        <div className="max-w-lg w-full mx-auto my-12 bg-[#13131f]/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-purple-900/30 overflow-hidden border border-purple-800/30">
            <div className="bg-gradient-to-r from-[#1a0a2e] via-[#2d0a3e] to-[#0d0d1a] px-6 py-6 text-center text-white shadow-sm border-b border-purple-800/30">
                <h2 className="text-2xl font-bold drop-shadow-sm font-mono">Bienvenido de vuelta!</h2>
                <p className="text-purple-300 mt-1 text-sm font-medium">
                    Inicia sesión en tu cuenta de Mercadito hoy mismo
                </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
                {error && (
                    <div className="bg-pink-950/40 text-pink-300 p-4 rounded-2xl flex items-start gap-2.5 border border-pink-800/40 text-sm shadow-sm">
                        <AlertCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-1">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-purple-100 placeholder-purple-500 transition-all"
                            placeholder="tucorreo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-purple-100 placeholder-purple-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#f472b6] hover:from-[#7c3aed] hover:to-[#ec4899] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                    <LogIn className="w-5 h-5" />
                    {loading ? 'Iniciando sesión...' : 'Entrar'}
                </button>

                <div className="text-center text-sm text-purple-400 border-t border-purple-800/30 pt-5">
                    ¿No tienes una cuenta?{' '}
                    <button
                        type="button"
                        onClick={onGoToRegister}
                        className="text-[#c084fc] hover:text-[#f472b6] hover:underline font-bold transition-colors cursor-pointer"
                    >
                        Regístrate Ahora
                    </button>
                </div>
            </form>
        </div>
    )
}