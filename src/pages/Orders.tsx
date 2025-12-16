import React from "react";
import styles from "./Orders.module.css";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../types/BusinessContext";
import { getOrders } from "../hooks/getOrders";
import { getProductDetails } from "../hooks/getProductDetails";
import { calculateOrder } from "../hooks/calculateOrder";

export default function Orders() {
    const { registrationNumber } = useBusiness();
    const { orders, setOrders, loading, error } = getOrders(registrationNumber);

    const productIds = Array.from(
        new Set(orders.flatMap(order => order.lines?.map(line => line.productId) || []))
    );
    const { productsMap } = getProductDetails(productIds);

    const navigate = useNavigate();

    const editOrder = (orderId: string) => navigate(`/edit-order/${orderId}`);
    const hideOrder = (orderId: string) => setOrders(prev => prev.filter(o => o.orderId !== orderId));

    const payOrder = async (orderId: string) => {
        try {
            await calculateOrder(orderId);
            navigate(`/pay-order/${orderId}`);
        } catch (err: any) {
            alert(`Error calculating order: ${err.message}`);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "closed_paid": return styles['status-completed'];
            case "refunded": return styles['status-refunded'];
            case "partially_refunded": return styles['status-partially-refunded'];
            case "cancelled": return styles['status-canceled'];
            default: return '';
        }
    };

    const formatStatusText = (status: string) =>
        status === "CLOSED_PAID" ? "COMPLETED" : status.replace(/_/g, " ").toUpperCase();

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles['orders-grid']}>
            {orders.length === 0 && <p>No orders found</p>}
            {orders.map((order) => (
                <div key={order.orderId} className={styles['order-card']}>
                    <div className={styles['order-header']}>
                        <h2 className={styles['order-title']}>Order #{order.orderId}</h2>
                        <span className={`${styles['order-status']} ${getStatusClass(order.status)}`}>
              {formatStatusText(order.status)}
            </span>
                    </div>

                    <div className={styles['order-items']}>
                        {order.lines?.map((item, idx) => {
                            const product = productsMap[item.productId];
                            return (
                                <div key={idx} className={styles['order-item']}>
                                    <div className={styles['order-item-header']}>
                                        <div>
                                          <span className={styles['product-name']}>
                                            {product?.name || item.productId}
                                          </span>
                                            {product?.description && (
                                                <p className={styles['product-description']}>
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className={styles['product-qty']}>x{item.quantity}</span>
                                        <span className={styles['product-price']}>{item.subTotal}$</span>
                                    </div>
                                    {item.notes && (
                                        <p className={styles['order-item-notes']}>{item.notes}</p>
                                    )}
                                </div>
                            );
                        })}

                        {order.notes && (
                            <p className={styles['order-notes']}>Notes: {order.notes}</p>
                        )}
                    </div>

                    <div className={styles['order-buttons']}>
                        {order.status === "OPEN" && (
                            <>
                                <button
                                    className={`${styles['btn-filled']} ${styles['full-width']}`}
                                    onClick={() => editOrder(order.orderId)}
                                >
                                    Edit Order
                                </button>

                                <button
                                    className={`${styles['btn-filled']} ${styles['full-width']}`}
                                    onClick={() => payOrder(order.orderId)}
                                >
                                    Pay
                                </button>
                            </>
                        )}

                        {order.status === "CLOSED_PAID" && (
                            <>
                                <div className={styles['order-summary-container']}>
                                    <div className={styles['order-summary-item']}>
                                        <div className={styles['order-item-header']}>
                                            <span className={styles['product-name']}>Taxed</span>
                                            <span className={styles['product-qty']}></span>
                                            <span className={styles['product-price']}>{order.taxAmount?.toFixed(2)}$</span>
                                        </div>
                                    </div>
                                    <div className={styles['order-summary-item']}>
                                        <div className={styles['order-item-header']}>
                                            <span className={styles['product-name']}>Total</span>
                                            <span className={styles['product-qty']}></span>
                                            <span className={styles['product-price']}>{order.totalDue?.toFixed(2)}$</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className={styles['btn-refund']}>Refund</button>
                            </>
                        )}

                        {["COMPLETED", "REFUNDED", "PARTIALLY_REFUNDED", "CANCELLED"].includes(order.status) && (
                            <button
                                className={`${styles['btn-filled']} ${styles['full-width']}`}
                                onClick={() => hideOrder(order.orderId)}
                            >
                                Hide from list
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
