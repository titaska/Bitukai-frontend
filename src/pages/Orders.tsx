import React, { useEffect, useState } from "react";
import "./Orders.css";
import { OrderDto } from "../types/OrderDto";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch("http://localhost:5089/orders?page=1&limit=20");
                const text = await response.text();
                if (!text) {
                    setOrders([]);
                    return;
                }
                const data = JSON.parse(text);
                setOrders(data.data as OrderDto[]);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);


    const editOrder = (orderId: string) => {
        navigate(`/edit-order/${orderId}`);
    };
    
    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "status-paid";
            case "completed":
                return "status-completed";
            case "refunded":
                return "status-refunded";
            default:
                return "";
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="orders-grid">
            {orders.length === 0 && <p>No orders found</p>}
            {orders.map((order) => (
                <div key={order.orderId} className="order-card">
                    <div className="order-header">
                        <h2 className="order-title">Order #{order.orderId}</h2>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="order-items">
                        {order.lines?.map((item, idx) => (
                            <div key={idx} className="order-item">
                                <span>{item.productId}</span>
                                <span>{item.subTotal}$</span>
                            </div>
                        ))}
                        {order.notes && <p className="order-notes">Notes: {order.notes}</p>}
                    </div>

                    <div className="order-buttons">
                        {order.status === "OPEN" && (
                            <button
                                className="btn-filled full-width"
                                onClick={() => editOrder(order.orderId)}
                            >
                                Edit Order
                            </button>
                        )}
                        {order.status === "PAID" && (
                            <>
                                <button className="btn-outline">Refund</button>
                                <button className="btn-filled">Mark as COMPLETED</button>
                            </>
                        )}
                        {(order.status === "COMPLETED" || order.status === "REFUNDED") && (
                            <button className="btn-filled full-width">Hide from list</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
