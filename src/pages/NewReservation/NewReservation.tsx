import React, { useEffect, useState } from "react";
import "./NewReservation.css";
import { API_BASE } from "../../api/apiBase";

import { createReservation } from "../../hooks/useCreateReservation";
import { getTakenSlots } from "../../hooks/useTakenSlots";

/* ================= TYPES ================= */

interface Business {
  registrationNumber: string;
  name: string;
  location: string;
}

interface Staff {
  staffId: string;
  firstName: string;
  lastName: string;
}

interface Product {
  productId: string;
  name: string;
  durationMinutes: number;
}

/* ================= COMPONENT ================= */

export default function NewReservation() {
  /* ---------- DATA ---------- */
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  /* ---------- SELECTION ---------- */
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  /* ---------- TIME ---------- */
  const [takenSlots, setTakenSlots] = useState<Record<string, string[]>>({});
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  /* ---------- CLIENT ---------- */
  const [clientName, setClientName] = useState("");
  const [clientSurname, setClientSurname] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  /* ================= FETCH BUSINESS ================= */

  useEffect(() => {
    fetch(`${API_BASE}/business`)
      .then(r => r.json())
      .then(setBusinesses)
      .catch(console.error);
  }, []);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(res => setProducts(res.data ?? []))
      .catch(console.error);
  }, []);

  /* ================= FETCH STAFF FOR SERVICE ================= */

  useEffect(() => {
    if (!selectedProduct) return;

    fetch(`${API_BASE}/products/${selectedProduct.productId}/staff`)
      .then(r => r.json())
      .then(setStaff)
      .catch(console.error);
  }, [selectedProduct]);

  /* ================= FETCH AVAILABILITY ================= */

      useEffect(() => {
      if (!selectedDate || staff.length === 0) return;

      const load = async () => {
        const map: Record<string, string[]> = {};

       for (const s of staff) {
          const slots = await getTakenSlots(s.staffId, selectedDate);
          map[s.staffId] = slots.map(d => d.substring(11, 16));
        }

        setTakenSlots(map);
      };

      load();
    }, [selectedDate, staff]);

  /* ================= SLOT GENERATION ================= */

  function generateSlots(): string[] {
    if (!selectedProduct) return [];

    const slots: string[] = [];
    let current = 9 * 60;
    const end = 18 * 60;
    const step = selectedProduct.durationMinutes;

    while (current + step <= end) {
      const h1 = Math.floor(current / 60);
      const m1 = current % 60;
      const h2 = Math.floor((current + step) / 60);
      const m2 = (current + step) % 60;

      slots.push(
        `${h1.toString().padStart(2, "0")}:${m1
          .toString()
          .padStart(2, "0")} - ${h2
          .toString()
          .padStart(2, "0")}:${m2.toString().padStart(2, "0")}`
      );

      current += step;
    }

    return slots;
  }

  function isTaken(staffId: string, slot: string) {
    const start = slot.split(" - ")[0];
    return takenSlots[staffId]?.includes(start);
  }

  /* ================= SUBMIT ================= */

  

  async function handleSubmit() {
  if (!selectedStaff || !selectedTime || !selectedProduct) {
    alert("Missing data");
    return;
  }

  const start = `${selectedDate}T${selectedTime.split(" - ")[0]}:00`;

  try {
    await createReservation({
      registrationNumber: selectedBusiness,
      employeeId: selectedStaff,
      serviceProductId: selectedProduct.productId,
      startTime: new Date(start).toISOString(),
      durationMinutes: selectedProduct.durationMinutes,
      clientName,
      clientSurname,
      clientPhone,
      notes
    });

    alert("Appointment created");
    setSelectedTime("");
  } catch {
    alert("Failed to add appointment");
  }
  }


  /* ================= RENDER ================= */

  return (
    <div className="reservation-container">
      <h1>Add appointment</h1>

      <div className="selectors">
        <select onChange={e => setSelectedBusiness(e.target.value)}>
          <option value="">Select location</option>
          {businesses.map(b => (
            <option key={b.registrationNumber} value={b.registrationNumber}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          onChange={e =>
            setSelectedProduct(
              products.find(p => p.productId === e.target.value) || null
            )
          }
        >
          <option value="">Select service</option>
          {products.map(p => (
            <option key={p.productId} value={p.productId}>
              {p.name} ({p.durationMinutes} min)
            </option>
          ))}
        </select>

        <input type="date" onChange={e => setSelectedDate(e.target.value)} />
      </div>

      <div className="staff-columns">
        {staff.map(s => (
          <div key={s.staffId} className="staff-column">
            <h3>{s.firstName} {s.lastName}</h3>

            {generateSlots().map(slot => {
              const taken = isTaken(s.staffId, slot);
              const selected =
                selectedStaff === s.staffId && selectedTime === slot;

              return (
                <button
                  key={slot}
                  disabled={taken}
                  className={
                    taken
                      ? "slot taken"
                      : selected
                      ? "slot selected"
                      : "slot"
                  }
                  onClick={() => {
                    setSelectedStaff(s.staffId);
                    setSelectedTime(slot);
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="client-info">
        <input placeholder="Name" onChange={e => setClientName(e.target.value)} />
        <input placeholder="Surname" onChange={e => setClientSurname(e.target.value)} />
        <input placeholder="Phone" onChange={e => setClientPhone(e.target.value)} />
      </div>

      <textarea placeholder="Notes" onChange={e => setNotes(e.target.value)} />

      <button className="submit-btn" onClick={handleSubmit}>
        Add appointment
      </button>
    </div>
  );
}
