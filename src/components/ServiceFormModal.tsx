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
  const [price, setPrice] = useState<string>("");
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
    } else {
      setName("");
      setPrice("");
    }
    setPriceError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setPriceError("Price must be a non-negative number");
      return;
    }

    const payload: ServiceCreateUpdate = {
      name,
      price: numericPrice,
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
              onChange={(e) => {
                setPrice(e.target.value);
                setPriceError(null);
              }}
              required
              inputProps={{ step: "0.01", min: 0 }}
              error={!!priceError}
              helperText={priceError ?? ""}
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
