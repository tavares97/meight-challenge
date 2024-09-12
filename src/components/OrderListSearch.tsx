import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Order, Vehicle } from "../store/store";
import React, { useMemo, useState } from "react";
import { filterOrders, getSortConfig, sortOrders } from "../utils/filterOrders";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import VehicleSelector from "./VehicleSelector";
import { mockApi } from "../api/api";

interface OrderListSearchProps {
  orders: Order[];
  vehicles: Vehicle[];
}

const OrderListSearch: React.FC<OrderListSearchProps> = ({
  orders,
  vehicles,
}) => {
  const [searchDate, setSearchDate] = useState<Dayjs | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const filteredOrders = useMemo(
    () =>
      filterOrders(orders, searchDate, searchDestination, showUnassignedOnly),
    [orders, searchDate, searchDestination, showUnassignedOnly]
  );

  const sortedOrders = useMemo(
    () => sortOrders(filteredOrders, sortConfig.key, sortConfig.direction),
    [filteredOrders, sortConfig]
  );

  const requestSort = (key: keyof Order) => {
    setSortConfig(getSortConfig(sortConfig.key, sortConfig.direction, key));
  };

  const clearFilters = () => {
    setSearchDate(null);
    setSearchDestination("");
    setShowUnassignedOnly(false);
  };

  const handleAssignOrder = async (plate: string) => {
    if (order && order.id) {
      try {
        await mockApi.assignOrderToVehicle(order.id, plate);
        setOpenDialog(false);
      } catch (error) {
        console.error("Failed to assign order to vehicle", error);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 950, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Search Orders
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
        }}
      >
        <DatePicker
          label="Order Date"
          value={searchDate}
          onChange={(newValue) => setSearchDate(newValue)}
        />
        <TextField
          label="Destination"
          value={searchDestination}
          onChange={(e) => setSearchDestination(e.target.value)}
        />
        <Button
          variant="outlined"
          color={showUnassignedOnly ? "secondary" : "primary"}
          onClick={() => setShowUnassignedOnly(!showUnassignedOnly)}
          sx={{ width: 150, fontSize: 12 }}
        >
          {showUnassignedOnly ? "Show All Orders" : "Show Unassigned "}
        </Button>

        <Tooltip title="Clear all filters">
          <IconButton aria-label="delete" onClick={clearFilters}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["id", "weight", "destination", "date", "plate"].map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={
                      sortConfig.key === key ? sortConfig.direction : "asc"
                    }
                    onClick={() => requestSort(key as keyof Order)}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {key}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Observations</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders.map((order, i) => (
              <TableRow key={i}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.weight}</TableCell>
                <TableCell>{order.destination}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.vehiclePlate || "Unassigned"}</TableCell>
                <TableCell>{order.observations}</TableCell>
                <TableCell>
                  {order.vehiclePlate.trim() === "" && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setOpenDialog(true);
                        setOrder(order);
                      }}
                    >
                      Assign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog}>
        <DialogTitle>Assign Order to Vehicle</DialogTitle>
        <DialogContent>
          {order && (
            <VehicleSelector
              vehicles={vehicles}
              setSelectedVehicle={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
              order={order}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedVehicle(null);
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedVehicle) {
                handleAssignOrder(selectedVehicle);
                setSelectedVehicle(null);
                setOpenDialog(false);
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderListSearch;
