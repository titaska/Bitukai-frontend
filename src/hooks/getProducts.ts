import { useEffect, useState } from "react";
import { API_BASE } from "../constants/api";
import { filterByRegistrationNumber } from "./filterByBusinessReg";
import { ProductDto } from "../types/ProductDto";

export function getProducts(registrationNumber: string) {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${API_BASE}/products?type=ITEM`);
                const result = await response.json();
                setProducts(filterByRegistrationNumber(result.data, registrationNumber));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [registrationNumber]);

    return { products, loading, error };
}