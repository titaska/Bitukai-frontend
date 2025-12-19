import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  MenuItem,
} from "@mui/material";

import { BusinessType } from "../types/business";
import { TaxDto } from "../types/tax";
import { ProductDto } from "../types/ProductDto";
import { ProductCreateDto, ProductType, ProductUpdateDto } from "../types/Product";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  registrationNumber: string;
  businessType: BusinessType;
  initial?: ProductDto | null;
  taxes: TaxDto[];
  onSubmit: (dto: ProductCreateDto | ProductUpdateDto) => Promise<void>;
};

function forcedTypeByBusiness(businessType: BusinessType): ProductType {
  return businessType === "CATERING" ? "ITEM" : "SERVICE";
}

function toProductType(value: unknown, fallback: ProductType): ProductType {
  const v = String(value ?? "");
  return v === "SERVICE" || v === "ITEM" ? (v as ProductType) : fallback;
}

export default function ProductModal({
  open,
  onClose,
  mode,
  registrationNumber,
  businessType,
  initial,
  onSubmit,
  taxes,
}: Props) {
  const forcedType = useMemo(() => forcedTypeByBusiness(businessType), [businessType]);

  const [productType, setProductType] = useState<ProductType>(forcedType);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [taxCode, setTaxCode] = useState(""); // ✅ laikom TAX ID
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  const noTaxes = !taxes || taxes.length === 0;

  useEffect(() => {
    if (!open) return;

    setErrorText("");

    if (mode === "edit" && initial) {
      setProductType(toProductType(initial.productType, forcedType));
      setName(initial.name ?? "");
      setDescription(initial.description ?? "");
      setBasePrice(Number(initial.basePrice ?? 0));
      setDurationMinutes(initial.durationMinutes ?? "");

      // ✅ jei initial.taxCode netyčia name – fallback į pirmą tax id
      setTaxCode(initial.taxCode ?? taxes?.[0]?.id ?? "");

      setStatus(Boolean(initial.status));
      return;
    }

    // Create: visada priverstinis tipas pagal sektorių
    setProductType(forcedType);
    setName("");
    setDescription("");
    setBasePrice(0);
    setDurationMinutes("");

    // ✅ vietoj "VAT" – pirmo tax ID (jei yra)
    setTaxCode(taxes?.[0]?.id ?? "");

    setStatus(true);
  }, [open, mode, initial, forcedType, taxes]);

  useEffect(() => {
    if (!open) return;
    if (mode !== "create") return;
    if (!taxes || taxes.length === 0) return;

    // ✅ tikrinam pagal ID, ne pagal name
    const exists = taxes.some((t) => String(t.id) === String(taxCode));
    if (!exists) setTaxCode(String(taxes[0].id));
  }, [open, mode, taxes, taxCode]);

  const effectiveType = mode === "create" ? forcedType : productType;

  const durationRequired = effectiveType === "SERVICE";

  const disabled = useMemo(() => {
    return (
      saving ||
      !registrationNumber ||
      !name.trim() ||
      !taxCode.trim() ||
      noTaxes ||
      (durationRequired && (durationMinutes === "" || Number(durationMinutes) <= 0))
    );
  }, [saving, registrationNumber, name, taxCode, noTaxes, durationRequired, durationMinutes]);

  const save = async () => {
    if (disabled) return;

    setSaving(true);
    setErrorText("");

    // Backend enum: ITEM=0, SERVICE=1
    const productTypeNumber: 0 | 1 = businessType === "CATERING" ? 0 : 1;
    const isCatering = businessType === "CATERING";
    const durationToSend = isCatering ? 0 : (durationMinutes === "" ? null : Number(durationMinutes));

    try {
      if (mode === "create") {
        const dto: ProductCreateDto = {
          registrationNumber,
          type: productTypeNumber,
          name: name.trim(),
          description: description ?? "",
          basePrice: Number(basePrice),
          durationMinutes: durationToSend,
          taxCode: taxCode.trim(), // ✅ čia bus TAX ID
          status,
        };
        await onSubmit(dto);
      } else {
        const dto: ProductUpdateDto = {
          name: name.trim(),
          description: description ?? "",
          basePrice: Number(basePrice),
          durationMinutes: durationToSend,
          taxCode: taxCode.trim(), // ✅ čia bus TAX ID
          status,
        };
        await onSubmit(dto);
      }

      onClose();
    } catch (e: any) {
      console.error("Failed to save product:", e);
      setErrorText(e?.response?.data?.message || e?.message || "Failed to save.");
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
          <TextField label="Type" value={effectiveType} fullWidth disabled />

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
            disabled={effectiveType === "ITEM"}
            helperText={
              effectiveType === "ITEM"
                ? "Items do not require duration."
                : "Duration is required for services."
            }
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
              <MenuItem key={t.id} value={t.id}>
                {t.name} — {t.percentage}%
              </MenuItem>
            ))}
          </TextField>

          {noTaxes && (
            <Typography sx={{ color: "error.main" }}>
              You must create at least one tax before saving products.
            </Typography>
          )}

          {!!errorText && <Typography sx={{ color: "error.main" }}>{errorText}</Typography>}

          <FormControlLabel
            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
            label={status ? "Active" : "Inactive"}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={disabled}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
