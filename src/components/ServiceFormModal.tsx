// src/components/ServiceFormModal.tsx
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
import { ServiceCreateUpdate } from "../types/service";

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    data: ServiceCreateUpdate,
    idToUpdate?: number
  ) => Promise<void> | void;
  // jei redaguojam – perduosim pirmines reikšmes
  initialData?: ServiceCreateUpdate | null;
  editingId?: number | null;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  editingId,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("1236.23");
  const [createdOn, setCreatedOn] = useState("2024-12-11");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setCreatedOn(initialData.createdOn);
    } else {
      setName("");
      setPrice("1236.23");
      setCreatedOn("2024-12-11");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ServiceCreateUpdate = {
      name,
      price: Number(price),
      createdOn,
    };

    await onSave(payload, editingId ?? undefined);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingId ? "Edit service details" : "New service details"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <TextField
              label="Created on"
              type="date"
              fullWidth
              value={createdOn}
              onChange={(e) => setCreatedOn(e.target.value)}
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

export default ServiceFormModal;
