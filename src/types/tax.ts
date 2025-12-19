// src/types/tax.ts
export interface TaxDto {
    id: string;
    name: string;
    description?: string | null;
    percentage: number;
  }
  
  export interface TaxCreateUpdate {
    name: string;
    description?: string | null;
    percentage: number;
  }
  