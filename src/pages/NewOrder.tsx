import React, { useEffect, useState } from "react";
import "./NewOrder.css";
import { ProductDto } from "../types/ProductDto";
import { useNavigate } from "react-router-dom";

interface OrderItem extends ProductDto {
    quantity: number;
}

export default function NewOrder() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const navigate = useNavigate();


    const goToOrders = async () => {
        try {
            // 1️⃣ Create a new order
            const createOrderResponse = await fetch("http://localhost:5089/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    registrationNumber: "CATERING",
                    customerId: null
                })
            });

            if (!createOrderResponse.ok) {
                throw new Error("Failed to create order");
            }

            const createdOrder = await createOrderResponse.json();
            const orderId = createdOrder.orderId;

            // 2️⃣ Add order lines
            for (const item of orderItems) {
                const lineResponse = await fetch(
                    `http://localhost:5089/orders/${orderId}/lines`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            productId: item.productId,
                            quantity: item.quantity,
                            assignedStaffId: null,
                            appointmentId: null,
                            notes: null
                        })
                    }
                );

                if (!lineResponse.ok) {
                    throw new Error(`Failed to add order line for ${item.name}`);
                }
            }

            // 3️⃣ Navigate to Orders page
            navigate("/orders");

        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong while placing the order.");
        }
    };

    // Fetch products from backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5089/products?type=ITEM");
                const result = await response.json();
                setProducts(result.data); // data array from backend
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

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

    return (
        <div className="new-order-page">
            <div className="new-order-container">
                <div className="products-grid">
                    {products.length === 0 && <p>Loading products...</p>}
                    {products.map(product => (
                        <div key={product.productId} className="product-card">
                            <div className="product-image">🧋</div> {/* Placeholder icon */}
                            <div className="product-details">
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">${product.basePrice.toFixed(2)}</div>
                                <div className="product-type">{product.productType}</div>
                            </div>
                            <button className="add-button" onClick={() => addToOrder(product)}>
                                +
                            </button>
                        </div>
                    ))}
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    {orderItems.length === 0 && <p>No items added</p>}
                    {orderItems.map(item => (
                        <div key={item.productId} className="order-item">
                            <span>{item.name}</span>
                            <div className="quantity-controls">
                                <button onClick={() => decreaseQuantity(item.productId)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.productId)}>+</button>
                            </div>
                            <span>${(item.basePrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    {orderItems.length > 0 && (
                        <>
                            <div className="total">
                                <strong>Total:</strong> ${totalPrice.toFixed(2)}
                            </div>
                            <button className="place-order-btn" onClick={goToOrders}>
                                Place Order
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}