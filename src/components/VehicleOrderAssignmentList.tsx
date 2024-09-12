import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { mockApi } from "../api/api";
import { useAppStore } from "../store/store";

const VehicleOrderAssignmentList: React.FC = () => {
  const { vehicles, orders } = useAppStore();

  const toggleFavorite = async (plate: string) => {
    await mockApi.toggleFavorite(plate);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vehicle/Order Assignments
      </Typography>
      {vehicles.map((vehicle) => {
        const vehicleOrders = orders.filter(
          (order) => order.vehiclePlate === vehicle.plate
        );
        return (
          <Accordion key={vehicle.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: vehicle.isFavorite
                  ? "rgba(255, 215, 0, 0.1)"
                  : "inherit",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Tooltip
                  title={
                    vehicle.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(vehicle.plate);
                    }}
                    size="small"
                  >
                    {vehicle.isFavorite ? (
                      <StarIcon color="primary" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography sx={{ width: "30%", flexShrink: 0, ml: 1 }}>
                  {vehicle.plate}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}></Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Observations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicleOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.weight}</TableCell>
                        <TableCell>{order.destination}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.observations}</TableCell>
                      </TableRow>
                    ))}
                    {vehicleOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Chip label="No orders assigned" color="primary" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default VehicleOrderAssignmentList;
