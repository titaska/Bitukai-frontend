import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails } from "../hooks/getOrderDetails";
import { closeOrder } from "../hooks/closeOrder";
import styles from "./PayOrder.module.css";

export default function PayOrder() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const { order, productNames, loading, error } = getOrderDetails(orderId!);

    const payOrder = async () => {
        if (!order) return;
        await closeOrder(order.orderId);
        navigate("/orders");
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;
    if (!order) return <p>Order not found</p>;

    const createdAt = new Date(order.createdAt);

    return (
        <div className={styles.page}>
            <div className={styles.receipt}>
                <h2 className={styles.title}>Payment</h2>

                {/* Order meta */}
                <div className={styles.meta}>
                    <div>
                        <div className={styles.metaLabel}>Order</div>
                        <div>#{order.registrationNumber}</div>
                    </div>

                    <div className={styles.metaRight}>
                        <div>{createdAt.toLocaleDateString()}</div>
                        <div className={styles.metaTime}>{createdAt.toLocaleTimeString()}</div>
                    </div>
                </div>

                {/* Order lines */}
                <div className={styles.lines}>
                    {order.lines.map(line => (
                        <div key={line.orderLineId} className={styles.line}>
                            <div className={styles.lineLeft}>
                                <span className={styles.qty}>{line.quantity}×</span>
                                <span>{productNames[line.productId] ?? "Unknown product"}</span>
                            </div>
                            <span>${line.subTotal.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.divider} />

                {/* Totals */}
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>${order.subtotalAmount?.toFixed(2)}</span>
                </div>

                <div className={styles.summaryRow}>
                    <span>Tax</span>
                    <span>${order.taxAmount?.toFixed(2)}</span>
                </div>

                <div className={styles.totalRow}>
                    <span>Total Due</span>
                    <span>${order.totalDue?.toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={() => navigate("/orders")}>
                        Cancel
                    </button>

                    <button className={styles.payBtn} onClick={payOrder} disabled={order.status === "Closed"}>
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
}


