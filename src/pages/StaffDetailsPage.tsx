import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { API_BASE, PRODUCTS_BASE } from "../constants/api";

type BusinessType = "CATERING" | "BEAUTY";

type Props = {
  registrationNumber: string;
  businessType: BusinessType; 
};

type StaffDto = {
  staffId: string;
  registrationNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  hireDate: string;
  password: string | null;
};

type ProductDto = {
  productId: string;
  registrationNumber: string;
  type: "ITEM" | "SERVICE"; 
  name: string;
  description: string;
  basePrice: number;
  durationMinutes?: number | null;
  taxCode: string;
  status: boolean;
};

type AssignedRow = {
  productId: string;
  productName: string;
  basePrice: number;
};

async function readBodySafe(res: Response) {
  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

type StaffUpdateDto = {
  status: "ACTIVE" | "INACTIVE";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passwordHash?: string;
};

export default function StaffDetailsPage({ registrationNumber, businessType }: Props) {
  const { staffId } = useParams<{ staffId: string }>();

  const [staff, setStaff] = useState<StaffDto | null>(null);
  const [assigned, setAssigned] = useState<AssignedRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);
  const [options, setOptions] = useState<ProductDto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [errorText, setErrorText] = useState<string | null>(null);

  const allowedType: "ITEM" | "SERVICE" = businessType === "CATERING" ? "ITEM" : "SERVICE";
  const thingLabel = allowedType === "ITEM" ? "Item" : "Service";
  const thingLabelPlural = allowedType === "ITEM" ? "Items" : "Services";

  const effectiveRegNumber = useMemo(() => {
    return (registrationNumber || staff?.registrationNumber || "").trim();
  }, [registrationNumber, staff?.registrationNumber]);

  const hydrateFormFromStaff = useCallback((s: StaffDto) => {
    setStatus(String(s.status).toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    setFirstName(s.firstName ?? "");
    setLastName(s.lastName ?? "");
    setEmail(s.email ?? "");
    setPhoneNumber(s.phoneNumber ?? "");
    setNewPassword("");
  }, []);

  const loadStaff = useCallback(async () => {
    if (!staffId) return;

    const sRes = await fetch(`${API_BASE}/staff/${encodeURIComponent(staffId)}`);

    if (sRes.status === 404) {
      setStaff(null);
      return;
    }
    if (!sRes.ok) throw new Error(await readBodySafe(sRes));

    const staffJson = (await sRes.json()) as StaffDto;
    setStaff(staffJson);
    hydrateFormFromStaff(staffJson);
  }, [staffId, hydrateFormFromStaff]);

  const loadProducts = useCallback(async (): Promise<ProductDto[]> => {
    if (!effectiveRegNumber) return [];

    const res = await fetch(
      `${PRODUCTS_BASE}/products?type=${allowedType}&registrationNumber=${encodeURIComponent(
        effectiveRegNumber
      )}&page=1&limit=200`
    );

    if (!res.ok) throw new Error(await readBodySafe(res));
    const json = await res.json();
    const data: ProductDto[] = Array.isArray(json) ? json : (json?.data ?? []);
    return Array.isArray(data) ? data : [];
  }, [effectiveRegNumber, allowedType]);

  const loadAssigned = useCallback(async () => {
    if (!staffId || !effectiveRegNumber) {
      setAssigned([]);
      return;
    }

    const products = await loadProducts();

    const rows: AssignedRow[] = [];
    await Promise.all(
      products.map(async (p) => {
        const r = await fetch(`${PRODUCTS_BASE}/products/${encodeURIComponent(p.productId)}/staff`);
        if (!r.ok) return;

        const staffList = await r.json();
        const list = Array.isArray(staffList) ? staffList : [];

        const has = list.some((x: any) => String(x.staffId) === String(staffId));
        if (has) {
          rows.push({
            productId: p.productId,
            productName: p.name,
            basePrice: p.basePrice,
          });
        }
      })
    );

    setAssigned(rows);
  }, [staffId, effectiveRegNumber, loadProducts]);

  const loadOptions = useCallback(async () => {
    if (!effectiveRegNumber) {
      setOptions([]);
      return;
    }

    const products = await loadProducts();
    const assignedIds = new Set(assigned.map((a) => a.productId));
    const filtered = products.filter((p) => !assignedIds.has(p.productId));

    setOptions(filtered);
  }, [effectiveRegNumber, loadProducts, assigned]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setErrorText(null);
    try {
      await loadStaff();
    } catch (e: any) {
      setErrorText(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, [loadStaff]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!staffId || !effectiveRegNumber) return;
    loadAssigned().catch((e) => setErrorText(String(e?.message ?? e)));
  }, [staffId, effectiveRegNumber, loadAssigned]);

  useEffect(() => {
    if (!assignOpen) return;
    loadOptions().catch((e) => setErrorText(String(e?.message ?? e)));
  }, [assignOpen, loadOptions]);

  const canSave = useMemo(() => {
    return !!staff && !saving && firstName.trim() && lastName.trim() && email.trim();
  }, [staff, saving, firstName, lastName, email]);

  const saveStaff = async () => {
    if (!staffId || !staff || !canSave) return;

    setSaving(true);
    setErrorText(null);

    try {
      const dto: StaffUpdateDto = {
        status,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        ...(newPassword.trim() ? { passwordHash: newPassword.trim() } : {}),
      };

      const res = await fetch(`${API_BASE}/staff/${encodeURIComponent(staffId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error(await readBodySafe(res));

      const updated = (await res.json()) as StaffDto;
      setStaff(updated);
      hydrateFormFromStaff(updated);
      setEditing(false);
    } catch (e: any) {
      setErrorText(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (staff) hydrateFormFromStaff(staff);
    setEditing(false);
    setErrorText(null);
  };

  const unassign = async (productId: string) => {
    if (!staffId) return;

    setErrorText(null);

    const res = await fetch(
      `${PRODUCTS_BASE}/products/${encodeURIComponent(productId)}/staff/${encodeURIComponent(staffId)}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      setErrorText(await readBodySafe(res));
      return;
    }

    await loadAssigned();
  };

  const assign = async () => {
    if (!staffId || !selectedProductId) return;

    setErrorText(null);

    const payload = {
      staffId,
      status: true,
      validFrom: null,
      validTo: null,
    };

    const res = await fetch(
      `${PRODUCTS_BASE}/products/${encodeURIComponent(selectedProductId)}/staff`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      setErrorText(await readBodySafe(res));
      return;
    }

    setAssignOpen(false);
    setSelectedProductId("");
    await loadAssigned();
  };

  if (loading) {
    return (
      <Box sx={{ ml: "80px", p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!staff) {
    return (
      <Box sx={{ ml: "80px", p: 3 }}>
        <Typography>Staff not found</Typography>
        {errorText && (
          <Typography color="error" sx={{ mt: 1 }}>
            {errorText}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ ml: "80px", p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Staff member details
        </Typography>

        {!editing ? (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
        ) : (
          <Stack direction="row" gap={1}>
            <Button variant="outlined" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" onClick={saveStaff} disabled={!canSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </Stack>
        )}
      </Stack>

      {errorText && (
        <Paper sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <Typography color="error">{errorText}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack gap={2}>
          <Typography color="text.secondary">
            Employed on: {new Date(staff.hireDate).toLocaleDateString()}
          </Typography>

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            fullWidth
            disabled={!editing}
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <TextField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              disabled={!editing}
            />
            <TextField
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              disabled={!editing}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled={!editing}
            />
            <TextField
              label="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              disabled={!editing}
            />
          </Stack>

          <TextField
            label="New password (optional)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            disabled={!editing}
            helperText="If empty, password is not changed"
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography fontWeight={700}>Performed {thingLabelPlural}</Typography>
          <Button variant="contained" onClick={() => setAssignOpen(true)}>
            Add new
          </Button>
        </Stack>

        {assigned.length === 0 ? (
          <Typography color="text.secondary">No {thingLabelPlural.toLowerCase()} assigned</Typography>
        ) : (
          <Stack gap={1}>
            {assigned.map((s) => (
              <Paper key={s.productId} sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={600}>{s.productName}</Typography>
                    <Typography color="text.secondary">{s.basePrice} €</Typography>
                  </Box>
                  <Button variant="outlined" color="error" onClick={() => unassign(s.productId)}>
                    Unassign
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign {thingLabel}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label={thingLabel}
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            sx={{ mt: 1 }}
            helperText={options.length === 0 ? `No available ${thingLabelPlural.toLowerCase()} to assign` : " "}
          >
            {options.map((p) => (
              <MenuItem key={p.productId} value={p.productId}>
                {p.name} — {p.basePrice} €
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setAssignOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={assign} disabled={!selectedProductId || options.length === 0}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
