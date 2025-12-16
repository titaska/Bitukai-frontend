import React, { useState } from "react";
import styles from "./NewOrder.module.css";
import { ProductDto } from "../types/ProductDto";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../types/BusinessContext";
import { getProducts } from "../hooks/getProducts";
import { createOrder, OrderItem } from "../hooks/createOrder";

export default function NewOrder() {
    const { registrationNumber } = useBusiness();
    const { products, loading, error } = getProducts(registrationNumber);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const navigate = useNavigate();

    const goToOrders = async () => {
        try {
            await createOrder(registrationNumber, orderItems);
            navigate("/orders");
        } catch (err: any) {
            console.error("Error placing order:", err);
            alert("Something went wrong while placing the order.");
        }
    };

    const addToOrder = (product: ProductDto) => {
        setOrderItems(prev => {
            const existing = prev.find(item => item.productId === product.productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const increaseQuantity = (id: string) => {
        setOrderItems(prev =>
            prev.map(item =>
                item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: string) => {
        setOrderItems(prev =>
            prev
                .map(item =>
                    item.productId === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const totalPrice = orderItems.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
    );

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles['new-order-page']}>
            <div className={styles['new-order-container']}>
                <div className={styles['products-grid']}>
                    {products.length === 0 && <p>Loading products...</p>}
                    {products.map(product => (
                        <div key={product.productId} className={styles['product-card']}>
                            <div className={styles['product-image']}>🧋</div>
                            <div className={styles['product-details']}>
                                <div className={styles['product-info']}>
                                    <div className={styles['product-name']}>{product.name}</div>
                                    <div className={styles['product-description']}>{product.description}</div>
                                </div>
                                <div className={styles['product-price']}>${product.basePrice.toFixed(2)}</div>
                            </div>
                            <button className={styles['add-button']} onClick={() => addToOrder(product)}>
                                +
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles['order-summary']}>
                    <h2>Order Summary</h2>
                    {orderItems.length === 0 && <p>No items added</p>}
                    {orderItems.map(item => (
                        <div key={item.productId} className={styles['order-item']}>
                            <span>{item.name}</span>
                            <div className={styles['quantity-controls']}>
                                <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.productId)}>+</button>
                            </div>
                            <span>${(item.basePrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    {orderItems.length > 0 && (
                        <>
                            <div className={styles['total']}>
                                <strong>Total:</strong> ${totalPrice.toFixed(2)}
                            </div>
                            <button className={styles['place-order-btn']} onClick={goToOrders}>
                                Place Order
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}