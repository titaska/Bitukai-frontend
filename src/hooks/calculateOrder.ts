import { API_BASE } from "../constants/api";

export async function calculateOrder(orderId: string) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}/calculate`, {
            method: "POST",
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Failed to calculate order");
        }
        return true;
    } catch (err: any) {
        throw new Error(err.message);
    }
}