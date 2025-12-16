import { useEffect, useState } from "react";
import { OrderDto } from "../types/OrderDto";
import { API_BASE } from "../constants/api";
import { filterByRegistrationNumber } from "./filterByBusinessReg";

export function getOrders(registrationNumber: string) {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch(`${API_BASE}/orders?page=1&limit=20`);
                const text = await res.text();
                if (!text) {
                    setOrders([]);
                    return;
                }
                const data = JSON.parse(text);
                const ordersData = data.data as OrderDto[];
                setOrders(filterByRegistrationNumber(ordersData, registrationNumber));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [registrationNumber]);

    return { orders, setOrders, loading, error };
}