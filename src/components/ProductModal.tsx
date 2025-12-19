import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";

import {
  ProductCreateDto,
  ProductDto,
  ProductType,
  ProductUpdateDto,
} from "../types/product";
import { TaxDto } from "../types/tax";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  registrationNumber: string;
  initial?: ProductDto | null;

  taxes: TaxDto[];

  onSubmit: (dto: ProductCreateDto | ProductUpdateDto) => Promise<void>;
};

export default function ProductModal({
  open,
  onClose,
  mode,
  registrationNumber,
  initial,
  onSubmit,
  taxes,
}: Props) {
  const [productType, setProductType] = useState<ProductType>("SERVICE");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [taxCode, setTaxCode] = useState("VAT");
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      setProductType(initial.productType);
      setName(initial.name ?? "");
      setDescription(initial.description ?? "");
      setBasePrice(Number(initial.basePrice ?? 0));
      setDurationMinutes(initial.durationMinutes ?? "");
      setTaxCode(initial.taxCode ?? "VAT");
      setStatus(Boolean(initial.status));
      return;
    }

    setProductType("SERVICE");
    setName("");
    setDescription("");
    setBasePrice(0);
    setDurationMinutes("");
    setTaxCode("VAT");
    setStatus(true);
  }, [open, mode, initial]);

  useEffect(() => {
    if (!open) return;
    if (mode !== "create") return;
    if (!taxes || taxes.length === 0) return;

    const exists = taxes.some((t) => String(t.name) === String(taxCode));
    if (!exists) setTaxCode(taxes[0].name);
  }, [open, mode, taxes, taxCode]);

  const noTaxes = !taxes || taxes.length === 0;

  const disabled = useMemo(() => {
    return (
      saving ||
      !registrationNumber ||
      !name.trim() ||
      !taxCode.trim() ||
      noTaxes
    );
  }, [saving, registrationNumber, name, taxCode, noTaxes]);

  const save = async () => {
    if (disabled) return;

    setSaving(true);
    try {
      if (mode === "create") {
        const dto: ProductCreateDto = {
          registrationNumber,
          productType,
          name: name.trim(),
          description: description ?? "",
          basePrice: Number(basePrice),
          durationMinutes: durationMinutes === "" ? null : Number(durationMinutes),
          taxCode: taxCode.trim(), 
          status,
        };
        await onSubmit(dto);
      } else {
        const dto: ProductUpdateDto = {
          name: name.trim(),
          description: description ?? "",
          basePrice: Number(basePrice),
          durationMinutes: durationMinutes === "" ? null : Number(durationMinutes),
          taxCode: taxCode.trim(), 
          status,
        };
        await onSubmit(dto);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Add Product/Service" : "Edit Product/Service"}
      </DialogTitle>

      <DialogContent>
        <Stack gap={2} mt={1}>
          {mode === "create" && (
            <TextField
              select
              label="Type"
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              fullWidth
            >
              <MenuItem value="SERVICE">SERVICE</MenuItem>
              <MenuItem value="ITEM">ITEM</MenuItem>
            </TextField>
          )}

          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <TextField
            type="number"
            label="Price"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value === "" ? 0 : Number(e.target.value))}
            fullWidth
          />

          <TextField
            type="number"
            label="Duration"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value === "" ? "" : Number(e.target.value))}
            fullWidth
          />

          <TextField
            select
            label="Tax"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            fullWidth
            disabled={noTaxes}
            helperText={noTaxes ? "No taxes found. Create at least one tax in Settings." : " "}
          >
            {taxes.map((t) => (
              <MenuItem key={t.id} value={t.name}>
                {t.name} — {t.percentage}%
              </MenuItem>
            ))}
          </TextField>

          {noTaxes && (
            <Typography sx={{ color: "error.main" }}>
              You must create at least one tax before saving products.
            </Typography>
          )}

          <FormControlLabel
            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
            label={status ? "Active" : "Inactive"}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={save} disabled={disabled}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
