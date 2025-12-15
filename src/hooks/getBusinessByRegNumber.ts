import { API_BASE } from "../constants/api";
import { BusinessDto } from "../types/business";

export async function getBusinessByRegNumber(registrationNumber: string): Promise<BusinessDto> {
  const response = await fetch(`${API_BASE}/business/${registrationNumber}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
};