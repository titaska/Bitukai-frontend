import { PRODUCTS_BASE } from "../constants/api";
import {
  Product,
  ProductType,
  ProductCreateDto,
  ProductUpdateDto,
  ListParams,
} from "../types/Product";

function normalizeProductsResponse(json: any): Product[] {
  const arr = Array.isArray(json) ? json : (json?.data ?? []);
  if (!Array.isArray(arr)) return [];

  return arr.map((p: any) => ({
    ...p,
    productType: (p.productType ?? p.type) as ProductType,
  }));
}

export async function listProducts(params: ListParams): Promise<{ data: Product[]; pagination: any }> {
  const query = new URLSearchParams();

  query.set("registrationNumber", params.registrationNumber);

  if (params.type) query.set("type", params.type);
  if (params.search) query.set("search", params.search);
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 20));

  const res = await fetch(`${PRODUCTS_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  return {
    data: normalizeProductsResponse(json),
    pagination: json?.pagination ?? null,
  };
}

export async function createProduct(dto: ProductCreateDto): Promise<Product> {
  const payload: any = {
    ...dto,
    type: dto.type,
  };
  delete payload.productType;

  const res = await fetch(`${PRODUCTS_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  return normalizeProductsResponse([json])[0];
}

export async function updateProduct(productId: string, dto: ProductUpdateDto): Promise<Product> {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();
  return normalizeProductsResponse([json])[0];
}

export async function deleteProduct(productId: string): Promise<void> {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
