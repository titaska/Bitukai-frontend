import { API_BASE } from "../constants/api";

export async function closeOrder(orderId: string) {
    try {
        const res = await fetch(`${API_BASE}/orders/${orderId}/close`, {
            method: "POST"
        });
        if (!res.ok) throw new Error("Failed to close order");
    } catch (err: any) {
        throw new Error(err.message);
    }
}