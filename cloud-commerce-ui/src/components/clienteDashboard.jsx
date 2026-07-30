import React, { useEffect, useState } from 'react';
import { apiService, API_BASE_URL } from '../services/apiService';
import { ShoppingBag, CreditCard, XCircle, RotateCcw, FileText, AlertCircle, CheckCircle2, Clock, Loader2, Download } from 'lucide-react';

export const ClienteDashboard = ({ setVistaActual, setVentaActiva, user }) => {

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accionId, setAccionId] = useState(null);

    const cargarVentas = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiService.getMyPurchases();
            setVentas(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Error al cargar tus compras: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    const handleContinuarPago = (venta) => {
        setVentaActiva(venta);
        setVistaActual('checkout');
    };

    const handleCancelar = async (idVenta) => {
        if (!window.confirm('¿Estás seguro de cancelar esta compra? Se restaurará el inventario.')) return;
        setAccionId('cancel-' + idVenta);
        try {
            await apiService.cancelarVenta(idVenta);
            cargarVentas();
        } catch (err) {
            alert('Error al cancelar: ' + err.message);
        } finally {
            setAccionId(null);
        }
    };

    const handleReembolsar = async (idVenta) => {
        if (!window.confirm('¿Estás seguro de solicitar el reembolso de esta compra?')) return;
        setAccionId('refund-' + idVenta);
        try {
            await apiService.reembolsarVenta(idVenta);
            cargarVentas();
        } catch (err) {
            alert('Error al reembolsar: ' + err.message);
        } finally {
            setAccionId(null);
        }
    };

    const handleDescargarTicket = (idVenta) => {
        const token = localStorage.getItem('token');
        const url = API_BASE_URL + 'ventas/' + idVenta + '/ticket';
        const ventana = window.open('', '_blank');
        if (ventana) {
            fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.text())
            .then(html => {
                ventana.document.write(html);
                ventana.document.close();
                ventana.focus();
                setTimeout(() => ventana.print(), 500);
            })
            .catch(() => {
                alert('Error al generar el ticket');
                ventana.close();
            });
        }
    };

    const getStatusBadge = (estado) => {
        switch (estado) {
            case 'PENDIENTE':
                return <span className="inline-flex items-center gap-1.5 bg-amber-950/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-800/40"><Clock className="w-3 h-3" /> Pendiente</span>;
            case 'PAGADO':
                return <span className="inline-flex items-center gap-1.5 bg-emerald-950/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-800/40"><CheckCircle2 className="w-3 h-3" /> Pagado</span>;
            case 'CANCELADO':
                return <span className="inline-flex items-center gap-1.5 bg-pink-950/40 text-pink-300 px-3 py-1 rounded-full text-xs font-bold border border-pink-800/40"><XCircle className="w-3 h-3" /> Cancelado</span>;
            case 'REEMBOLSADO':
                return <span className="inline-flex items-center gap-1.5 bg-purple-950/40 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-800/40"><RotateCcw className="w-3 h-3" /> Reembolsado</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">{estado}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-3" />
                <p className="text-purple-400 font-medium">Cargando tus compras...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            
            <div className="bg-gradient-to-r from-[#1a0a2e] via-[#2d0a3e] to-[#0d0d1a] rounded-3xl p-8 mb-8 text-white shadow-lg shadow-purple-900/30 border border-purple-800/30">
                <h2 className="text-3xl font-extrabold font-mono tracking-tight">Mis Compras</h2>
                <p className="text-purple-300 text-sm mt-1">Historial completo de tus compras en Mercadito Libre</p>
            </div>

            {error && (
                <div className="bg-pink-950/40 text-pink-300 p-4 rounded-2xl flex items-start gap-2.5 border border-pink-800/40 text-sm mb-6">
                    <AlertCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {ventas.length === 0 ? (
                <div className="bg-[#13131f] rounded-3xl border border-purple-800/30 p-16 text-center shadow-sm">
                    <ShoppingBag className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-bold text-xl text-purple-100">No tienes compras aún</h3>
                    <p className="text-purple-400 text-sm mt-2 max-w-md mx-auto">
                        Explora el catálogo y encuentra los mejores productos para empezar a comprar.
                    </p>
                    <button
                        onClick={() => setVistaActual('catalogo')}
                        className="mt-6 bg-gradient-to-r from-[#a855f7] to-[#f472b6] hover:from-[#7c3aed] hover:to-[#ec4899] text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md shadow-purple-900/30 cursor-pointer"
                    >
                        Ir al Catálogo
                    </button>
                </div>
            ) : (
                <div className="space-y-5">
                    {ventas.map((venta) => (
                        <div key={venta.id} className="bg-[#13131f] rounded-3xl border border-purple-800/30 shadow-sm overflow-hidden hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300">
                            
                            <div className="px-6 py-4 bg-[#0d0d18] border-b border-purple-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-900/40 rounded-xl">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <span className="text-purple-200 font-bold font-mono text-sm">Orden #{venta.id}</span>
                                        <p className="text-purple-500 text-xs">{venta.fecha || 'Fecha no disponible'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusBadge(venta.estadoPago)}
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                <div className="space-y-3">
                                    {venta.detalleVentas && venta.detalleVentas.length > 0 ? (
                                        venta.detalleVentas.map((det, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-[#0d0d18] rounded-2xl border border-purple-800/20">
                                                {det.producto?.imagenUrl ? (
                                                    <img 
                                                        src={det.producto.imagenUrl} 
                                                        alt={det.producto.nombre}
                                                        className="w-14 h-14 object-cover rounded-xl border border-purple-800/30"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-purple-900/40 rounded-xl flex items-center justify-center">
                                                        <ShoppingBag className="w-6 h-6 text-purple-500" />
                                                    </div>
                                                )}
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-bold text-sm text-purple-100 truncate">{det.producto?.nombre || 'Producto'}</h4>
                                                    <p className="text-xs text-purple-400">Cant: {det.cantidad} x ${det.precioUnitario?.toFixed(2)}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="font-bold text-sm text-[#c084fc]">${det.subtotal?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-purple-400 text-sm text-center py-4">Sin detalles disponibles</p>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-[#0d0d18] border-t border-purple-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-purple-400 font-medium">Total:</span>
                                    <span className="font-extrabold text-lg text-[#c084fc]">${venta.total?.toFixed(2)} MXN</span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {venta.estadoPago === 'PENDIENTE' && (
                                        <>
                                            <button
                                                onClick={() => handleContinuarPago(venta)}
                                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#a855f7] to-[#f472b6] hover:from-[#7c3aed] hover:to-[#ec4899] text-white px-4 py-2 rounded-2xl font-bold text-xs transition-all shadow-md shadow-purple-900/30 cursor-pointer"
                                            >
                                                <CreditCard className="w-3.5 h-3.5" /> Continuar Pago
                                            </button>
                                            <button
                                                onClick={() => handleCancelar(venta.id)}
                                                disabled={accionId === 'cancel-' + venta.id}
                                                className="inline-flex items-center gap-1.5 bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 px-4 py-2 rounded-2xl font-bold text-xs transition-all border border-pink-800/40 cursor-pointer disabled:opacity-50"
                                            >
                                                {accionId === 'cancel-' + venta.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <XCircle className="w-3.5 h-3.5" />
                                                )} Cancelar
                                            </button>
                                        </>
                                    )}
                                    {venta.estadoPago === 'PAGADO' && (
                                        <>
                                            <button
                                                onClick={() => handleDescargarTicket(venta.id)}
                                                className="inline-flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 px-4 py-2 rounded-2xl font-bold text-xs transition-all border border-emerald-800/40 cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Ticket PDF
                                            </button>
                                            <button
                                                onClick={() => handleReembolsar(venta.id)}
                                                disabled={accionId === 'refund-' + venta.id}
                                                className="inline-flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 px-4 py-2 rounded-2xl font-bold text-xs transition-all border border-amber-800/40 cursor-pointer disabled:opacity-50"
                                            >
                                                {accionId === 'refund-' + venta.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                )} Reembolsar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};