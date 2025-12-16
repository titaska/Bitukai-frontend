import { useEffect, useState } from "react";
import { API_BASE } from "../constants/api";
import { OrderDto } from "../types/OrderDto";

export interface OriginalOrderLine {
    orderLineId: string;
    productId: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    orderLineId?: string;
    basePrice?: number;
}

interface ProductNameMap {
    [productId: string]: string;
}

export function getOrderDetails(orderId: string) {
    const [order, setOrder] = useState<OrderDto | null>(null);
    const [productNames, setProductNames] = useState<ProductNameMap>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const orderItems: OrderItem[] = order?.lines.map(line => ({
        productId: line.productId,
        quantity: line.quantity,
        orderLineId: line.orderLineId,
        basePrice: line.unitPrice
    })) ?? [];

    const originalLines: OriginalOrderLine[] = order?.lines.map(line => ({
        orderLineId: line.orderLineId,
        productId: line.productId
    })) ?? [];

    useEffect(() => {
        async function fetchOrderAndProducts() {
            try {
                const orderRes = await fetch(`${API_BASE}/orders/${orderId}`);
                if (!orderRes.ok) throw new Error("Failed to fetch order");
                const orderData: OrderDto = await orderRes.json();
                setOrder(orderData);
                
                const uniqueProductIds = Array.from(new Set(orderData.lines.map(l => l.productId)));
                const products = await Promise.all(
                    uniqueProductIds.map(async (id) => {
                        const res = await fetch(`${API_BASE}/products/${id}`);
                        if (!res.ok) return { productId: id, name: "Unknown product" };
                        const data = await res.json();
                        return { productId: id, name: data.name };
                    })
                );

                const nameMap: ProductNameMap = {};
                products.forEach(p => {
                    nameMap[p.productId] = p.name;
                });

                setProductNames(nameMap);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrderAndProducts();
    }, [orderId]);

    return { order, productNames, orderItems, originalLines, loading, error };
}