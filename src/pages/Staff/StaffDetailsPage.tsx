// src/pages/Staff/StaffDetailsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { StaffDto, StaffUpdate } from "../../types/staff";
import { staffApi } from "../../services/staffApi";
import {
  staffServicesApi,
  StaffPerformedService,
  ServiceOption,
} from "../../services/staffServicesApi";

const formatDate = (iso: string | undefined | null): string => {
  if (!iso) return "";
  return iso.split("T")[0];
};

const StaffDetailsPage: React.FC = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();

  const id = Number(staffId);

  const [staff, setStaff] = useState<StaffDto | null>(null);
  const [form, setForm] = useState<StaffUpdate | null>(null);
  const [services, setServices] = useState<StaffPerformedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assign modal state
  const [assignOpen, setAssignOpen] = useState(false);
  const [allServices, setAllServices] = useState<ServiceOption[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [assignLoading, setAssignLoading] = useState(false);

  const load = async () => {
    if (!staffId || Number.isNaN(id)) {
      setError("Invalid staff id");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const s = await staffApi.getById(id);
      const normalizedHireDate = formatDate(s.hireDate);

      const normalizedStaff: StaffDto = {
        ...s,
        hireDate: normalizedHireDate,
      };

      setStaff(normalizedStaff);

      setForm({
        status: normalizedStaff.status,
        firstName: normalizedStaff.firstName,
        lastName: normalizedStaff.lastName,
        email: normalizedStaff.email,
        phoneNumber: normalizedStaff.phoneNumber,
        passwordHash: null,
        role: normalizedStaff.role,
        hireDate: normalizedHireDate,
      });

      const svc = await staffServicesApi.getByStaffId(id);
      setServices(svc);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  const handleChange =
    (field: keyof StaffUpdate) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

  const handleSave = async () => {
    if (!staff || !form) return;
    try {
      setLoading(true);
      setError(null);
      await staffApi.update(staff.staffId, form);
      await load();
    } catch (e: any) {
      console.error(e);
      setError("Failed to save changes");
      setLoading(false);
    }
  };

  const handleUnassign = async (staffServiceId: number) => {
    if (Number.isNaN(id)) return;
    try {
      setError(null);
      await staffServicesApi.unassign(id, staffServiceId);
      await load();
    } catch (e: any) {
      console.error(e);
      setError("Failed to unassign service");
    }
  };

  const openAssignModal = async () => {
    if (Number.isNaN(id)) return;
    try {
      setError(null);
      setAssignLoading(true);
      setSelectedServiceId("");
      const opts = await staffServicesApi.getAllServices();
      setAllServices(opts);
      setAssignOpen(true);
    } catch (e: any) {
      console.error(e);
      setError("Failed to load services list");
    } finally {
      setAssignLoading(false);
    }
  };

  const assignedNames = useMemo(() => new Set(services.map((s) => s.name)), [services]);

  const availableOptions = useMemo(
    () => allServices.filter((o) => !assignedNames.has(o.name)),
    [allServices, assignedNames]
  );

  const confirmAssign = async () => {
    if (Number.isNaN(id) || selectedServiceId === "") return;

    try {
      setAssignLoading(true);
      setError(null);
      await staffServicesApi.assign(id, Number(selectedServiceId));
      setAssignOpen(false);
      await load();
    } catch (e: any) {
      console.error(e);
      // jei backend grąžins „Already assigned“ ar unique constraint – parodysim normaliai
      setError(e?.message || "Failed to assign service");
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) return <Box p={3}>Loading...</Box>;
  if (error)
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!staff || !form) return <Box p={3}>Staff member not found</Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h5">
          {staff.firstName} {staff.lastName}
        </Typography>

        <Box display="flex" gap={1}>
          <Button variant="contained" onClick={handleSave}>
            Save changes
          </Button>
          <Button variant="outlined" onClick={() => navigate("/staff")}>
            Back to list
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" flexWrap="wrap" columnGap={6} rowGap={3}>
          <Box minWidth={200}>
            <Typography variant="caption">First name</Typography>
            <TextField variant="standard" fullWidth value={form.firstName} onChange={handleChange("firstName")} />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Last name</Typography>
            <TextField variant="standard" fullWidth value={form.lastName} onChange={handleChange("lastName")} />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Employed on</Typography>
            <TextField
              type="date"
              variant="standard"
              fullWidth
              value={form.hireDate || ""}
              onChange={handleChange("hireDate")}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Status</Typography>
            <Select
              variant="standard"
              fullWidth
              value={form.status}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, status: Number(e.target.value) as StaffUpdate["status"] }
                    : prev
                )
              }
            >
              <MenuItem value={1}>ACTIVE</MenuItem>
              <MenuItem value={2}>INACTIVE</MenuItem>
            </Select>
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Email</Typography>
            <TextField variant="standard" fullWidth value={form.email} onChange={handleChange("email")} />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Phone</Typography>
            <TextField variant="standard" fullWidth value={form.phoneNumber} onChange={handleChange("phoneNumber")} />
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle1">Performed services</Typography>
          <Button variant="contained" size="small" onClick={openAssignModal}>
            Add new
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  {Number.isFinite(Number((s as any).price))
                    ? `${Number((s as any).price).toFixed(2)} $`
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleUnassign(s.id)}>
                    Unassign
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>No services assigned.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Assign modal */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Assign service</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth variant="standard" disabled={assignLoading}>
            <InputLabel id="service-select-label">Service</InputLabel>
            <Select
              labelId="service-select-label"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            >
              {availableOptions.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.name}
                </MenuItem>
              ))}
              {availableOptions.length === 0 && (
                <MenuItem value="" disabled>
                  No available services
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)} disabled={assignLoading}>
            Cancel
          </Button>
          <Button
            onClick={confirmAssign}
            variant="contained"
            disabled={assignLoading || selectedServiceId === "" || availableOptions.length === 0}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffDetailsPage;
