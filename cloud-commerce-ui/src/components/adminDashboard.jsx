import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  DollarSign, ShoppingBag, Package, FolderTree, 
  Users, ShoppingCart, Plus, Trash2, Edit3, User, 
  Mail, Phone, MapPin, ShieldCheck, X, Check, Truck, Tags 
} from 'lucide-react';

export const AdminDashboard = ({ user }) => {
  // Pestañas principales
  const [tabActiva, setTabActiva] = useState('productos');

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]); // <-- ESTADO DE CLIENTES
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [modalProducto, setModalProducto] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [editId, setEditId] = useState(null);

  // Formulario Producto
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    categoriaId: '',
    proveedorId: ''
  });

  // Formulario Categoría
  const [formCategoria, setFormCategoria] = useState({
    nombre: '',
    descripcion: ''
  });

  // Formulario Proveedor
  const [formProveedor, setFormProveedor] = useState({
    nombreEmpresa: '',
    contacto: '',
    telefono: '',
    email: ''
  });

  // Carga inicial
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const dataProductos = await apiService.getProductos();
      setProductos(dataProductos || []);
      
      const dataCategorias = await apiService.getCategorias();
      setCategorias(dataCategorias || []);

      if (apiService.getProveedores) {
        const dataProveedores = await apiService.getProveedores();
        setProveedores(dataProveedores || []);
      }

      // Cargar Clientes desde la API
      if (apiService.getClientes) {
        const dataClientes = await apiService.getClientes();
        setClientes(dataClientes || []);
      }
    } catch (err) {
      console.error('Error al cargar datos del admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE PRODUCTOS ---
  const abrirModalCrearProducto = () => {
    setModoEdicion(false);
    setEditId(null);
    setFormProducto({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagenUrl: '',
      categoriaId: categorias[0]?.id || '',
      proveedorId: proveedores[0]?.id || ''
    });
    setModalProducto(true);
  };

  const abrirModalEditarProducto = (prod) => {
    setModoEdicion(true);
    setEditId(prod.id);
    setFormProducto({
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio: prod.precio,
      stock: prod.stock,
      imagenUrl: prod.imagenUrl || '',
      categoriaId: prod.categoria?.id || '',
      proveedorId: prod.proveedor?.id || ''
    });
    setModalProducto(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formProducto.nombre,
      descripcion: formProducto.descripcion,
      precio: parseFloat(formProducto.precio),
      stock: parseInt(formProducto.stock),
      imagenUrl: formProducto.imagenUrl,
      categoria: formProducto.categoriaId ? { id: parseInt(formProducto.categoriaId) } : null,
      proveedor: formProducto.proveedorId ? { id: parseInt(formProducto.proveedorId) } : null
    };

    try {
      if (modoEdicion) {
        await apiService.actualizarProducto(editId, payload);
      } else {
        await apiService.crearProducto(payload);
      }
      setModalProducto(false);
      cargarDatos();
    } catch (error) {
      alert('Error al guardar el producto: ' + error.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await apiService.eliminarProducto(id);
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  };

  // --- LÓGICA DE CATEGORÍAS ---
  const abrirModalCrearCategoria = () => {
    setModoEdicion(false);
    setEditId(null);
    setFormCategoria({ nombre: '', descripcion: '' });
    setModalCategoria(true);
  };

  const abrirModalEditarCategoria = (cat) => {
    setModoEdicion(true);
    setEditId(cat.id);
    setFormCategoria({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
    setModalCategoria(true);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        if (apiService.actualizarCategoria) await apiService.actualizarCategoria(editId, formCategoria);
      } else {
        if (apiService.crearCategoria) await apiService.crearCategoria(formCategoria);
      }
      setModalCategoria(false);
      cargarDatos();
    } catch (error) {
      alert('Error al guardar categoría: ' + error.message);
    }
  };

  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        if (apiService.eliminarCategoria) await apiService.eliminarCategoria(id);
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar categoría: ' + error.message);
      }
    }
  };

  // --- LÓGICA DE PROVEEDORES ---
  const abrirModalCrearProveedor = () => {
    setModoEdicion(false);
    setEditId(null);
    setFormProveedor({ nombreEmpresa: '', contacto: '', telefono: '', email: '' });
    setModalProveedor(true);
  };

  const abrirModalEditarProveedor = (prov) => {
    setModoEdicion(true);
    setEditId(prov.id);
    setFormProveedor({
      nombreEmpresa: prov.nombreEmpresa,
      contacto: prov.contacto || '',
      telefono: prov.telefono || '',
      email: prov.email || ''
    });
    setModalProveedor(true);
  };

  const guardarProveedor = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        if (apiService.actualizarProveedor) await apiService.actualizarProveedor(editId, formProveedor);
      } else {
        if (apiService.crearProveedor) await apiService.crearProveedor(formProveedor);
      }
      setModalProveedor(false);
      cargarDatos();
    } catch (error) {
      alert('Error al guardar proveedor: ' + error.message);
    }
  };

  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
      try {
        if (apiService.eliminarProveedor) await apiService.eliminarProveedor(id);
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar proveedor: ' + error.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-pink-50/20 min-h-screen">
      
      {/* Banner Superior */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-950">Panel de Administración</h1>
          <p className="text-pink-600 text-sm mt-1 font-medium">
            Supervisa las ventas, gestiona el inventario y administra la plataforma.
          </p>
        </div>
        <button
          onClick={() => setTabActiva('perfil')}
          className="flex items-center gap-2 bg-white border border-pink-200 px-4 py-2 rounded-2xl shadow-sm text-pink-700 font-bold text-sm hover:bg-pink-50 transition-all cursor-pointer w-fit"
        >
          <User className="w-4 h-4 text-pink-500" />
          Mi Perfil ({user?.nombre || 'Admin'})
        </button>
      </div>

      {/* Tarjetas de Métricas (Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Recaudado */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Total Recaudado</span>
            <h3 className="text-2xl font-extrabold text-pink-950">$0.00 MXN</h3>
            <span className="text-[11px] text-gray-400">Transacciones Pagadas</span>
          </div>
        </div>

        {/* Órdenes Totales */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Órdenes Totales</span>
            <h3 className="text-2xl font-extrabold text-pink-950">0 Órdenes</h3>
            <span className="text-[11px] text-gray-400">Historial completo</span>
          </div>
        </div>

        {/* Productos Activos */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Productos Activos</span>
            <h3 className="text-2xl font-extrabold text-pink-950">{productos.length} Artículos</h3>
            <span className="text-[11px] text-gray-400">En inventario</span>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
            <FolderTree className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Categorías</span>
            <h3 className="text-2xl font-extrabold text-pink-950">{categorias.length} Categorías</h3>
            <span className="text-[11px] text-gray-400">Clasificaciones</span>
          </div>
        </div>

      </div>

      {/* Pestañas de Gestión */}
      <div className="flex border-b border-pink-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setTabActiva('productos')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'productos'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Package className="w-4 h-4" /> Gestión de Productos
        </button>

        <button
          onClick={() => setTabActiva('categorias')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'categorias'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Tags className="w-4 h-4" /> Gestión de Categorías
        </button>

        <button
          onClick={() => setTabActiva('proveedores')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'proveedores'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Truck className="w-4 h-4" /> Gestión de Proveedores
        </button>

        <button
          onClick={() => setTabActiva('ventas')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'ventas'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> Registro de Ventas
        </button>

        <button
          onClick={() => setTabActiva('clientes')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'clientes'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
          }`}
        >
          <Users className="w-4 h-4" /> Gestión de Clientes
        </button>
      </div>

      {/* VISTA: GESTIÓN DE PRODUCTOS */}
      {tabActiva === 'productos' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-pink-950">Lista de Productos</h2>
            <button
              onClick={abrirModalCrearProducto}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-pink-50/60 text-pink-900 font-bold text-xs uppercase border-b border-pink-100">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Imagen</th>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Precio</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-pink-400">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="p-3">
                        <img
                          src={prod.imagenUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300"}
                          alt={prod.nombre}
                          className="w-12 h-12 rounded-xl object-cover border border-pink-100"
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-800">{prod.nombre}</td>
                      <td className="p-3">
                        <span className="bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          {prod.categoria?.nombre || 'General'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-pink-950">${prod.precio.toFixed(2)} MXN</td>
                      <td className="p-3">
                        <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarProducto(prod)}
                            className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA: GESTIÓN DE CATEGORÍAS */}
      {tabActiva === 'categorias' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-pink-950">Lista de Categorías</h2>
            <button
              onClick={abrirModalCrearCategoria}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nueva Categoría
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-pink-50/60 text-pink-900 font-bold text-xs uppercase border-b border-pink-100">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">ID</th>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Descripción</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-pink-400">
                      No hay categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="p-3 font-bold text-pink-900">#{cat.id}</td>
                      <td className="p-3 font-semibold text-gray-800">{cat.nombre}</td>
                      <td className="p-3 text-gray-500">{cat.descripcion || 'Sin descripción'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarCategoria(cat)}
                            className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarCategoria(cat.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA: GESTIÓN DE PROVEEDORES */}
      {tabActiva === 'proveedores' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-pink-950">Lista de Proveedores</h2>
            <button
              onClick={abrirModalCrearProveedor}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-pink-50/60 text-pink-900 font-bold text-xs uppercase border-b border-pink-100">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Empresa</th>
                  <th className="p-3.5">Contacto</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {proveedores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-pink-400">
                      No hay proveedores registrados.
                    </td>
                  </tr>
                ) : (
                  proveedores.map((prov) => (
                    <tr key={prov.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="p-3 font-semibold text-gray-800">{prov.nombreEmpresa}</td>
                      <td className="p-3 text-gray-600">{prov.contacto || 'N/A'}</td>
                      <td className="p-3 font-medium text-pink-950">{prov.telefono || 'N/A'}</td>
                      <td className="p-3 text-gray-600">{prov.email || 'N/A'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarProveedor(prov)}
                            className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProveedor(prov.id)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA: REGISTRO DE VENTAS */}
      {tabActiva === 'ventas' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-8 text-center shadow-sm">
          <ShoppingCart className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-pink-950">Historial de Ventas</h3>
          <p className="text-gray-500 text-sm mt-1">Aún no se registran compras procesadas en la plataforma.</p>
        </div>
      )}

      {/* VISTA: GESTIÓN DE CLIENTES (ACTUALIZADA) */}
      {tabActiva === 'clientes' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-pink-950">Clientes Registrados</h2>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">
              Total: {clientes.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-pink-50/60 text-pink-900 font-bold text-xs uppercase border-b border-pink-100">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Nombre</th>
                  <th className="p-3.5">Correo</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Dirección</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-pink-400">
                      No hay clientes registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  clientes.map((c, index) => (
                    <tr key={c.id || index} className="hover:bg-pink-50/30 transition-colors">
                      <td className="p-3 font-semibold text-gray-800">{c.nombre || 'Sin nombre'}</td>
                      <td className="p-3 text-pink-950 font-medium">{c.username || c.email}</td>
                      <td className="p-3 text-gray-600">{c.telefono || 'N/A'}</td>
                      <td className="p-3 text-gray-600">{c.direccion || 'N/A'}</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          CLIENTE
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA: PERFIL DEL USUARIO */}
      {tabActiva === 'perfil' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-pink-100 p-8 shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-pink-200 mb-3">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-pink-950">{user?.nombre || 'Administrador'}</h2>
            <span className="bg-pink-100 text-pink-700 font-bold text-xs px-3 py-1 rounded-full uppercase mt-1 inline-block">
              {user?.rol || 'ROLE_ADMIN'}
            </span>
          </div>

          <div className="space-y-4 border-t border-pink-100 pt-6">
            <div className="flex items-center gap-3 p-3 bg-pink-50/40 rounded-2xl border border-pink-100">
              <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Correo Electrónico</span>
                <span className="text-sm font-bold text-gray-800">{user?.username || 'admin@mercadito.com'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-pink-50/40 rounded-2xl border border-pink-100">
              <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Teléfono</span>
                <span className="text-sm font-bold text-gray-800">{user?.telefono || 'No registrado'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-pink-50/40 rounded-2xl border border-pink-100">
              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <div>
                <span className="text-xs text-gray-400 font-semibold block">Dirección</span>
                <span className="text-sm font-bold text-gray-800">{user?.direccion || 'Oficina Principal'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      {/* MODAL PRODUCTO */}
      {modalProducto && (
        <div className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setModalProducto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-pink-950 mb-4">
              {modoEdicion ? 'Actualizar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formProducto.nombre}
                  onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Precio ($ MXN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formProducto.precio}
                    onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
                    required
                    className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formProducto.stock}
                    onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })}
                    required
                    className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                <select
                  value={formProducto.categoriaId}
                  onChange={(e) => setFormProducto({ ...formProducto, categoriaId: e.target.value })}
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Selecciona categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Proveedor</label>
                <select
                  value={formProducto.proveedorId}
                  onChange={(e) => setFormProducto({ ...formProducto, proveedorId: e.target.value })}
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Selecciona proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>{prov.nombreEmpresa}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formProducto.imagenUrl}
                  onChange={(e) => setFormProducto({ ...formProducto, imagenUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formProducto.descripcion}
                  onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATEGORÍA */}
      {modalCategoria && (
        <div className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setModalCategoria(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-pink-950 mb-4">
              {modoEdicion ? 'Actualizar Categoría' : 'Nueva Categoría'}
            </h3>

            <form onSubmit={guardarCategoria} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={formCategoria.nombre}
                  onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formCategoria.descripcion}
                  onChange={(e) => setFormCategoria({ ...formCategoria, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROVEEDOR */}
      {modalProveedor && (
        <div className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative">
            <button
              onClick={() => setModalProveedor(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-pink-950 mb-4">
              {modoEdicion ? 'Actualizar Proveedor' : 'Nuevo Proveedor'}
            </h3>

            <form onSubmit={guardarProveedor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={formProveedor.nombreEmpresa}
                  onChange={(e) => setFormProveedor({ ...formProveedor, nombreEmpresa: e.target.value })}
                  required
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contacto / Representante</label>
                <input
                  type="text"
                  value={formProveedor.contacto}
                  onChange={(e) => setFormProveedor({ ...formProveedor, contacto: e.target.value })}
                  className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formProveedor.telefono}
                    onChange={(e) => setFormProveedor({ ...formProveedor, telefono: e.target.value })}
                    className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formProveedor.email}
                    onChange={(e) => setFormProveedor({ ...formProveedor, email: e.target.value })}
                    className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Proveedor'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};