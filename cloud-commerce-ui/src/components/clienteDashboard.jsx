import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ClienteDashboard = () => {
    const [productosComprados, setProductosComprados] = useState([]);
    // Obtén el clienteId desde tu estado global o localStorage al iniciar sesión
    const clienteId = localStorage.getItem('clienteId'); 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (clienteId) {
            axios.get(`http://localhost:8080/api/clientes/mis-compras/${clienteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setProductosComprados(res.data))
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
                                    src={prod.urlImagen || 'https://via.placeholder.com/150'} 
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