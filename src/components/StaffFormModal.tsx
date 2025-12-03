// src/components/StaffFormModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { StaffCreate, StaffRole, StaffStatus } from "../types/staff";

export interface StaffFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: StaffCreate) => Promise<void> | void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hireDate, setHireDate] = useState("2024-12-11");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: StaffCreate = {
      registrationNumber: "REG-001",
      status: StaffStatus.ACTIVE,
      firstName,
      lastName,
      email,
      phoneNumber,
      role: StaffRole.STAFF,
      hireDate,
    };

    await onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New staff member details</DialogTitle>
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

export default StaffFormModal;
