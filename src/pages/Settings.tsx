import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import ProductModal from "../components/ProductModal";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../hooks/productsApi";
import { ProductDto} from "../types/ProductDto";

import TaxFormModal from "../components/TaxFormModal";
import { taxApi } from "../hooks/taxApi";
import { TaxCreateUpdate, TaxDto } from "../types/tax";

type Props = { registrationNumber: string };

export default function Settings({ registrationNumber }: Props) {
  /* ======================================================
     TAXES
  ====================================================== */
  const [taxes, setTaxes] = useState<TaxDto[]>([]);
  const [taxLoading, setTaxLoading] = useState(false);
  const [taxError, setTaxError] = useState<string | null>(null);

  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
  const [editingTaxData, setEditingTaxData] = useState<TaxCreateUpdate | null>(null);

  const loadTaxes = useCallback(async () => {
    setTaxLoading(true);
    setTaxError(null);
    try {
      const list = await taxApi.getAll();
      setTaxes(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.error("Failed to load taxes:", e);
      setTaxError(String(e?.message ?? e));
      setTaxes([]);
    } finally {
      setTaxLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTaxes();
  }, [loadTaxes]);

  const openCreateTax = () => {
    setEditingTaxId(null);
    setEditingTaxData(null);
    setTaxModalOpen(true);
  };

  const openEditTax = (t: TaxDto) => {
    setEditingTaxId(t.id);
    setEditingTaxData({
      name: t.name,
      description: t.description ?? null,
      percentage: t.percentage,
    });
    setTaxModalOpen(true);
  };

  const saveTax = useCallback(
    async (data: TaxCreateUpdate, id?: string) => {
      try {
        setTaxError(null);
        if (id) await taxApi.update(id, data);
        else await taxApi.create(data);

        setTaxModalOpen(false);
        await loadTaxes();
      } catch (e: any) {
        setTaxError(String(e?.message ?? e));
      }
    },
    [loadTaxes]
  );

  const deleteTax = useCallback(
    async (id: string) => {
      if (!window.confirm("Delete this tax?")) return;
      try {
        await taxApi.delete(id);
        await loadTaxes();
      } catch (e: any) {
        setTaxError(String(e?.message ?? e));
      }
    },
    [loadTaxes]
  );

  const taxLabelByCode = useMemo(() => {
    const map = new Map<string, string>();
    taxes.forEach((t) => {
      map.set(String(t.name), `${t.name} — ${t.percentage}%`);
      map.set(String(t.id), `${t.name} — ${t.percentage}%`);
    });
    return map;
  }, [taxes]);

  /* ======================================================
     PRODUCTS & SERVICES
  ====================================================== */
  const [rows, setRows] = useState<ProductDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProductDto | null>(null);

  const loadProducts = useCallback(async () => {
    if (!registrationNumber) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      const res = await listProducts({
        registrationNumber,
        search: search || undefined,
        page: 1,
        limit: 200,
      });

      const data = Array.isArray(res?.data) ? res.data : [];

      setRows(
        data.map((p: any) => ({
          ...p,
          productType: String(p.productType ?? ""),
        }))
      );
    } catch (e) {
      console.error("Failed to load products:", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [registrationNumber, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const t = setTimeout(() => loadProducts(), 250);
    return () => clearTimeout(t);
  }, [search, loadProducts]);

  const filteredRows = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((p) => !s || (p.name ?? "").toLowerCase().includes(s));
  }, [rows, search]);

  const handleCreate = useCallback(
    async (dto: any) => {
      await createProduct(dto);
      await loadProducts();
    },
    [loadProducts]
  );

  const handleEdit = useCallback(
    async (dto: any) => {
      if (!editItem) return;
      await updateProduct(editItem.productId, dto);
      await loadProducts();
    },
    [editItem, loadProducts]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      if (!window.confirm("Delete this item?")) return;
      await deleteProduct(productId);
      await loadProducts();
    },
    [loadProducts]
  );

  return (
    <Box sx={{ ml: "80px", p: 3 }}>
      {/* ---------- PRODUCTS ---------- */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Products & Services
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
          disabled={!registrationNumber}
        >
          Add new
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography fontWeight={700}>Search</Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 320 }}
          />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Tax</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((p) => (
              <TableRow key={p.productId} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.productType}</TableCell>
                <TableCell>{p.basePrice} €</TableCell>

                <TableCell>
                  {taxLabelByCode.get(String(p.taxCode)) ?? p.taxCode ?? "—"}
                </TableCell>

                <TableCell>{p.status ? "Active" : "Inactive"}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => { setEditItem(p); setModalOpen(true); }}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => handleDelete(p.productId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: "center", color: "#777" }}>
                  {loading ? "Loading..." : "No items"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={editItem ? "edit" : "create"}
        registrationNumber={registrationNumber}
        initial={editItem}
        onSubmit={editItem ? handleEdit : handleCreate}
        taxes={taxes}  
      />

      {/* ---------- TAXES ---------- */}
      <Divider sx={{ my: 4 }} />

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Taxes
        </Typography>
        <Button variant="contained" onClick={openCreateTax}>
          Add tax
        </Button>
      </Stack>

      {taxError && (
        <Paper sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "error.main" }}>
          <Typography color="error">{taxError}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Percentage</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {taxes.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.description ?? "—"}</TableCell>
                <TableCell>{t.percentage} %</TableCell>
                <TableCell align="right">
                  <Button onClick={() => openEditTax(t)}>Edit</Button>
                  <Button color="error" onClick={() => deleteTax(t.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {taxes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 6, textAlign: "center", color: "#777" }}>
                  {taxLoading ? "Loading..." : "No taxes"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <TaxFormModal
        open={taxModalOpen}
        onClose={() => setTaxModalOpen(false)}
        onSave={saveTax}
        editingId={editingTaxId}
        initialData={editingTaxData}
      />
    </Box>
  );
}
