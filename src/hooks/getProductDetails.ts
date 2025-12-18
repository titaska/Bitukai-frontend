import { useEffect, useState } from "react";
import { API_BASE } from "../constants/api";
import { Product } from "../types/Product";

export function useProductDetails(productIds: string[]) {
    const [productsMap, setProductsMap] = useState<Record<string, Product>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productIds.length) return;

        async function fetchProducts() {
            const missingIds = productIds.filter(id => !productsMap[id]);
            if (!missingIds.length) return;

            const fetched: Record<string, Product> = {};

            await Promise.all(
                missingIds.map(async (id) => {
                    const res = await fetch(`${API_BASE}/products/${id}`);
                    if (!res.ok) return;
                    fetched[id] = await res.json();
                })
            );

            if (Object.keys(fetched).length) {
                setProductsMap(prev => ({ ...prev, ...fetched }));
            }
        }

        fetchProducts();
    }, [productIds]);

    return { productsMap, loading, error };
}