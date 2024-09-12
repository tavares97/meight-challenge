import { Dayjs } from "dayjs";
import { Order } from "../store/store";

export const filterOrders = (
  orders: Order[],
  searchDate: Dayjs | null,
  searchDestination: string,
  showUnassignedOnly: boolean
): Order[] => {
  return orders.filter((order) => {
    const isDateMatching =
      !searchDate || order.date === searchDate.format("YYYY-MM-DD");
    const isDestinationMatching = order.destination
      .toLowerCase()
      .includes(searchDestination.toLowerCase());
    const isUnassignedMatching =
      !showUnassignedOnly || order.vehiclePlate === "Unassigned";

    return isDateMatching && isDestinationMatching && isUnassignedMatching;
  });
};

export const sortOrders = (
  orders: Order[],
  sortKey: keyof Order | null,
  sortDirection: "asc" | "desc"
): Order[] => {
  if (!sortKey) return orders;

  return [...orders].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue == null || bValue == null) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

export const getSortConfig = (
  currentKey: keyof Order | null,
  currentDirection: "asc" | "desc",
  newKey: keyof Order
): { key: keyof Order; direction: "asc" | "desc" } => {
  if (currentKey === newKey) {
    return {
      key: newKey,
      direction: currentDirection === "asc" ? "desc" : "asc",
    };
  }
  return { key: newKey, direction: "asc" };
};
