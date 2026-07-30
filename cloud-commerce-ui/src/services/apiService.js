const API_URL = import.meta.env.DEV ? "http://localhost:8080/api/v1/" : "http://mercaditoa.2.24.105.6.sslip.io/api/v1/";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errortext = await response.text();
        throw new Error(errortext || "Error en la red");
    }
    if (response.status === 204) return null;
    return await response.json();
};

export const apiService = {
    isAuthenticated: () => !!localStorage.getItem('token'),
    getUserRole: () => localStorage.getItem('rol'),
    getUsername: () => localStorage.getItem('nombre') || localStorage.getItem('username'),

    registro: async (userData) => {
        const response = await fetch(API_URL + 'auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return await handleResponse(response);
    },

    login: async (username, password) => {
        const response = await fetch(API_URL + 'auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await handleResponse(response);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('rol', data.rol);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('nombre');
        localStorage.removeItem('rol');
    },

    // PRODUCTOS
    getProductos: async () => {
        const response = await fetch(API_URL + 'productos/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getProducto: async (id) => {
        const response = await fetch(API_URL + 'productos/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearProducto: async (producto) => {
        const response = await fetch(API_URL + 'productos', {
            method: 'POST',
            body: JSON.stringify(producto),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    actualizarProducto: async (id, producto) => {
        const response = await fetch(API_URL + 'productos/' + id, {
            method: 'PUT',
            body: JSON.stringify(producto),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    eliminarProducto: async (id) => {
        const response = await fetch(API_URL + 'productos/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // CATEGORÍAS
    getCategorias: async () => {
        const response = await fetch(API_URL + 'categorias/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getCategoria: async (id) => {
        const response = await fetch(API_URL + 'categorias/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearCategoria: async (categoria) => {
        const response = await fetch(API_URL + 'categorias', {
            method: 'POST',
            body: JSON.stringify(categoria),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(API_URL + 'categorias/' + id, {
            method: 'PUT',
            body: JSON.stringify(categoria),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    eliminarCategoria: async (id) => {
        const response = await fetch(API_URL + 'categorias/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // CLIENTES
    getClientes: async () => {
        const response = await fetch(API_URL + 'clientes/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getCliente: async (id) => {
        const response = await fetch(API_URL + 'clientes/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearCliente: async (cliente) => {
        const response = await fetch(API_URL + 'clientes', {
            method: 'POST',
            body: JSON.stringify(cliente),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    actualizarCliente: async (id, cliente) => {
        const response = await fetch(API_URL + 'clientes/' + id, {
            method: 'PUT',
            body: JSON.stringify(cliente),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    eliminarCliente: async (id) => {
        const response = await fetch(API_URL + 'clientes/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // PROVEEDORES
    getProveedores: async () => {
        const response = await fetch(API_URL + 'proveedores/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getProveedor: async (id) => {
        const response = await fetch(API_URL + 'proveedores/' + id, { headers: getHeaders() });
        return await handleResponse(response);
    },
    crearProveedor: async (proveedor) => {
        const response = await fetch(API_URL + 'proveedores', {
            method: 'POST',
            body: JSON.stringify(proveedor),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(API_URL + 'proveedores/' + id, {
            method: 'PUT',
            body: JSON.stringify(proveedor),
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    eliminarProveedor: async (id) => {
        const response = await fetch(API_URL + 'proveedores/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },

    // VENTAS Y PAGOS
    procesarVenta: async (venta) => {
        const response = await fetch(API_URL + 'ventas', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        return await handleResponse(response);
    },
    getVentas: async () => {
        const response = await fetch(API_URL + 'ventas/', { headers: getHeaders() });
        return await handleResponse(response);
    },
    getMyPurchases: async () => {
        const response = await fetch(API_URL + 'ventas/mis-compras', { headers: getHeaders() });
        return await handleResponse(response);
    },
    eliminarVentas: async (id) => {
        const response = await fetch(API_URL + 'ventas/' + id, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response);
    },
    crearIntencionPago: async (idVenta) => {
        const response = await fetch(API_URL + "pagos/crear-intencion", {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ idVenta, moneda: 'mxn' }),
        });
        return await handleResponse(response);
    },
    confirmarPagoVenta: async (idVenta) => {
        const response = await fetch(API_URL + "pagos/confirmar-pago/" + idVenta, {
            method: 'POST',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    }
};