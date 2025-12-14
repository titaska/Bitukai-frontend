import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { StaffDto, StaffRole, StaffStatus, StaffUpdate } from "../types/staff";

export interface StaffEditModalProps {
  open: boolean;
  staff: StaffDto;
  onClose: () => void;
  onSave: (data: StaffUpdate) => Promise<void> | void;
}

const StaffEditModal: React.FC<StaffEditModalProps> = ({
  open,
  staff,
  onClose,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(staff.firstName);
  const [lastName, setLastName] = useState(staff.lastName);
  const [email, setEmail] = useState(staff.email);
  const [phoneNumber, setPhoneNumber] = useState(staff.phoneNumber);
  const [hireDate, setHireDate] = useState(
    staff.hireDate ? staff.hireDate.slice(0, 10) : ""
  );

  // Kai pasikeičia staff (arba atsidaro tas pats modal su kitu darbuotoju) – atnaujinam formą
  useEffect(() => {
    setFirstName(staff.firstName);
    setLastName(staff.lastName);
    setEmail(staff.email);
    setPhoneNumber(staff.phoneNumber);
    setHireDate(staff.hireDate ? staff.hireDate.slice(0, 10) : "");
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: StaffUpdate = {
      status: staff.status ?? StaffStatus.ACTIVE,
      firstName,
      lastName,
      email,
      phoneNumber,
      passwordHash: null, // slaptažodžio nekeičiam, backend turi ignoruoti null
      role: staff.role ?? StaffRole.STAFF,
      hireDate,
    };

    await onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit staff member</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="First name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Phone number"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <TextField
              label="Employed on"
              type="date"
              fullWidth
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffEditModal;
