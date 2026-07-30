import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  DollarSign, ShoppingBag, Package, FolderTree, 
  Users, ShoppingCart, Plus, Trash2, Edit3, User, 
  Mail, Phone, MapPin, X, Truck, Tags, UserPlus, Shield
} from 'lucide-react';

export const AdminDashboard = ({ user }) => {
  const [tabActiva, setTabActiva] = useState('productos');

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [modalProducto, setModalProducto] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false); // Nuevo modal para Admin/Cliente

  const [modoEdicion, setModoEdicion] = useState(false);
  const [editId, setEditId] = useState(null);

  // Formularios
  const [formProducto, setFormProducto] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoriaId: '', proveedorId: ''
  });

  const [formCategoria, setFormCategoria] = useState({ nombre: '', descripcion: '' });
  const [formProveedor, setFormProveedor] = useState({ nombreEmpresa: '', contacto: '', telefono: '', email: '' });

  const [formUsuario, setFormUsuario] = useState({
    nombre: '', username: '', password: '', rol: 'ROLE_ADMIN', direccion: '', telefono: ''
  });

  useEffect(() => { cargarDatos(); }, []);

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

      if (apiService.getClientes) {
        const dataClientes = await apiService.getClientes();
        setClientes(dataClientes || []);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCTOS ---
  const abrirModalCrearProducto = () => {
    setModoEdicion(false);
    setEditId(null);
    setFormProducto({
      nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '',
      categoriaId: categorias[0]?.id || '', proveedorId: proveedores[0]?.id || ''
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
      imagenUrl: formProducto.imagenUrl, // Se guarda correctamente la nueva URL
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

  // --- CATEGORÍAS ---
  const abrirModalCrearCategoria = () => {
    setModoEdicion(false); setEditId(null); setFormCategoria({ nombre: '', descripcion: '' }); setModalCategoria(true);
  };
  const abrirModalEditarCategoria = (cat) => {
    setModoEdicion(true); setEditId(cat.id); setFormCategoria({ nombre: cat.nombre, descripcion: cat.descripcion || '' }); setModalCategoria(true);
  };
  const guardarCategoria = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) await apiService.actualizarCategoria(editId, formCategoria);
      else await apiService.crearCategoria(formCategoria);
      setModalCategoria(false); cargarDatos();
    } catch (error) { alert('Error al guardar categoría: ' + error.message); }
  };
  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try { await apiService.eliminarCategoria(id); cargarDatos(); } catch (error) { alert('Error al eliminar categoría: ' + error.message); }
    }
  };

  // --- PROVEEDORES ---
  const abrirModalCrearProveedor = () => {
    setModoEdicion(false); setEditId(null); setFormProveedor({ nombreEmpresa: '', contacto: '', telefono: '', email: '' }); setModalProveedor(true);
  };
  const abrirModalEditarProveedor = (prov) => {
    setModoEdicion(true); setEditId(prov.id);
    setFormProveedor({ nombreEmpresa: prov.nombreEmpresa, contacto: prov.contacto || '', telefono: prov.telefono || '', email: prov.email || '' });
    setModalProveedor(true);
  };
  const guardarProveedor = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) await apiService.actualizarProveedor(editId, formProveedor);
      else await apiService.crearProveedor(formProveedor);
      setModalProveedor(false); cargarDatos();
    } catch (error) { alert('Error al guardar proveedor: ' + error.message); }
  };
  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
      try { await apiService.eliminarProveedor(id); cargarDatos(); } catch (error) { alert('Error al eliminar proveedor: ' + error.message); }
    }
  };

  // --- CREACIÓN INTERNA DE USUARIOS (ADMIN / CLIENTE) ---
  const guardarUsuario = async (e) => {
    e.preventDefault();
    try {
      await apiService.registro(formUsuario);
      alert('¡Usuario registrado exitosamente!');
      setModalUsuario(false);
      cargarDatos();
    } catch (error) {
      alert('Error al registrar usuario: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-pink-50/20 min-h-screen">
      
      {/* Banner Superior */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-pink-950">Panel de Administración</h1>
          <p className="text-pink-600 text-sm mt-1 font-medium">Supervisa las ventas, gestiona el inventario y administra los usuarios.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalUsuario(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2 rounded-2xl shadow-md font-bold text-sm hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Registrar Usuario / Admin
          </button>
          <button
            onClick={() => setTabActiva('perfil')}
            className="flex items-center gap-2 bg-white border border-pink-200 px-4 py-2 rounded-2xl shadow-sm text-pink-700 font-bold text-sm hover:bg-pink-50 transition-all cursor-pointer"
          >
            <User className="w-4 h-4 text-pink-500" /> Mi Perfil
          </button>
        </div>
      </div>

      {/* Tarjetas Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600"><DollarSign className="w-7 h-7" /></div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Total Recaudado</span>
            <h3 className="text-2xl font-extrabold text-pink-950">$0.00 MXN</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600"><ShoppingBag className="w-7 h-7" /></div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Órdenes Totales</span>
            <h3 className="text-2xl font-extrabold text-pink-950">0 Órdenes</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600"><Package className="w-7 h-7" /></div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Productos Activos</span>
            <h3 className="text-2xl font-extrabold text-pink-950">{productos.length} Artículos</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-2xl text-pink-600"><FolderTree className="w-7 h-7" /></div>
          <div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Categorías</span>
            <h3 className="text-2xl font-extrabold text-pink-950">{categorias.length} Categorías</h3>
          </div>
        </div>
      </div>

      {/* Pestañas de Gestión */}
      <div className="flex border-b border-pink-200 mb-6 gap-2 overflow-x-auto pb-1">
        <button onClick={() => setTabActiva('productos')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer ${tabActiva === 'productos' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' : 'text-gray-600'}`}>
          <Package className="w-4 h-4" /> Productos
        </button>
        <button onClick={() => setTabActiva('categorias')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer ${tabActiva === 'categorias' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' : 'text-gray-600'}`}>
          <Tags className="w-4 h-4" /> Categorías
        </button>
        <button onClick={() => setTabActiva('proveedores')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer ${tabActiva === 'proveedores' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' : 'text-gray-600'}`}>
          <Truck className="w-4 h-4" /> Proveedores
        </button>
        <button onClick={() => setTabActiva('clientes')} className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer ${tabActiva === 'clientes' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' : 'text-gray-600'}`}>
          <Users className="w-4 h-4" /> Clientes
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      {tabActiva === 'productos' && (
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-pink-950">Lista de Productos</h2>
            <button onClick={abrirModalCrearProducto} className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md hover:from-pink-600 hover:to-rose-500 cursor-pointer">
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
                {productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="p-3">
                      <img src={prod.imagenUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300"} alt={prod.nombre} className="w-12 h-12 rounded-xl object-cover border border-pink-100" />
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{prod.nombre}</td>
                    <td className="p-3"><span className="bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full text-xs font-bold">{prod.categoria?.nombre || 'General'}</span></td>
                    <td className="p-3 font-bold text-pink-950">${prod.precio.toFixed(2)} MXN</td>
                    <td className="p-3"><span className={`font-bold ${prod.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{prod.stock}</span></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => abrirModalEditarProducto(prod)} className="p-2 bg-pink-50 text-pink-600 rounded-xl cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => eliminarProducto(prod.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL NUEVO USUARIO (CREACIÓN DE ADMINS / CLIENTES) */}
      {modalUsuario && (
        <div className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 relative">
            <button onClick={() => setModalUsuario(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-600"><X className="w-6 h-6" /></button>
            <h3 className="text-xl font-bold text-pink-950 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-pink-500"/> Registrar Nuevo Usuario</h3>
            <form onSubmit={guardarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rol de Usuario</label>
                <select value={formUsuario.rol} onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })} className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm">
                  <option value="ROLE_ADMIN">Administrador (Jefe)</option>
                  <option value="ROLE_CLIENTE">Cliente (Comprador)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} required className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" value={formUsuario.username} onChange={(e) => setFormUsuario({ ...formUsuario, username: e.target.value })} required className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña</label>
                <input type="password" value={formUsuario.password} onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })} required minLength={6} className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 rounded-2xl shadow-md hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer mt-2">
                Guardar Usuario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO */}
      {modalProducto && (
        <div className="fixed inset-0 bg-pink-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 relative">
            <button onClick={() => setModalProducto(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-600"><X className="w-6 h-6" /></button>
            <h3 className="text-xl font-bold text-pink-950 mb-4">{modoEdicion ? 'Actualizar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                <input type="text" value={formProducto.nombre} onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })} required className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Precio ($ MXN)</label>
                  <input type="number" step="0.01" value={formProducto.precio} onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })} required className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock</label>
                  <input type="number" value={formProducto.stock} onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })} required className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL de Imagen</label>
                <input type="url" value={formProducto.imagenUrl} onChange={(e) => setFormProducto({ ...formProducto, imagenUrl: e.target.value })} placeholder="https://..." className="w-full p-2.5 bg-pink-50/30 border border-pink-200 rounded-2xl text-sm" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 rounded-2xl shadow-md hover:from-pink-600 hover:to-rose-500 transition-all cursor-pointer mt-2">
                {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};