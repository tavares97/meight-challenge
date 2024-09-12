import { Order, Vehicle, useAppStore } from "../store/store";

// Mock API
export const mockApi = {
  getOrders: async (): Promise<Order[]> => {
    try {
      return useAppStore.getState().orders;
    } catch {
      throw new Error("Failed to get the orders");
    }
  },
  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      return useAppStore.getState().vehicles;
    } catch {
      throw new Error("Failed to get the vehicles");
    }
  },
  addOrder: async (order: Omit<Order, "id">): Promise<void> => {
    try {
      useAppStore.getState().addOrder(order);
    } catch {
      throw new Error("Failed to add the order");
    }
  },
  toggleFavorite: async (plate: string): Promise<void> => {
    try {
      useAppStore.getState().toggleFavorite(plate);
    } catch {
      throw new Error("Failed to toggle the favorite");
    }
  },
  assignOrderToVehicle: async (
    orderId: string,
    plate: string
  ): Promise<void> => {
    try {
      useAppStore.getState().assignOrderToVehicle(orderId, plate);
    } catch {
      throw new Error("Failed to assign the order to the vehicle");
    }
  },
};
