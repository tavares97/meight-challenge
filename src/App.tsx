import {
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
import { Order, Vehicle } from "./store/store";
import React, { useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OrderCreationForm from "./components/OrderCreationForm";
import OrderListSearch from "./components/OrderListSearch";
import VehicleOrderAssignmentList from "./components/VehicleOrderAssignmentList";
import { mockApi } from "./api/api";

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const orders = await mockApi.getOrders();
      const vehicles = await mockApi.getVehicles();
      setOrders(orders);
      setVehicles(vehicles);
    };
    fetch();
  }, [orders, vehicles]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOrderCreated = async (order: Order) => {
    try {
      await mockApi.addOrder(order);
      setOrders([...orders, order]);
      setAlertVisible(true);
    } catch {
      throw new Error("Failed to add the order");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Container>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Search Orders" />
            <Tab label="Vehicle Assignments" />
          </Tabs>
        </Box>
        {tabValue === 0 && (
          <>
            <Button
              variant="contained"
              onClick={() => setIsOrderFormOpen(true)}
              sx={{ mb: 2 }}
            >
              Create New Order
            </Button>
            <OrderListSearch orders={orders} vehicles={vehicles} />
          </>
        )}
        {tabValue === 1 && <VehicleOrderAssignmentList />}
        <OrderCreationForm
          open={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
          onOrderCreated={handleOrderCreated}
          vehicles={vehicles}
        />

        {alertVisible && (
          <Snackbar
            open={alertVisible}
            message="Order created successfully"
            autoHideDuration={3000}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default App;
