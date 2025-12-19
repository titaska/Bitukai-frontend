// src/components/TaxFormModal.tsx
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
import { TaxCreateUpdate } from "../types/tax";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaxCreateUpdate, idToUpdate?: string) => Promise<void> | void;
  editingId?: string | null;
  initialData?: TaxCreateUpdate | null;
};

const TaxFormModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  editingId,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setDescription(initialData.description ?? "");
      setPercentage(String(initialData.percentage ?? ""));
    } else {
      setName("");
      setDescription("");
      setPercentage("");
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pct = Number(percentage);
    if (!Number.isFinite(pct)) return;

    const payload: TaxCreateUpdate = {
      name: name.trim(),
      description: description.trim() ? description.trim() : null,
      percentage: pct,
    };

    await onSave(payload, editingId ?? undefined);
  };

  const pctNumber = Number(percentage);
  const pctValid = percentage !== "" && Number.isFinite(pctNumber) && pctNumber >= 0 && pctNumber <= 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingId ? "Edit tax" : "New tax"}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={2}
            />

            <TextField
              label="Percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              inputProps={{ step: "0.01", min: 0, max: 100 }}
              required
              error={!pctValid && percentage !== ""}
              helperText={!pctValid && percentage !== "" ? "Įvesk skaičių 0–100" : " "}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!name.trim() || !pctValid}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaxFormModal;
