import { API_BASE } from "../constants/api";
import { StaffDto } from "../types/staff";

interface LoginCredentials {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginCredentials): Promise<StaffDto> {
  const payload = {
    Email: email,
    PasswordHash: password
  }
  const response = await fetch(`${API_BASE}/staff/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}