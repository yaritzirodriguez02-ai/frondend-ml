import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

export const ClienteDashboard = () => {
    const [productosComprados, setProductosComprados] = useState([]);
    // Obtén el clienteId desde tu estado global o localStorage al iniciar sesión
    const clienteId = localStorage.getItem('clienteId'); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (clienteId) {
            // Se utiliza fetch nativo con la URL pública de Coolify
            fetch(`http://mercaditoa.2.24.105.6.sslip.io/api/v1/clientes/mis-compras/${clienteId}`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener las compras");
                return res.json();
            })
            .then(data => setProductosComprados(data))
            .catch(err => console.error("Error al cargar compras:", err));
        }
    }, [clienteId, token]);

    return (
        <div className="container mt-4">
            <h2>Mis Productos Comprados</h2>
            <div className="row mt-3">
                {productosComprados.length === 0 ? (
                    <p>Aún no has realizado ninguna compra.</p>
                ) : (
                    productosComprados.map(prod => (
                        <div key={prod.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img 
                                    src={prod.imagenurl || prod.imagen_url || prod.urlImagen || 'https://via.placeholder.com/150'} 
                                    className="card-img-top" 
                                    alt={prod.nombre} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{prod.nombre}</h5>
                                    <p className="card-text">Precio: ${prod.precio}</p>
                                    <span className="badge bg-secondary">
                                        Proveedor: {prod.proveedor ? prod.proveedor.nombre : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};