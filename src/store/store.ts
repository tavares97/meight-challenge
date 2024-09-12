import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Define types
export interface Order {
  id?: string;
  weight: number;
  destination: string;
  observations: string;
  vehiclePlate: string;
  date: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  capacity: number;
  remainingCapacity: number;
  isFavorite: boolean;
}

interface AppState {
  orders: Order[];
  vehicles: Vehicle[];
  addOrder: (order: Omit<Order, "id">) => void;
  toggleFavorite: (plate: string) => void;
  assignOrderToVehicle: (orderId: string, vehicleId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      orders: [],
      vehicles: [
        {
          id: uuidv4(),
          plate: "25-TB-65",
          capacity: 1000,
          remainingCapacity: 1000,
          isFavorite: false,
        },
        {
          id: uuidv4(),
          plate: "25-TV-87",
          capacity: 1000,
          remainingCapacity: 1000,
          isFavorite: false,
        },
        {
          id: uuidv4(),
          plate: "45-UG-35",
          capacity: 1000,
          remainingCapacity: 1000,
          isFavorite: false,
        },
      ],
      addOrder: (order: Omit<Order, "id">) => {
        const newOrder = { ...order, id: uuidv4() };

        set((state) => {
          const updatedVehicles = state.vehicles.map((vehicle) => {
            if (vehicle.plate === order.vehiclePlate) {
              return {
                ...vehicle,
                remainingCapacity: vehicle.remainingCapacity - order.weight,
              };
            }
            return vehicle;
          });

          return {
            orders: [...state.orders, newOrder],
            vehicles: updatedVehicles,
          };
        });
      },
      toggleFavorite: (plate: string) => {
        const vehicles = get().vehicles;
        const vehicle = vehicles.find((vehicle) => vehicle.plate === plate);
        if (vehicle) {
          vehicle.isFavorite = !vehicle.isFavorite;
        }
        set({ vehicles: vehicles });
      },
      assignOrderToVehicle: (orderId: string, vehiclePlate: string) => {
        set((state) => {
          const orders = [...state.orders];
          const vehicles = [...state.vehicles];

          // Find the order by id
          const order = orders.find((o) => o.id === orderId);

          if (order) {
            const vehicle = vehicles.find((v) => v.plate === vehiclePlate);

            if (vehicle && vehicle.remainingCapacity >= order.weight) {
              vehicle.remainingCapacity -= order.weight;
              order.vehiclePlate = vehiclePlate;
            }
          }

          return { orders, vehicles };
        });
      },
    }),
    {
      name: "database-mock",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
