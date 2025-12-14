// src/types/service.ts
export interface ServiceConfig {
    id: number;
    name: string;
    price: number;       // pvz. 1236.23
  }
  
  export interface ServiceCreateUpdate {
    name: string;
    price: number;
  }
  