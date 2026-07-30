import React, { useState, useEffect } from 'react';
import { apiService, API_BASE_URL } from '../services/apiService';
import { 
  DollarSign, ShoppingBag, Package, FolderTree, 
  Users, ShoppingCart, Plus, Trash2, Edit3, User, 
  Mail, Phone, MapPin, ShieldCheck, X, Check, Truck, Tags, UserCog,
  XCircle, RotateCcw, FileText
} from 'lucide-react';

export const AdminDashboard = ({ user }) => {
  // Pestañas principales
  const [tabActiva, setTabActiva] = useState('productos');

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]); 
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [modalProducto, setModalProducto] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalUsuario, setModalUsuario] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [editId, setEditId] = useState(null);

  // Mensajes de la sección de Gestión de Usuarios
  const [usuarioError, setUsuarioError] = useState('');
  const [usuarioExito, setUsuarioExito] = useState('');

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

  // Formulario Cliente (edición desde el panel de Admin)
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: ''
  });

  // Formulario de creación de Usuario (Admin o Cliente con login)
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    username: '',
    password: '',
    direccion: '',
    telefono: '',
    rol: 'ROLE_CLIENTE'
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

    if (apiService.getClientes) {
      const dataClientes = await apiService.getClientes();
      setClientes(dataClientes || []);
    }

    // --- CARGA DE VENTAS (para el panel de ventas) ---
    try {
      if (apiService.getSales) {
        const dataVentas = await apiService.getSales();
        setVentas(Array.isArray(dataVentas) ? dataVentas : []);
      }
    } catch (errorVentas) {
      console.error("Error al cargar ventas:", errorVentas.message);
    }

    // --- CARGA AISLADA DE USUARIOS ---
    try {
      if (apiService.getUsuarios) {
        const dataUsuarios = await apiService.getUsuarios();
        console.log("Usuarios recibidos del Backend:", dataUsuarios); // Para depuración
        setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
      }
    } catch (errorUsuarios) {
      console.error("Error específico al cargar usuarios:", errorUsuarios.message);
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
      categoriaId: '',
      proveedorId: ''
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
      imagenUrl: prod.imagenUrl || prod.imagenurl || '',
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
      imagenurl: formProducto.imagenUrl,
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

  // --- LÓGICA DE CLIENTES (editar / eliminar desde el panel de Admin) ---
  const abrirModalEditarCliente = (cli) => {
    setModoEdicion(true);
    setEditId(cli.id);
    setFormCliente({
      nombre: cli.nombre || '',
      email: cli.email || cli.username || '',
      direccion: cli.direccion || '',
      telefono: cli.telefono || ''
    });
    setModalCliente(true);
  };

  const guardarCliente = async (e) => {
    e.preventDefault();
    try {
      await apiService.actualizarClientes(editId, formCliente);
      setModalCliente(false);
      cargarDatos();
    } catch (error) {
      alert('Error al actualizar cliente: ' + error.message);
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
      try {
        await apiService.eliminarClientes(id);
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar cliente: ' + error.message);
      }
    }
  };

  // --- LÓGICA DE GESTIÓN DE USUARIOS (crear Admin o Cliente con login) ---
  const abrirModalCrearUsuario = () => {
    setFormUsuario({
      nombre: '',
      username: '',
      password: '',
      direccion: '',
      telefono: '',
      rol: 'ROLE_CLIENTE'
    });
    setUsuarioError('');
    setUsuarioExito('');
    setModalUsuario(true);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setUsuarioError('');
    setUsuarioExito('');
    try {
      await apiService.crearUsuario(formUsuario);
      setUsuarioExito(
        formUsuario.rol === 'ROLE_ADMIN'
          ? 'Administrador creado con éxito.'
          : 'Cliente creado con éxito.'
      );
      cargarDatos();
      setTimeout(() => {
        setModalUsuario(false);
      }, 1200);
    } catch (error) {
      setUsuarioError(error.message || 'Error al crear el usuario.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-100 font-mono">Panel de Administración</h1>
          <p className="text-purple-400 text-sm mt-1 font-medium">
            Supervisa las ventas, gestiona el inventario y administra la plataforma.
          </p>
        </div>
        <button
          onClick={() => setTabActiva('perfil')}
          className="flex items-center gap-2 bg-[#13131f] border border-purple-700/40 px-4 py-2 rounded-2xl shadow-sm text-purple-300 font-bold text-sm hover:bg-[#1c1c30] transition-all cursor-pointer w-fit"
        >
          <User className="w-4 h-4 text-purple-400" />
          Mi Perfil ({user?.nombre || 'Admin'})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-[#13131f]/80 backdrop-blur-sm p-5 rounded-3xl border border-purple-800/30 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-900/40 rounded-2xl text-purple-400">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Recaudado</span>
            <h3 className="text-2xl font-extrabold text-purple-100">$0.00 MXN</h3>
            <span className="text-[11px] text-purple-500">Transacciones Pagadas</span>
          </div>
        </div>

        <div className="bg-[#13131f]/80 backdrop-blur-sm p-5 rounded-3xl border border-purple-800/30 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-900/40 rounded-2xl text-purple-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Órdenes Totales</span>
            <h3 className="text-2xl font-extrabold text-purple-100">0 Órdenes</h3>
            <span className="text-[11px] text-purple-500">Historial completo</span>
          </div>
        </div>

        <div className="bg-[#13131f]/80 backdrop-blur-sm p-5 rounded-3xl border border-purple-800/30 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-900/40 rounded-2xl text-purple-400">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Productos Activos</span>
            <h3 className="text-2xl font-extrabold text-purple-100">{productos.length} Artículos</h3>
            <span className="text-[11px] text-purple-500">En inventario</span>
          </div>
        </div>

        <div className="bg-[#13131f]/80 backdrop-blur-sm p-5 rounded-3xl border border-purple-800/30 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-900/40 rounded-2xl text-purple-400">
            <FolderTree className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Categorías</span>
            <h3 className="text-2xl font-extrabold text-purple-100">{categorias.length} Categorías</h3>
            <span className="text-[11px] text-purple-500">Clasificaciones</span>
          </div>
        </div>

      </div>

      <div className="flex border-b border-purple-800/30 mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setTabActiva('productos')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'productos'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <Package className="w-4 h-4" /> Gestión de Productos
        </button>

        <button
          onClick={() => setTabActiva('categorias')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'categorias'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <Tags className="w-4 h-4" /> Gestión de Categorías
        </button>

        <button
          onClick={() => setTabActiva('proveedores')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'proveedores'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <Truck className="w-4 h-4" /> Gestión de Proveedores
        </button>

        <button
          onClick={() => setTabActiva('ventas')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'ventas'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> Registro de Ventas
        </button>

        <button
          onClick={() => setTabActiva('clientes')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'clientes'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <Users className="w-4 h-4" /> Gestión de Clientes
        </button>

        <button
          onClick={() => setTabActiva('usuarios')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            tabActiva === 'usuarios'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white shadow-md shadow-purple-900/30'
              : 'text-purple-400 hover:bg-purple-900/30 hover:text-purple-300'
          }`}
        >
          <UserCog className="w-4 h-4" /> Gestión de Usuarios
        </button>
      </div>

      {/* VISTA: GESTIÓN DE PRODUCTOS */}
      {tabActiva === 'productos' && (
        <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-100">Lista de Productos</h2>
            <button
              onClick={abrirModalCrearProducto}
              className="bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Agregar Producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-300">
              <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Imagen</th>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Precio</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/20">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-purple-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-purple-900/20 transition-colors">
                      <td className="p-3">
                        <img
                          src={prod.imagenUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300"}
                          alt={prod.nombre}
                          className="w-12 h-12 rounded-xl object-cover border border-purple-800/30"
                        />
                      </td>
                      <td className="p-3 font-semibold text-purple-100">{prod.nombre}</td>
                      <td className="p-3">
                        <span className="bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-full text-xs font-bold">
                          {prod.categoria?.nombre || 'General'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#c084fc]">${prod.precio.toFixed(2)} MXN</td>
                      <td className="p-3">
                        <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-400' : 'text-pink-400'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarProducto(prod)}
                            className="p-2 bg-purple-900/40 hover:bg-purple-800/50 text-purple-400 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod.id)}
                            className="p-2 bg-pink-950/40 hover:bg-pink-900/50 text-pink-400 rounded-xl transition-colors cursor-pointer"
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
        <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-100">Lista de Categorías</h2>
            <button
              onClick={abrirModalCrearCategoria}
              className="bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nueva Categoría
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-300">
              <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">ID</th>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Descripción</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/20">
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-purple-500">
                      No hay categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="hover:bg-purple-900/20 transition-colors">
                      <td className="p-3 font-bold text-purple-200">#{cat.id}</td>
                      <td className="p-3 font-semibold text-purple-100">{cat.nombre}</td>
                      <td className="p-3 text-purple-400">{cat.descripcion || 'Sin descripción'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarCategoria(cat)}
                            className="p-2 bg-purple-900/40 hover:bg-purple-800/50 text-purple-400 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarCategoria(cat.id)}
                            className="p-2 bg-pink-950/40 hover:bg-pink-900/50 text-pink-400 rounded-xl transition-colors cursor-pointer"
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
        <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-100">Lista de Proveedores</h2>
            <button
              onClick={abrirModalCrearProveedor}
              className="bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Nuevo Proveedor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-300">
              <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Empresa</th>
                  <th className="p-3.5">Contacto</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/20">
                {proveedores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-purple-500">
                      No hay proveedores registrados.
                    </td>
                  </tr>
                ) : (
                  proveedores.map((prov) => (
                    <tr key={prov.id} className="hover:bg-purple-900/20 transition-colors">
                      <td className="p-3 font-semibold text-purple-100">{prov.nombreEmpresa}</td>
                      <td className="p-3 text-purple-300">{prov.contacto || 'N/A'}</td>
                      <td className="p-3 font-medium text-[#c084fc]">{prov.telefono || 'N/A'}</td>
                      <td className="p-3 text-purple-300">{prov.email || 'N/A'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarProveedor(prov)}
                            className="p-2 bg-purple-900/40 hover:bg-purple-800/50 text-purple-400 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProveedor(prov.id)}
                            className="p-2 bg-pink-950/40 hover:bg-pink-900/50 text-pink-400 rounded-xl transition-colors cursor-pointer"
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
        <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-100">Historial de Ventas</h2>
            <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
              Total: {ventas.length} ventas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-300">
              <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
                <tr>
                  <th className="p-3.5 rounded-l-2xl"># Orden</th>
                  <th className="p-3.5">Fecha</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/20">
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-purple-500">
                      No hay ventas registradas en la plataforma.
                    </td>
                  </tr>
                ) : (
                  ventas.map((v) => {
                    const getEstadoColor = (estado) => {
                      switch(estado) {
                        case 'PENDIENTE': return 'text-amber-300 bg-amber-950/40 border border-amber-800/40';
                        case 'PAGADO': return 'text-emerald-300 bg-emerald-950/40 border border-emerald-800/40';
                        case 'CANCELADO': return 'text-pink-300 bg-pink-950/40 border border-pink-800/40';
                        case 'REEMBOLSADO': return 'text-purple-300 bg-purple-950/40 border border-purple-800/40';
                        default: return 'text-gray-300 bg-gray-800';
                      }
                    };
                    return (
                      <tr key={v.id} className="hover:bg-purple-900/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-purple-200">#{v.id}</td>
                        <td className="p-3 text-purple-300">{v.fecha || 'N/A'}</td>
                        <td className="p-3 font-semibold text-purple-100">{v.cliente?.nombre || 'N/A'}</td>
                        <td className="p-3 font-bold text-[#c084fc]">${v.total?.toFixed(2)} MXN</td>
                        <td className="p-3">
                          <span className={"inline-block px-2.5 py-1 rounded-full text-xs font-bold " + getEstadoColor(v.estadoPago)}>
                            {v.estadoPago || 'SIN ESTADO'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {v.estadoPago === 'PENDIENTE' && (
                              <button
                                onClick={async () => {
                                  if(window.confirm('¿Cancelar esta venta #' + v.id + '?')) {
                                    try {
                                      await apiService.cancelarVenta(v.id);
                                      cargarDatos();
                                    } catch(e) { alert('Error: ' + e.message); }
                                  }
                                }}
                                className="p-2 bg-pink-950/40 hover:bg-pink-900/50 text-pink-400 rounded-xl transition-colors cursor-pointer"
                                title="Cancelar venta"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            {v.estadoPago === 'PAGADO' && (
                              <button
                                onClick={async () => {
                                  if(window.confirm('¿Reembolsar esta venta #' + v.id + '?')) {
                                    try {
                                      await apiService.reembolsarVenta(v.id);
                                      cargarDatos();
                                    } catch(e) { alert('Error: ' + e.message); }
                                  }
                                }}
                                className="p-2 bg-amber-950/40 hover:bg-amber-900/50 text-amber-400 rounded-xl transition-colors cursor-pointer"
                                title="Reembolsar venta"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const token = localStorage.getItem('token');
                                const url = API_BASE_URL + 'ventas/' + v.id + '/ticket';
                                const w = window.open('', '_blank');
                                if(w) {
                                  fetch(url, { headers: { 'Authorization': 'Bearer ' + token } })
                                    .then(r => r.text())
                                    .then(h => { w.document.write(h); w.document.close(); w.focus(); })
                                    .catch(() => w.close());
                                }
                              }}
                              className="p-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 rounded-xl transition-colors cursor-pointer"
                              title="Ver ticket"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA: GESTIÓN DE CLIENTES */}
      {tabActiva === 'clientes' && (
        <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-purple-100">Clientes Registrados</h2>
            <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
              Total: {clientes.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-purple-300">
              <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
                <tr>
                  <th className="p-3.5 rounded-l-2xl">Nombre</th>
                  <th className="p-3.5">Correo</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Dirección</th>
                  <th className="p-3.5 text-right rounded-r-2xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/20">
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-purple-500">
                      No hay clientes registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  clientes.map((c, index) => (
                    <tr key={c.id || index} className="hover:bg-purple-900/20 transition-colors">
                      <td className="p-3 font-semibold text-purple-100">{c.nombre || 'Sin nombre'}</td>
                      <td className="p-3 text-[#c084fc] font-medium">{c.username || c.email}</td>
                      <td className="p-3 text-purple-300">{c.telefono || 'N/A'}</td>
                      <td className="p-3 text-purple-300">{c.direccion || 'N/A'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEditarCliente(c)}
                            className="p-2 bg-purple-900/40 hover:bg-purple-800/50 text-purple-400 rounded-xl transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarCliente(c.id)}
                            className="p-2 bg-pink-950/40 hover:bg-pink-900/50 text-pink-400 rounded-xl transition-colors cursor-pointer"
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

      {/* VISTA: GESTIÓN DE USUARIOS */}
{tabActiva === 'usuarios' && (
  <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-6 shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-bold text-purple-100">Gestión de Usuarios</h2>
        <p className="text-purple-400 text-sm mt-1">
          Registra nuevos administradores o clientes con acceso al sistema.
        </p>
      </div>
      <button
        onClick={abrirModalCrearUsuario}
        className="bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Nuevo Usuario
      </button>
    </div>

    <div className="bg-purple-950/30 border border-purple-800/30 rounded-2xl p-5 flex items-start gap-3 mb-6">
      <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-purple-300">
        Esta sección es exclusiva del panel de Administración. Aquí puedes crear otros
        administradores o clientes de forma manual. El registro público (pantalla de
        "Registrarse") siempre crea cuentas de Cliente únicamente.
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-purple-300">
        <thead className="bg-purple-950/50 text-purple-200 font-bold text-xs uppercase border-b border-purple-800/30">
          <tr>
            <th className="p-3.5 rounded-l-2xl">Nombre</th>
            <th className="p-3.5">Correo</th>
            <th className="p-3.5">Teléfono</th>
            <th className="p-3.5">Dirección</th>
            <th className="p-3.5 rounded-r-2xl">Rol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-800/20">
          {(!Array.isArray(usuarios) || usuarios.length === 0) ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-purple-500 font-medium">
                No hay usuarios para mostrar.
              </td>
            </tr>
          ) : (
            usuarios.map((u, index) => {
              const nombreUsr = u?.nombre || 'Sin nombre';
              const correoUsr = u?.username || u?.email || 'Sin correo';
              const telUsr = u?.telefono || 'N/A';
              const dirUsr = u?.direccion || 'N/A';
              const rolTexto = u?.rol || u?.role || 'ROLE_CLIENTE';
              const esAdmin = String(rolTexto).toUpperCase().includes('ADMIN');

              return (
                <tr key={u?.id || index} className="hover:bg-purple-900/20 transition-colors">
                  <td className="p-3 font-semibold text-purple-100">{nombreUsr}</td>
                  <td className="p-3 text-[#c084fc] font-medium">{correoUsr}</td>
                  <td className="p-3 text-purple-300">{telUsr}</td>
                  <td className="p-3 text-purple-300">{dirUsr}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                        esAdmin
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-700/40'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      }`}
                    >
                      {esAdmin ? 'Administrador' : 'Cliente'}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* VISTA: PERFIL DEL USUARIO */}
      {tabActiva === 'perfil' && (
        <div className="bg-[#13131f]/90 backdrop-blur-sm rounded-3xl border border-purple-800/30 p-8 shadow-sm max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#a855f7] to-[#f472b6] rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-900/30 mb-3">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-purple-100">{user?.nombre || 'Administrador'}</h2>
            <span className="bg-purple-900/50 text-purple-300 font-bold text-xs px-3 py-1 rounded-full uppercase mt-1 inline-block border border-purple-700/40">
              {user?.rol || 'ROLE_ADMIN'}
            </span>
          </div>

          <div className="space-y-4 border-t border-purple-800/30 pt-6">
            <div className="flex items-center gap-3 p-3 bg-purple-950/30 rounded-2xl border border-purple-800/30">
              <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-xs text-purple-500 font-semibold block">Correo Electrónico</span>
                <span className="text-sm font-bold text-purple-100">{user?.username || 'admin@mercadito.com'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-950/30 rounded-2xl border border-purple-800/30">
              <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-xs text-purple-500 font-semibold block">Teléfono</span>
                <span className="text-sm font-bold text-purple-100">{user?.telefono || 'No registrado'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-950/30 rounded-2xl border border-purple-800/30">
              <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-xs text-purple-500 font-semibold block">Dirección</span>
                <span className="text-sm font-bold text-purple-100">{user?.direccion || 'Oficina Principal'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      {/* MODAL PRODUCTO */}
      {modalProducto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#13131f] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-800/30 relative">
            <button
              onClick={() => setModalProducto(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-purple-100 mb-4">
              {modoEdicion ? 'Actualizar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formProducto.nombre}
                  onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Precio ($ MXN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formProducto.precio}
                    onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
                    required
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formProducto.stock}
                    onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })}
                    required
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Categoría</label>
                <select
                  value={formProducto.categoriaId}
                  onChange={(e) => setFormProducto({ ...formProducto, categoriaId: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                >
                  <option value="" className="bg-[#13131f]">Selecciona categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#13131f]">{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Proveedor</label>
                <select
                  value={formProducto.proveedorId}
                  onChange={(e) => setFormProducto({ ...formProducto, proveedorId: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                >
                  <option value="" className="bg-[#13131f]">Selecciona proveedor</option>
                  {proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id} className="bg-[#13131f]">{prov.nombreEmpresa}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formProducto.imagenUrl}
                  onChange={(e) => setFormProducto({ ...formProducto, imagenUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Descripción</label>
                <textarea
                  value={formProducto.descripcion}
                  onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATEGORÍA */}
      {modalCategoria && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#13131f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-800/30 relative">
            <button
              onClick={() => setModalCategoria(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-purple-100 mb-4">
              {modoEdicion ? 'Actualizar Categoría' : 'Nueva Categoría'}
            </h3>

            <form onSubmit={guardarCategoria} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  value={formCategoria.nombre}
                  onChange={(e) => setFormCategoria({ ...formCategoria, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Descripción</label>
                <textarea
                  value={formCategoria.descripcion}
                  onChange={(e) => setFormCategoria({ ...formCategoria, descripcion: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROVEEDOR */}
      {modalProveedor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#13131f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-800/30 relative">
            <button
              onClick={() => setModalProveedor(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-purple-100 mb-4">
              {modoEdicion ? 'Actualizar Proveedor' : 'Nuevo Proveedor'}
            </h3>

            <form onSubmit={guardarProveedor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  value={formProveedor.nombreEmpresa}
                  onChange={(e) => setFormProveedor({ ...formProveedor, nombreEmpresa: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Contacto / Representante</label>
                <input
                  type="text"
                  value={formProveedor.contacto}
                  onChange={(e) => setFormProveedor({ ...formProveedor, contacto: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formProveedor.telefono}
                    onChange={(e) => setFormProveedor({ ...formProveedor, telefono: e.target.value })}
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Email</label>
                  <input
                    type="email"
                    value={formProveedor.email}
                    onChange={(e) => setFormProveedor({ ...formProveedor, email: e.target.value })}
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] transition-all cursor-pointer mt-2"
              >
                {modoEdicion ? 'Guardar Cambios' : 'Crear Proveedor'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CLIENTE (Editar) */}
      {modalCliente && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#13131f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-800/30 relative">
            <button
              onClick={() => setModalCliente(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-purple-100 mb-4">Actualizar Cliente</h3>

            <form onSubmit={guardarCliente} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formCliente.nombre}
                  onChange={(e) => setFormCliente({ ...formCliente, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Correo</label>
                <input
                  type="email"
                  value={formCliente.email}
                  onChange={(e) => setFormCliente({ ...formCliente, email: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formCliente.telefono}
                  onChange={(e) => setFormCliente({ ...formCliente, telefono: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formCliente.direccion}
                  onChange={(e) => setFormCliente({ ...formCliente, direccion: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] transition-all cursor-pointer mt-2"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USUARIO (Crear Admin o Cliente con login) */}
      {modalUsuario && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#13131f] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-800/30 relative">
            <button
              onClick={() => setModalUsuario(false)}
              className="absolute top-4 right-4 text-purple-500 hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-purple-100 mb-4">Nuevo Usuario</h3>

            {usuarioError && (
              <div className="bg-pink-950/40 text-pink-300 p-3 rounded-xl text-xs border border-pink-800/40 mb-4">
                {usuarioError}
              </div>
            )}
            {usuarioExito && (
              <div className="bg-emerald-950/40 text-emerald-300 p-3 rounded-xl text-xs border border-emerald-800/40 mb-4">
                {usuarioExito}
              </div>
            )}

            <form onSubmit={guardarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Tipo de Usuario</label>
                <select
                  value={formUsuario.rol}
                  onChange={(e) => setFormUsuario({ ...formUsuario, rol: e.target.value })}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                >
                  <option value="ROLE_CLIENTE" className="bg-[#13131f]">Cliente</option>
                  <option value="ROLE_ADMIN" className="bg-[#13131f]">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={formUsuario.nombre}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Correo (username)</label>
                <input
                  type="email"
                  value={formUsuario.username}
                  onChange={(e) => setFormUsuario({ ...formUsuario, username: e.target.value })}
                  required
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formUsuario.password}
                  onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formUsuario.telefono}
                    onChange={(e) => setFormUsuario({ ...formUsuario, telefono: e.target.value })}
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formUsuario.direccion}
                    onChange={(e) => setFormUsuario({ ...formUsuario, direccion: e.target.value })}
                    className="w-full p-2.5 bg-purple-950/30 border border-purple-700/40 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100 placeholder-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-900/30 hover:from-[#7c3aed] hover:to-[#ec4899] transition-all cursor-pointer mt-2"
              >
                Crear Usuario
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};