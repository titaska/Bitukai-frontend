// src/types/service.ts
export interface ServiceConfig {
    id: number;
    name: string;
    price: number;       // pvz. 1236.23
    createdOn: string;   // "YYYY-MM-DD"
  }
  
  export interface ServiceCreateUpdate {
    name: string;
    price: number;
    createdOn: string;
  }
  