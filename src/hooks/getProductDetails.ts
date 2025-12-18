import { useEffect, useState } from "react";
import { API_BASE } from "../constants/api";
import { Product } from "../types/Product";

export function useProductDetails(productIds: string[]) {
    const [productsMap, setProductsMap] = useState<Record<string, Product>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productIds.length) {
            setLoading(false);
            return;
        }

        async function fetchProducts() {
            const products: Record<string, Product> = {};
            try {
                await Promise.all(
                    productIds.map(async (id) => {
                        try {
                            const res = await fetch(`${API_BASE}/products/${id}`);
                            if (!res.ok) return;
                            const prod = await res.json();
                            products[id] = prod;
                        } catch (err) {
                            console.error(`Failed to fetch product ${id}`, err);
                        }
                    })
                );
                setProductsMap(products);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [productIds]);

    return { productsMap, loading, error };
}