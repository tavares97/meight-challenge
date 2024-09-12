import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Order, Vehicle } from "../store/store";

import React from "react";

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  order: Order;
  setSelectedVehicle: (plate: string | null) => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  order,
  setSelectedVehicle,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedVehicle(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="vehicle-select-label">Assign to Vehicle</InputLabel>
      <Select
        labelId="vehicle-select-label"
        label="Assign to Vehicle"
        value={selectedVehicle || ""}
        onChange={handleChange}
      >
        {vehicles
          .sort((_a, b) => (b.isFavorite ? 1 : -1))
          .map((vehicle) => (
            <MenuItem
              key={vehicle.id}
              value={vehicle.plate}
              disabled={vehicle.remainingCapacity < order.weight}
            >
              {vehicle.plate} ( Capacity: {vehicle.remainingCapacity})
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default VehicleSelector;
