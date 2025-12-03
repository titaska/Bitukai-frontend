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
import { StaffDto } from "../../types/staff";
import { mockStaffService } from "../../mock/Staff/mockStaffService";
import StaffFormModal from "../../components/StaffFormModal"; // 👈 ČIA SVARBU

const StaffListPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const data = await mockStaffService.getAll();
    setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveNew = async (dto: any) => {
    await mockStaffService.create(dto);
    await load();
    setOpenModal(false);
  };

  const handleDelete = async (id: number) => {
    await mockStaffService.delete(id);
    await load();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Staff members</Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
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
                  <TableCell>Service 1, Service 2 …</TableCell>
                  <TableCell>{member.hireDate}</TableCell>
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
