import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StaffDto, StaffCreate } from "../../types/staff";
import StaffFormModal from "../../components/StaffFormModal";
import { staffApi } from "../../services/staffApi";
import { staffServicesApi } from "../../services/staffServicesApi";

const formatDate = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).split("T")[0];
};

const getErrorMessage = async (e: any): Promise<string> => {
  if (e?.message) return e.message;
  return "Unknown error";
};

const StaffListPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) staff list
      const data = await staffApi.getAll();
      const normalized = data.map((s) => ({
        ...s,
        hireDate: formatDate(s.hireDate),
      }));
      setStaff(normalized);

      // 2) services per staff (staffId -> "name1, name2")
      const entries = await Promise.all(
        normalized.map(async (m) => {
          try {
            const svcs = await staffServicesApi.getByStaffId(m.staffId);
            const names = svcs.map((x) => x.name).filter(Boolean);
            return [m.staffId, names.length ? names.join(", ") : "—"] as const;
          } catch {
            return [m.staffId, "—"] as const;
          }
        })
      );

      setServicesMap(Object.fromEntries(entries));
    } catch (e: any) {
      console.error(e);
      setError(await getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveNew = async (dto: StaffCreate) => {
    try {
      setLoading(true);
      setError(null);

      await staffApi.create(dto);
      setOpenModal(false);
      await load();
    } catch (e: any) {
      console.error(e);
      setError(await getErrorMessage(e));
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await staffApi.delete(id);
      await load();
    } catch (e: any) {
      console.error(e);
      setError(await getErrorMessage(e));
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Staff members</Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add New
        </Button>
      </Box>

      {error && (
        <Box mb={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Employed on</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>

            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.staffId}>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => navigate(`/staff/${member.staffId}`)}
                    >
                      {member.firstName} {member.lastName}
                    </Button>
                  </TableCell>

                  <TableCell>{servicesMap[member.staffId] ?? "—"}</TableCell>

                  <TableCell>{formatDate(member.hireDate)}</TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => navigate(`/staff/${member.staffId}`)}
                    >
                      Edit Details
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(member.staffId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {staff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No staff members found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <StaffFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveNew}
      />
    </Box>
  );
};

export default StaffListPage;
