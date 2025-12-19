import { API_BASE } from "../constants/api";
import { OrderItem } from "../types/OrderItem";
import { OriginalOrderLine } from "../types/OriginalOrderLine";

export async function updateOrder(
    orderId: string,
    orderItems: OrderItem[],
    originalLines: OriginalOrderLine[]
) {
    try {
        const currentLineIds = new Set(
            orderItems.filter(i => i.orderLineId).map(i => i.orderLineId!)
        );
        
        for (const original of originalLines) {
            if (!currentLineIds.has(original.orderLineId)) {
                await fetch(`${API_BASE}/orders/${orderId}/lines/${original.orderLineId}`, {
                    method: "DELETE"
                });
            }
        }

        // Update or create lines
        for (const item of orderItems) {
            if (item.orderLineId) {
                // Update existing line
                await fetch(`${API_BASE}/orders/${orderId}/lines/${item.orderLineId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: item.quantity })
                });
            } else {
                // Create new line
                await fetch(`${API_BASE}/orders/${orderId}/lines`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: item.productId,
                        quantity: item.quantity,
                        assignedStaffId: null,
                        appointmentId: null,
                        notes: null,
                        unitPrice: item.basePrice
                    })
                });
            }
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
}