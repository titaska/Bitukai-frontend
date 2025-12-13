import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface StaffDto {
  id: string;
  registrationNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hireDate: string;
}

const API_BASE = "http://localhost:5000/api";

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