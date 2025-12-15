import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@mui/material";
import { STAFF_BASE, PRODUCTS_BASE } from "../constants/api";
import AddStaffModal from "../components/AddStaffModal";

type BusinessType = "CATERING" | "BEAUTY";

type Props = {
  registrationNumber: string;
  businessType: BusinessType; 
};

type StaffDto = {
  staffId: string;              
  registrationNumber: string;
  status: any;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: any;
  hireDate: string;
};

type ProductDto = {
  productId: string;
  registrationNumber: string;
  type: "ITEM" | "SERVICE"; 
  name: string;
};

async function readBodySafe(res: Response) {
  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

export default function StaffListPage({ registrationNumber, businessType }: Props) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<StaffDto[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [staffProducts, setStaffProducts] = useState<Record<string, string[]>>({});

  const allowedType: "ITEM" | "SERVICE" = businessType === "CATERING" ? "ITEM" : "SERVICE";
  const colTitle = allowedType === "ITEM" ? "Items" : "Services";

  const loadStaff = useCallback(async () => {
    if (!registrationNumber) { setRows([]); return; }

    const res = await fetch(
      `${STAFF_BASE}/staff?registrationNumber=${encodeURIComponent(registrationNumber)}`
    );
    if (!res.ok) throw new Error(await readBodySafe(res));

    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }, [registrationNumber]);

  const loadStaffProductsMap = useCallback(async () => {
    if (!registrationNumber) { setStaffProducts({}); return; }

    const pRes = await fetch(
      `${PRODUCTS_BASE}/products?type=${allowedType}&registrationNumber=${encodeURIComponent(registrationNumber)}&page=1&limit=200`
    );
    if (!pRes.ok) throw new Error(await readBodySafe(pRes));

    const pJson = await pRes.json();
    const products: ProductDto[] = Array.isArray(pJson) ? pJson : (pJson?.data ?? []);
    const list = Array.isArray(products) ? products : [];

    const map: Record<string, string[]> = {};

    await Promise.all(
      list.map(async (p) => {
        const r = await fetch(`${PRODUCTS_BASE}/products/${encodeURIComponent(p.productId)}/staff`);
        if (!r.ok) return;

        const staffList = await r.json();
        const staffArr = Array.isArray(staffList) ? staffList : [];

        staffArr.forEach((s: any) => {
          const id = String(s.staffId);
          if (!map[id]) map[id] = [];
          map[id].push(p.name);
        });
      })
    );

    Object.keys(map).forEach((k) => {
      map[k] = Array.from(new Set(map[k]));
    });

    setStaffProducts(map);
  }, [registrationNumber, allowedType]);

  const loadAll = useCallback(async () => {
    if (!registrationNumber) { setRows([]); setStaffProducts({}); return; }

    setLoading(true);
    try {
      await loadStaff();

      try {
        await loadStaffProductsMap();
      } catch (e) {
        console.error("loadStaffProductsMap failed:", e);
        setStaffProducts({});
      }
    } catch (e) {
      console.error(e);
      setRows([]);
      setStaffProducts({});
    } finally {
      setLoading(false);
    }
  }, [registrationNumber, loadStaff, loadStaffProductsMap]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const servicesText = useCallback((staffId: string) => {
    const list = staffProducts[staffId] ?? [];
    return list.length ? list.join(", ") : "—";
  }, [staffProducts]);

  const canAdd = useMemo(() => !!registrationNumber, [registrationNumber]);

  return (
    <Box sx={{ ml: "80px", p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Staff members</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} disabled={!canAdd}>
          Add New
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>{colTitle}</b></TableCell>
              <TableCell><b>Employed on</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.staffId} hover>
                <TableCell>{s.firstName} {s.lastName}</TableCell>
                <TableCell sx={{ color: "#666" }}>{servicesText(s.staffId)}</TableCell>
                <TableCell>{new Date(s.hireDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => navigate(`/staff/${s.staffId}`)}>
                    Edit details
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 6, textAlign: "center", color: "#777" }}>
                  {loading ? "Loading..." : "No staff found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <AddStaffModal
        open={open}
        onClose={() => setOpen(false)}
        registrationNumber={registrationNumber}
        onCreated={() => loadAll()} 
      />
    </Box>
  );
}
