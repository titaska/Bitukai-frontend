import { PRODUCTS_BASE } from "../constants/api";

export type ProductStaffDto = {
  productStaffId: string;
  productId: string;
  staffId: string;
  status: boolean;
  validFrom?: string | null;
  validTo?: string | null;
};

export async function getProductStaff(productId: string) {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}/staff`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function linkStaff(productId: string, dto: {
  staffId: string;
  status: boolean;
  validFrom?: string | null;
  validTo?: string | null;
}) {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}/staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateProductStaff(productId: string, staffId: string, dto: {
  status: boolean;
  validFrom?: string | null;
  validTo?: string | null;
}) {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}/staff/${staffId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function unlinkStaff(productId: string, staffId: string) {
  const res = await fetch(`${PRODUCTS_BASE}/products/${productId}/staff/${staffId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
}
