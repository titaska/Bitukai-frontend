import { API_BASE } from "../constants/api";
import { ProductItem } from "../types/ProductItem";

export async function createOrder(
    registrationNumber: string,
    orderItems: ProductItem[]
) {
    try {
        const createOrderResponse = await fetch(`${API_BASE}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registrationNumber, customerId: null })
        });

        if (!createOrderResponse.ok) {
            throw new Error("Failed to create order");
        }

        const createdOrder = await createOrderResponse.json();
        const orderId = createdOrder.orderId;
        
        for (const item of orderItems) {
            const lineResponse = await fetch(`${API_BASE}/orders/${orderId}/lines`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: item.productId,
                    quantity: item.quantity,
                    assignedStaffId: null,
                    appointmentId: null,
                    notes: item.notes || null,
                    unitPrice: item.basePrice
                })
            });

            if (!lineResponse.ok) {
                throw new Error(`Failed to add order line for ${item.name}`);
            }
        }

        return orderId;
    } catch (err: any) {
        throw new Error(err.message);
    }
}