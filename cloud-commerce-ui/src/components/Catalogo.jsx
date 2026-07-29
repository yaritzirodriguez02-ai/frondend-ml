import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, Filter, ShoppingCart, Info, AlertTriangle } from 'lucide-react';

export const Catalogo = ({ setVistaActual, user, AddToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true); // Se corrigió [true] a true
    const [error, setError] = useState('');

    // Filtros 
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    const cargaDatosCatalogo = async () => {
        setCarga(true);
        try {
            const datosProductos = await apiService.getProductos();
            setProductos(datosProductos);
            const datosCategorias = await apiService.getCategorias();
            setCategorias(datosCategorias);
            setError('');
        } catch (err) {
            setError('Error al conectar con el backend: ' + err.message);
        } finally {
            setCarga(false);
        }
    };

    useEffect(() => {
        cargaDatosCatalogo();
    }, []);

    const handleAddToCart = (producto) => {
        if (!user) {
            setVistaActual('login');
            return;
        }
        if (user.rol !== 'ROLE_CLIENTE') {
            alert('Solo los usuarios registrados con el rol de Cliente pueden realizar compras.');
            return;
        }
        AddToCart(producto);
    };

    const filtroProductos = productos.filter((producto) => {
        const busqueda = 
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
            selecionCategoria === 'Todos' || 
            (producto.categoria && producto.categoria.nombre === selecionCategoria);    

        return busqueda && busquedaCategorias;
    });

    if (carga) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-pink-50/50 min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                <p className="text-pink-600 mt-4 font-medium">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-pink-50/30 min-h-screen">
            
            {/* Banner Principal */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 rounded-3xl p-8 mb-8 text-white shadow-lg shadow-pink-200 relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">Catálogo de Productos</h1>
                    <p className="mt-2 text-pink-50 text-sm sm:text-base font-medium leading-relaxed">
                        Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 opacity-15 flex items-center justify-center p-8">
                    <ShoppingCart className="w-64 h-64 text-white" />
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl flex items-start gap-2.5 border border-rose-200 text-sm mb-6 shadow-sm">
                    <Info className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Aviso del Servidor:</span> {error}. Asegúrate de que tu backend en Spring Boot esté corriendo.
                    </div>
                </div>
            )}

            {/* Buscador y Contenido */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filtros Lateral (Sidebar) */}
                <div className="w-full md:w-1/4 flex-shrink-0 space-y-6">
                    {/* Tarjeta de Búsqueda */}
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3">
                        <h3 className="font-bold text-pink-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Search className="w-4 h-4 text-pink-500" /> Buscar Producto
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Escribe nombre o descripción..."
                                className="w-full p-3 pl-4 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm text-gray-800 placeholder-pink-300 bg-pink-50/30"
                            />
                        </div>
                    </div>

                    {/* Tarjeta de Categorías */}
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-pink-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Filter className="w-4 h-4 text-pink-500" /> Categorías
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => setSelecionCategoria('Todos')}
                                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                                    selecionCategoria === 'Todos'
                                        ? 'bg-pink-500 text-white font-bold shadow-sm shadow-pink-200'
                                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                }`}
                            >
                                Todas las categorías
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelecionCategoria(cat.nombre)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                                        selecionCategoria === cat.nombre
                                            ? 'bg-pink-500 text-white font-bold shadow-sm shadow-pink-200'
                                            : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                    }`}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cuadrícula de Productos */}
                <div className="w-full md:w-3/4">
                    {filtroProductos.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center shadow-sm">
                            <AlertTriangle className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                            <h3 className="font-bold text-lg text-pink-900">No se encontraron productos</h3>
                            <p className="text-pink-400 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtroProductos.map((producto) => {
                                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                                const isOutOfStock = producto.stock <= 0;

                                // Lee independientemente de si el backend devuelve imagenurl, imagenUrl o imagen
                                const urlFinal = producto.imagenurl || producto.imagenUrl || producto.imagen || defaultImage;

                                return (
                                    <div
                                        key={producto.id}
                                        className="bg-white rounded-3xl border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Imagen con zoom effect */}
                                        <div className="h-48 w-full bg-pink-50 relative overflow-hidden">
                                            <img
                                                src={urlFinal}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    // Si el link colocado falla o Amazon bloquea la imagen, pone la default
                                                    e.target.onerror = null;
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            {/* Categoría Badge */}
                                            {producto.categoria && (
                                                <span className="absolute top-3 left-3 bg-pink-600/85 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cuerpo */}
                                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                {/* Proveedor */}
                                                {producto.proveedor && (
                                                    <div className="text-xs text-pink-400 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-truck text-pink-500"></i> {producto.proveedor.nombreEmpresa}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-pink-600 transition-colors">
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-gray-500 text-xs line-clamp-2 h-8 leading-relaxed">
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>

                                            {/* Precio y Stock */}
                                            <div className="pt-2">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-extrabold text-xl text-pink-950">
                                                        ${producto.precio ? producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'} MXN
                                                    </span>
                                                    <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}`}>
                                                        {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                                                    </span>
                                                </div>

                                                {/* Botón Comprar */}
                                                <button
                                                    onClick={() => handleAddToCart(producto)}
                                                    disabled={isOutOfStock}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
                                                        isOutOfStock
                                                            ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-pink-200 hover:shadow-md hover:shadow-pink-300/50'
                                                    }`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {!user ? 'Ingresa para comprar' : 'Añadir al Carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};