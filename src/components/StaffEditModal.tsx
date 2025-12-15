import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, MenuItem
} from "@mui/material";
import { StaffDto, StaffStatus } from "../types/staff";
import { StaffUpdateDto, updateStaff } from "../hooks/staffApi";

type Props = {
  open: boolean;
  onClose: () => void;
  staff: StaffDto;
  onSaved: (updated: StaffDto) => void;
};

type StatusOption = "ACTIVE" | "INACTIVE";

export default function StaffEditModal({ open, onClose, staff, onSaved }: Props) {
  const [status, setStatus] = useState<StatusOption>("ACTIVE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(""); // ✅ privalomas

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setStatus(String(staff.status).toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    setFirstName(staff.firstName ?? "");
    setLastName(staff.lastName ?? "");
    setEmail(staff.email ?? "");
    setPhoneNumber(staff.phoneNumber ?? "");
    setPassword(""); // kad vartotojas įvestų naują
    setError(null);
  }, [open, staff]);

  const disabled = useMemo(() => {
    return (
      saving ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() // ✅ privalomas
    );
  }, [saving, firstName, lastName, email, password]);

  const save = async () => {
    if (disabled) return;

    setSaving(true);
    setError(null);

    try {
      const dto: StaffUpdateDto = {
        Status: status as unknown as StaffStatus,
        FirstName: firstName.trim(),
        LastName: lastName.trim(),
        Email: email.trim(),
        PhoneNumber: phoneNumber.trim(),
        Role: String(staff.role ?? ""),     // ✅ siunčiam esamą role (UI nekeičiam)
        Password: password.trim(),          // ✅ privalomas backend
      };

      const updated = await updateStaff(String(staff.staffId), dto);
      onSaved(updated);
      onClose();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit staff</DialogTitle>

      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          {error && <div style={{ color: "red" }}>{error}</div>}

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusOption)}
            fullWidth
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </TextField>

          <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
          <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth />

          {/* Role nerodom / nekeičiam, bet backend’ui siunčiam staff.role */}

          <TextField
            type="password"
            label="Password (required)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Backend requires Password for update"
            fullWidth
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
