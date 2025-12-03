// src/pages/ConfigurationPage.tsx
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ServiceConfig, ServiceCreateUpdate } from "../types/service";
import { mockConfigService } from "../mock/mockConfigService";
import ServiceFormModal from "../components/ServiceFormModal";

const ConfigurationPage: React.FC = () => {
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<ServiceConfig | null>(null);

  const loadServices = async () => {
    setLoading(true);
    const data = await mockConfigService.getAllServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenNew = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceConfig) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleSave = async (
    dto: ServiceCreateUpdate,
    idToUpdate?: number
  ) => {
    if (idToUpdate) {
      await mockConfigService.updateService(idToUpdate, dto);
    } else {
      await mockConfigService.createService(dto);
    }
    setModalOpen(false);
    await loadServices();
  };

  const handleDelete = async (id: number) => {
    await mockConfigService.deleteService(id);
    await loadServices();
  };

  // Paprastas „view more“ – rodom max 3, paskui perjungiam
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? services : services.slice(0, 3);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Configuration
      </Typography>

      {/* SERVICES SECTION */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Services</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">Services</Typography>
            <Button variant="contained" onClick={handleOpenNew}>
              Add New
            </Button>
          </Box>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Created on</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleServices.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.price.toFixed(2)} $</TableCell>
                      <TableCell>{s.createdOn}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => handleOpenEdit(s)}
                        >
                          Edit Details
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {services.length > 3 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Button
                          size="small"
                          onClick={() => setShowAll((prev) => !prev)}
                        >
                          {showAll ? "View less" : "View more"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>

      {/* TAXES SECTION (placeholder) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Taxes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Taxes configuration (mock placeholder).</Typography>
        </AccordionDetails>
      </Accordion>

      {/* DISCOUNTS SECTION (placeholder) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Discounts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Discounts configuration (mock placeholder).</Typography>
        </AccordionDetails>
      </Accordion>

      {/* INVENTORY SECTION (placeholder) */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Inventory</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Inventory configuration (mock placeholder).</Typography>
        </AccordionDetails>
      </Accordion>

      <ServiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingId={editingService?.id ?? null}
        initialData={
          editingService
            ? {
                name: editingService.name,
                price: editingService.price,
                createdOn: editingService.createdOn,
              }
            : null
        }
      />
    </Box>
  );
};

export default ConfigurationPage;
