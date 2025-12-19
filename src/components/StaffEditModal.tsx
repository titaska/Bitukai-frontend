import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { StaffDto, StaffStatus, StaffUpdate } from "../types/staff";
import { staffApi } from "../hooks/staffApi";

type Props = {
  open: boolean;
  onClose: () => void;
  staff: StaffDto;
  onSaved: (updated: StaffDto) => void;
};

type StatusOption = "ACTIVE" | "INACTIVE";

function statusToOption(s: StaffStatus): StatusOption {
  return s === StaffStatus.INACTIVE ? "INACTIVE" : "ACTIVE";
}

function optionToStatus(opt: StatusOption): StaffStatus {
  return opt === "INACTIVE" ? StaffStatus.INACTIVE : StaffStatus.ACTIVE;
}

export default function StaffEditModal({ open, onClose, staff, onSaved }: Props) {
  const [status, setStatus] = useState<StatusOption>("ACTIVE");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setStatus(statusToOption(staff.status));
    setFirstName(staff.firstName ?? "");
    setLastName(staff.lastName ?? "");
    setEmail(staff.email ?? "");
    setPhoneNumber(staff.phoneNumber ?? "");
    setPassword(""); // backend reikalauja password per update
    setError(null);
  }, [open, staff]);

  const disabled = useMemo(() => {
    return (
      saving ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password.trim()
    );
  }, [saving, firstName, lastName, email, phoneNumber, password]);

  const save = async () => {
    if (disabled) return;

    setSaving(true);
    setError(null);

    try {
      const dto: StaffUpdate = {
        status: optionToStatus(status),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        role: staff.role,
        hireDate: staff.hireDate || new Date().toISOString(),
        password: password.trim(),
      };

      const updated = await staffApi.update(staff.staffId, dto);
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
          {error && (
            <Typography color="error" sx={{ whiteSpace: "pre-wrap" }}>
              {error}
            </Typography>
          )}

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

          <TextField
            type="password"
            label="Password (required)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Backend requires password for update"
            fullWidth
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
