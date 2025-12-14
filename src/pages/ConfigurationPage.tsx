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
import ServiceFormModal from "../components/ServiceFormModal";
import { serviceApi } from "../services/serviceApi";

import { TaxDto } from "../types/tax";
import TaxFormModal from "../components/TaxFormModal";
import { taxApi } from "../services/taxApi";

const ConfigurationPage: React.FC = () => {
  // ===== SERVICES =====
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceConfig | null>(
    null
  );

  // ===== TAXES =====
  const [taxes, setTaxes] = useState<TaxDto[]>([]);
  const [taxesLoading, setTaxesLoading] = useState(true);
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxDto | null>(null);

  // ===== COMMON ERROR =====
  const [error, setError] = useState<string | null>(null);

  // ===== LOADERS =====
  const loadServices = async () => {
    try {
      setServicesLoading(true);
      setError(null);
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load services");
    } finally {
      setServicesLoading(false);
    }
  };

  const loadTaxes = async () => {
    try {
      setTaxesLoading(true);
      setError(null);
      const data = await taxApi.getAll();
      setTaxes(data);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load taxes");
    } finally {
      setTaxesLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    loadTaxes();
  }, []);

  // ===== SERVICES HANDLERS =====
  const handleOpenNewService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceConfig) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleSaveService = async (
    dto: ServiceCreateUpdate,
    idToUpdate?: number
  ) => {
    try {
      setError(null);
      if (idToUpdate) await serviceApi.update(idToUpdate, dto);
      else await serviceApi.create(dto);

      setServiceModalOpen(false);
      await loadServices();
    } catch (e: any) {
      console.error(e);
      setError("Failed to save service");
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      setError(null);
      await serviceApi.delete(id);
      await loadServices();
    } catch (e: any) {
      console.error(e);
      setError("Failed to delete service");
    }
  };

  // ===== TAXES HANDLERS =====
  const handleOpenNewTax = () => {
    setEditingTax(null);
    setTaxModalOpen(true);
  };

  const handleOpenEditTax = (tax: TaxDto) => {
    setEditingTax(tax);
    setTaxModalOpen(true);
  };

  // TaxFormModal onSave paduoda (data, idToUpdate?)
  const handleSaveTax = async (dto: any, idToUpdate?: string) => {
    try {
      setError(null);

      if (idToUpdate) {
        await taxApi.update(idToUpdate, dto);
      } else {
        await taxApi.create(dto);
      }

      setTaxModalOpen(false);
      await loadTaxes();
    } catch (e: any) {
      console.error(e);
      setError("Failed to save tax");
    }
  };

  const handleDeleteTax = async (id: string) => {
    try {
      setError(null);
      await taxApi.delete(id);
      await loadTaxes();
    } catch (e: any) {
      console.error(e);
      setError("Failed to delete tax");
    }
  };

  // ===== UI HELPERS =====
  const [showAllServices, setShowAllServices] = useState(false);
  const visibleServices = showAllServices ? services : services.slice(0, 3);

  const [showAllTaxes, setShowAllTaxes] = useState(false);
  const visibleTaxes = showAllTaxes ? taxes : taxes.slice(0, 3);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Configuration
      </Typography>

      {error && (
        <Box mb={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* ===================== SERVICES ===================== */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Services</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">Services</Typography>
            <Button variant="contained" onClick={handleOpenNewService}>
              Add New
            </Button>
          </Box>

          {servicesLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleServices.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{Number(s.price).toFixed(2)} $</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleOpenEditService(s)}>
                          Edit Details
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteService(s.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {services.length > 3 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Button
                          size="small"
                          onClick={() => setShowAllServices((prev) => !prev)}
                        >
                          {showAllServices ? "View less" : "View more"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>No services found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>

      {/* ===================== TAXES ===================== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Taxes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">Taxes</Typography>
            <Button variant="contained" onClick={handleOpenNewTax}>
              Add New
            </Button>
          </Box>

          {taxesLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTaxes.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.description ?? "-"}</TableCell>
                      <TableCell>{Number(t.percentage).toFixed(2)} %</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => handleOpenEditTax(t)}>
                          Edit Details
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteTax(t.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {taxes.length > 3 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Button
                          size="small"
                          onClick={() => setShowAllTaxes((prev) => !prev)}
                        >
                          {showAllTaxes ? "View less" : "View more"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  {taxes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No taxes found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>

      {/* ===================== DISCOUNTS (placeholder) ===================== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Discounts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Discounts configuration (placeholder).</Typography>
        </AccordionDetails>
      </Accordion>

      {/* ===================== INVENTORY (placeholder) ===================== */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Inventory</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Inventory configuration (placeholder).</Typography>
        </AccordionDetails>
      </Accordion>

      {/* ===================== MODALS ===================== */}
      <ServiceFormModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onSave={handleSaveService}
        editingId={editingService?.id ?? null}
        initialData={
          editingService
            ? { name: editingService.name, price: editingService.price }
            : null
        }
      />

      <TaxFormModal
        open={taxModalOpen}
        onClose={() => setTaxModalOpen(false)}
        onSave={handleSaveTax}
        editingId={editingTax?.id ?? null}
        initialData={
          editingTax
            ? {
                name: editingTax.name,
                description: editingTax.description ?? null,
                percentage: editingTax.percentage,
              }
            : null
        }
      />
    </Box>
  );
};

export default ConfigurationPage;
