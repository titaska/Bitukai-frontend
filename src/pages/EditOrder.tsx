import React from "react";
import styles from "./NewOrder.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useBusiness } from "../types/BusinessContext";
import { getOrderDetails } from "../hooks/getOrderDetails";
import { updateOrder } from "../hooks/updateOrder";
import { getProducts } from "../hooks/getProducts";

export default function EditOrder() {
    const { registrationNumber } = useBusiness();
    const { orderId } = useParams<{ orderId: string }>();
    const { products} = getProducts(registrationNumber);
    const navigate = useNavigate();

    const { orderItems, setOrderItems, originalLines, loading, error } = getOrderDetails(
        orderId!,
        registrationNumber
    );

    const addToOrder = (product: any) => {
        setOrderItems(prev => {
            const existing = prev.find(i => i.productId === product.productId);
            if (existing) {
                return prev.map(i =>
                    i.productId === product.productId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const increaseQuantity = (id: string) =>
        setOrderItems(prev =>
            prev.map(i => (i.productId === id ? { ...i, quantity: i.quantity + 1 } : i))
        );

    const decreaseQuantity = (id: string) =>
        setOrderItems(prev =>
            prev
                .map(i => (i.productId === id ? { ...i, quantity: i.quantity - 1 } : i))
                .filter(i => i.quantity > 0)
        );

    const confirmEdit = async () => {
        try {
            await updateOrder(orderId!, orderItems, originalLines);
            navigate("/orders");
        } catch (err: any) {
            console.error("Failed to update order:", err);
            alert("Failed to update order");
        }
    };

    const totalPrice = orderItems.reduce(
        (sum, i) => sum + i.basePrice * i.quantity,
        0
    );

    if (loading) return <p>Loading order...</p>;
    if (error) return <p>Error: {error}</p>;
    

    return (
        <div className={styles["new-order-page"]}>
            <div className={styles["new-order-container"]}>
                <div className={styles["products-grid"]}>
                    {products.map(product => (
                        <div key={product.productId} className={styles["product-card"]}>
                            <div className={styles["product-image"]}>🧋</div>
                            <div className={styles["product-details"]}>
                                <div className={styles["product-info"]}>
                                    <div className={styles["product-name"]}>{product.name}</div>
                                    <div className={styles["product-description"]}>
                                        {product.description}
                                    </div>
                                </div>
                                <div className={styles["product-price"]}>
                                    ${product.basePrice.toFixed(2)}
                                </div>
                            </div>
                            <button
                                className={styles["add-button"]}
                                onClick={() => addToOrder(product)}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles["order-summary"]}>
                    <h2>Order Summary</h2>

                    {orderItems.map(item => (
                        <div key={item.productId} className={styles["order-item"]}>
                            <span>{item.name}</span>
                            <div className={styles["quantity-controls"]}>
                                <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.productId)}>+</button>
                            </div>
                            <span>
                                ${(item.basePrice * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    {orderItems.length > 0 && (
                        <>
                            <div className={styles["total"]}>
                                <strong>Total:</strong> ${totalPrice.toFixed(2)}
                            </div>
                            <button
                                className={styles["place-order-btn"]}
                                onClick={confirmEdit}
                            >
                                Confirm Edit
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
