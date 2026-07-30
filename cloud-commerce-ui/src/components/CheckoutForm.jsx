import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';
import { CreditCard, CheckCircle2, ShieldAlert, Loader2, Play } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51TwjoZJVt23ZfDTCDQ8v8mwDT1N8d7umGePH9U4HNi865DPKGI5EPkPOrFy7VsrXwemQlgJCDjL4FEIho9sS66D900VvjbKKnL');

const PaymentForm = ({ venta, onPaymentSuccess, setCurrentTab }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [clientSecret, setClientSecret] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        const getSecret = async () => {
            try {
                const res = await apiService.crearIntencionPago(venta.id);
                if (res && res.clientSecret) {
                    setClientSecret(res.clientSecret);
                }
            } catch (err) {
                console.warn('No se pudo inicializar Stripe. Se usará el simulador de pago.', err);
            }
        };
        if (venta && venta.id) {
            getSecret();
        }
    }, [venta]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            setError('Stripe no está inicializado o la clave es incorrecta. Usa el Simulador de Pago abajo.');
            return;
        }

        setProcesando(true);
        setError('');

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcesando(false);
            } else if (result.paymentIntent.status === 'succeeded') {
                await apiService.confirmarPagoVenta(venta.id);
                onPaymentSuccess();
            }
        } catch (err) {
            setError(err.message || 'Error de conexión durante el pago.');
            setProcesando(false);
        }
    };

    const handleSimulatePayment = async () => {
        setSimulating(true);
        setError('');
        try {
            await apiService.confirmarPagoVenta(venta.id);
            onPaymentSuccess();
        } catch (err) {
            setError('Error al conectar con la API local para simular el pago.');
        } finally {
            setSimulating(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-pink-950/40 text-pink-300 p-4 rounded-xl flex items-start gap-2.5 border border-pink-800/40 text-sm">
                    <ShieldAlert className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                </div>
            )}

            {/* Formulario Stripe */}
            <form onSubmit={handleSubmit} className="bg-[#0d0d18] p-5 rounded-2xl border border-purple-800/30 space-y-4">
                <label className="block text-sm font-semibold text-purple-200">Tarjeta de Crédito o Débito</label>
                <div className="bg-[#13131f] p-4 rounded-xl border border-purple-700/40">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#e4d8f5',
                                '::placeholder': { color: '#7c6a9a' },
                            },
                        }
                    }} />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || procesando || !clientSecret}
                    className="w-full bg-gradient-to-r from-[#a855f7] to-[#f472b6] hover:from-[#7c3aed] hover:to-[#ec4899] text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {procesando ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Procesando pago con Stripe...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" /> Pagar Ahora (${(venta.total || 0).toFixed(2)} MXN)
                        </>
                    )}
                </button>
            </form>

            {/* Separador */}
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-purple-800/30"></div></div>
                <span className="relative bg-[#13131f] px-4 text-xs font-bold text-purple-500 uppercase tracking-widest">O de Respaldo</span>
            </div>

            {/* Simulador */}
            <div className="bg-amber-950/30 rounded-2xl p-5 border border-amber-800/40 space-y-3">
                <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-amber-300">Simulador de Pago de Pruebas</h4>
                        <p className="text-xs text-amber-400 mt-0.5">
                            Si estás usando las claves de Stripe por defecto o si no tienes internet, puedes simular una transacción exitosa para actualizar la base de datos.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={simulating}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-sm"
                >
                    {simulating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Simulando...
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" /> Simular Pago Exitoso (Recomendado para Pruebas)
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export const CheckoutForm = ({ ventaActiva, setCurrentTab }) => {
    const [pagado, setPagado] = useState(false);

    if (!ventaActiva) {
        return (
            <div className="max-w-md mx-auto my-12 bg-[#13131f] rounded-2xl p-8 border border-purple-800/30 text-center shadow-sm">
                <h3 className="font-bold text-lg text-purple-100">No hay ninguna venta activa</h3>
                <p className="text-purple-400 text-sm mt-1">Regresa al catálogo y añade productos para realizar el pago.</p>
                <button
                    onClick={() => setCurrentTab('catalog')}
                    className="mt-4 bg-gradient-to-r from-[#a855f7] to-[#f472b6] text-white px-6 py-2 rounded-xl text-sm font-bold cursor-pointer"
                >
                    Ver Catálogo
                </button>
            </div>
        );
    }

    const handlePaymentSuccess = () => {
        setPagado(true);
    };

    // Respaldo dinámico para leer 'detalleVentas' o 'detalles'
    const listaDetalles = ventaActiva.detalleVentas || ventaActiva.detalles || [];

    if (pagado) {
        return (
            <div className="max-w-md mx-auto my-12 bg-[#13131f] rounded-2xl p-8 border border-purple-800/30 text-center shadow-xl space-y-5">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-purple-100">¡Pago Exitoso!</h2>
                    <p className="text-sm text-purple-400">Tu orden #{ventaActiva.id} ha sido procesada y pagada correctamente.</p>
                </div>
                <div className="bg-[#0d0d18] p-4 rounded-xl text-left text-xs text-purple-300 border border-purple-800/30 space-y-1">
                    <div><span className="font-bold">Total Pagado:</span> ${(ventaActiva.total || 0).toFixed(2)} MXN</div>
                    <div><span className="font-bold">Estado:</span> <span className="text-emerald-400 font-bold">PAGADO</span></div>
                    <div><span className="font-bold">Cliente:</span> {ventaActiva.cliente?.nombre || 'Cliente'}</div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setCurrentTab('purchases')}
                        className="flex-1 bg-gradient-to-r from-[#a855f7] to-[#f472b6] hover:from-[#7c3aed] hover:to-[#ec4899] text-white py-3 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                    >
                        Ver Mis Compras
                    </button>
                    <button
                        onClick={() => setCurrentTab('catalog')}
                        className="flex-1 bg-[#1a1a2e] hover:bg-[#222238] text-purple-100 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                    >
                        Seguir Comprando
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto my-12 bg-[#13131f] rounded-2xl shadow-xl overflow-hidden border border-purple-800/30">
            <div className="bg-gradient-to-r from-[#1a0a2e] to-[#0d0d1a] px-6 py-6 text-white text-center border-b border-purple-800/30">
                <h2 className="text-xl font-bold">Checkout de Venta</h2>
                <p className="text-purple-300 mt-1 text-xs">Completa tu pago seguro para la orden #{ventaActiva.id}</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <h3 className="font-bold text-purple-100 text-sm uppercase tracking-wider">Resumen del Pedido</h3>
                    <div className="bg-purple-950/30 p-4 rounded-xl border border-purple-800/30 text-sm space-y-2">
                        {listaDetalles.map((det, idx) => (
                            <div key={idx} className="flex justify-between text-purple-300 text-xs">
                                <span>
                                    {det.producto?.nombre || `Producto #${det.producto?.id}`} (x{det.cantidad})
                                </span>
                                <span className="font-bold text-purple-100">
                                    ${((det.precioUnitario || det.producto?.precio || 0) * det.cantidad).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-purple-700/40 pt-2 flex justify-between font-extrabold text-[#c084fc] text-sm">
                            <span>Total a Cobrar</span>
                            <span>${(ventaActiva.total || 0).toFixed(2)} MXN</span>
                        </div>
                    </div>
                </div>

                {/* Formulario Stripe Provider */}
                <Elements stripe={stripePromise}>
                    <PaymentForm 
                        venta={ventaActiva} 
                        onPaymentSuccess={handlePaymentSuccess} 
                        setCurrentTab={setCurrentTab} 
                    />
                </Elements>
            </div>
        </div>
    );
};