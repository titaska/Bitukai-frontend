import { useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Typography
} from "@mui/material";
import { STAFF_BASE } from "../constants/api";

type Props = {
  open: boolean;
  onClose: () => void;
  registrationNumber: string;
  onCreated: () => void;
};

async function readBodySafe(res: Response) {
  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

export default function AddStaffModal({ open, onClose, registrationNumber, onCreated }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(""); // ✅ nauja
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ kad matytum klaidą

  const disabled = useMemo(() => (
    !registrationNumber ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !phoneNumber.trim() ||
    !password.trim() ||          // ✅ privalomas
    pending
  ), [registrationNumber, firstName, lastName, email, phoneNumber, password, pending]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setError(null);
  };

  const handleClose = () => {
    if (!pending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (disabled) return;

    setPending(true);
    setError(null);

    try {
      // ✅ backend 400 rašė "Password field is required"
      // todėl siunčiam būtent "password"
      const payload = {
        registrationNumber,
        status: "ACTIVE", // jei pas tave backend laukia string; jei laukia skaičiaus palik 1
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        role: "STAFF",
        hireDate: new Date().toISOString(),
        password: password.trim(), // ✅ SVARBIAUSIA
      };

      const res = await fetch(`${STAFF_BASE}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readBodySafe(res));

      onCreated();
      resetForm();
      onClose();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Staff member</DialogTitle>

      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" sx={{ whiteSpace: "pre-wrap" }}>
              {error}
            </Typography>
          )}

          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
          />

          {/* ✅ privalomas password */}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            helperText="Required"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={pending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={disabled} variant="contained">
          {pending ? "Saving..." : "Add New"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
