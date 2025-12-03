import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { StaffDto, StaffUpdate } from "../../types/staff";
import { mockStaffService } from "../../mock/Staff/mockStaffService";
import { StaffPerformedService } from "../../mock/Staff/staffServiceMock";

const StaffDetailsPage: React.FC = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffDto | null>(null);
  const [form, setForm] = useState<StaffUpdate | null>(null);
  const [services, setServices] = useState<StaffPerformedService[]>([]);
  const [loading, setLoading] = useState(true);

  const id = Number(staffId);

  const load = async () => {
    setLoading(true);

    const s = await mockStaffService.getById(id);
    if (!s) {
      setStaff(null);
      setForm(null);
      setLoading(false);
      return;
    }

    setStaff(s);
    setForm({
      status: s.status,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      role: s.role,
      hireDate: s.hireDate,
    });

    const svc = await mockStaffService.getServicesByStaffId(id);
    setServices(svc);

    setLoading(false);
  };

  useEffect(() => {
    if (staffId) load();
  }, [staffId]);

  const handleChange =
    (field: keyof StaffUpdate) =>
    (e: any) => {
      setForm((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
    };

  const handleSave = async () => {
    if (!staff || !form) return;
    await mockStaffService.update(staff.staffId, form);
    await load();
  };

  const handleUnassign = async (serviceId: number) => {
    await mockStaffService.unassignService(serviceId);
    await load();
  };

  if (loading) return <Box p={3}>Loading...</Box>;
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

      {/* ========== Editable Staff Fields ========== */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" flexWrap="wrap" columnGap={6} rowGap={3}>
          <Box minWidth={200}>
            <Typography variant="caption">First name</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Last name</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Employed on</Typography>
            <TextField
              type="date"
              variant="standard"
              fullWidth
              value={form.hireDate}
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
              onChange={(e: any) =>
                setForm((prev) =>
                  prev ? { ...prev, status: Number(e.target.value) } : prev
                )
              }
            >
              <MenuItem value={1}>ACTIVE</MenuItem>
              <MenuItem value={2}>INACTIVE</MenuItem>
            </Select>
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Email</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={form.email}
              onChange={handleChange("email")}
            />
          </Box>

          <Box minWidth={200}>
            <Typography variant="caption">Phone</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
          </Box>
        </Box>
      </Paper>

      {/* ========== Performed Services ========== */}
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle1">Performed services</Typography>
          <Button variant="contained" size="small">Add new</Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.revenue.toFixed(2)} $</TableCell>
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
    </Box>
  );
};

export default StaffDetailsPage;
