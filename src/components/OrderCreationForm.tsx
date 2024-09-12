import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Order, Vehicle } from "../store/store";
import React, { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface OrderCreationFormProps {
  vehicles: Vehicle[];
  open: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

const OrderCreationForm: React.FC<OrderCreationFormProps> = ({
  vehicles,
  open,
  onClose,
  onOrderCreated,
}) => {
  const [order, setOrder] = useState({
    weight: 0,
    destination: "",
    observations: "",
    vehiclePlate: "",
    date: dayjs().format("YYYY-MM-DD"),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOrderCreated(order);
    setOrder({
      weight: 0,
      destination: "",
      observations: "",
      vehiclePlate: "",
      date: dayjs().format("YYYY-MM-DD"),
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Order</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Weight"
              name="weight"
              value={order.weight}
              margin="normal"
              type="number"
              required
              onChange={(e) =>
                setOrder({ ...order, weight: Number(e.target.value) })
              }
            />
            <TextField
              fullWidth
              label="Destination"
              name="destination"
              value={order.destination}
              margin="normal"
              required
              onChange={(e) =>
                setOrder({ ...order, destination: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Observations"
              name="observations"
              value={order.observations}
              margin="normal"
              multiline
              rows={3}
              onChange={(e) =>
                setOrder({ ...order, observations: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-select-label"
                name="vehiclePlate"
                value={order.vehiclePlate}
                onChange={(e) =>
                  setOrder({ ...order, vehiclePlate: e.target.value })
                }
              >
                {vehicles.map((vehicle) => (
                  <MenuItem
                    key={vehicle.id}
                    value={vehicle.plate}
                    disabled={vehicle.remainingCapacity < order.weight}
                  >
                    {vehicle.plate} (Remaining Capacity:{" "}
                    {vehicle.remainingCapacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DatePicker
              label="Date"
              value={dayjs(order.date)}
              onChange={(value) =>
                setOrder({
                  ...order,
                  date:
                    value?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Create Order
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default OrderCreationForm;
