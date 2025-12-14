import React, { useEffect, useState } from "react";
import "./NewReservation.css";

const API_BASE = "http://localhost:5089/api";

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
  const [staff, setStaff] = useState<Staff[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  /* ---------- SELECTIONS ---------- */
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  /* ---------- TIME ---------- */
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");

  /* ---------- CLIENT ---------- */
  const [clientName, setClientName] = useState("");
  const [clientSurname, setClientSurname] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  /* ================= FETCH LOCATIONS ================= */

  useEffect(() => {
    fetch(`${API_BASE}/business`)
      .then(res => res.json())
      .then(data => setBusinesses(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ================= FETCH STAFF ================= */

  useEffect(() => {
    fetch(`${API_BASE}/staff`)
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch(console.error);
  }, []);

  /* ================= FETCH TAKEN SLOTS ================= */

  useEffect(() => {
    if (!selectedStaff || !selectedDate) return;

    fetch(
      `${API_BASE}/reservations/availability?employeeId=${selectedStaff}&date=${selectedDate}`
    )
      .then(res => res.json())
      .then((data: string[]) => {
        // normalize to YYYY-MM-DDTHH:mm:00
        const normalized = data.map(d => d.substring(0, 19));
        setTakenSlots(normalized);
      })
      .catch(console.error);
  }, [selectedStaff, selectedDate]);

  /* ================= SLOT GENERATION ================= */

  function generateSlots(): string[] {
    if (!selectedProduct) return [];

    const slots: string[] = [];
    const startMinutes = 9 * 60;
    const endMinutes = 18 * 60;
    const step = selectedProduct.durationMinutes;

    let current = startMinutes;

    while (current + step <= endMinutes) {
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

  function isSlotTaken(slot: string): boolean {
    if (!selectedDate) return false;

    const start = slot.split(" - ")[0];
    const iso = `${selectedDate}T${start}:00`;

    return takenSlots.includes(iso);
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit() {
    if (
      !selectedBusiness ||
      !selectedStaff ||
      !selectedProduct ||
      !selectedDate ||
      !selectedTime
    ) {
      alert("Please fill all required fields");
      return;
    }

    const startTime = new Date(
      `${selectedDate}T${selectedTime.split(" - ")[0]}:00`
    ).toISOString();

    const res = await fetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationNumber: selectedBusiness,
        employeeId: selectedStaff,
        serviceProductId: selectedProduct.productId,
        startTime,
        durationMinutes: selectedProduct.durationMinutes,
        clientName,
        clientSurname,
        clientPhone,
        notes,
      }),
    });

    if (!res.ok) {
      alert("Failed to add appointment");
      return;
    }

    alert("Appointment created");
    setSelectedTime("");

    // refresh taken slots
    const refreshed = await fetch(
      `${API_BASE}/reservations/availability?employeeId=${selectedStaff}&date=${selectedDate}`
    ).then(r => r.json());

    setTakenSlots(refreshed.map((d: string) => d.substring(0, 19)));
  }

  /* ================= RENDER ================= */

  return (
    <div className="reservation-container">
      <h1>Add appointment</h1>

      <div className="selectors">
        <select
          value={selectedBusiness}
          onChange={e => setSelectedBusiness(e.target.value)}
        >
          <option value="">Select location</option>
          {businesses.map(b => (
            <option key={b.registrationNumber} value={b.registrationNumber}>
              {b.name} ({b.location})
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

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>

      <select
        value={selectedStaff}
        onChange={e => setSelectedStaff(e.target.value)}
      >
        <option value="">Select staff</option>
        {staff.map(s => (
          <option key={s.staffId} value={s.staffId}>
            {s.firstName} {s.lastName}
          </option>
        ))}
      </select>

      <div className="slot-list">
        {generateSlots().map(slot => {
          const taken = isSlotTaken(slot);
          const selected = selectedTime === slot;

          return (
            <button
              key={slot}
              disabled={taken}
              className={`slot ${taken ? "taken" : ""} ${
                selected ? "selected" : ""
              }`}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <div className="client-info">
        <input
          placeholder="Name"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
        />
        <input
          placeholder="Surname"
          value={clientSurname}
          onChange={e => setClientSurname(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={clientPhone}
          onChange={e => setClientPhone(e.target.value)}
        />
      </div>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Add appointment
      </button>
    </div>
  );
}
