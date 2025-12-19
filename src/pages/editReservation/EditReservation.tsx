import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditReservation.css";
import { API_BASE } from "../../constants/api";
import { updateReservation } from "../../hooks/updateReservation";
import { getTakenSlots } from "../../hooks/useTakenSlots";
import { getSpecificReservation } from "../../hooks/getSpecificReservation";
import { ReservationBusiness } from "../../types/business";
import { ReservationStaff } from "../../types/staff";
import { ReservationProduct } from "../../types/Product";
import { Reservation } from "../../types/reservation";
import { useBusiness } from "../../types/BusinessContext";
import { filterByRegistrationNumber } from "../../utils/filterByRegistrationNumber";

/* ================= COMPONENT ================= */
export default function EditReservation() {
  /* ---------- DATA ---------- */
  const [businesses, setBusinesses] = useState<ReservationBusiness[]>([]);
  const [products, setProducts] = useState<ReservationProduct[]>([]);
  const [staff, setStaff] = useState<ReservationStaff[]>([]);

  /* ---------- SELECTION ---------- */
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ReservationProduct | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  /* ---------- TIME ---------- */
  const [takenSlots, setTakenSlots] = useState<Reservation[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  /* ---------- CLIENT ---------- */
  const [clientName, setClientName] = useState("");
  const [clientSurname, setClientSurname] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();
  const { registrationNumber } = useBusiness();
  const visibleBusinesses = filterByRegistrationNumber(businesses, registrationNumber);
  const visibleProducts = filterByRegistrationNumber(products, registrationNumber);
  const visibleStaff = filterByRegistrationNumber(staff, registrationNumber);

  const today = new Date().toISOString().split("T")[0];
  const { appointmentId } = useParams<{ appointmentId: string }>();

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

  /* ================= FETCH RESERVATION ================= */
  useEffect(() => {
    if (!appointmentId) return;

    const loadReservation = async () => {
      const reservation = await getSpecificReservation(appointmentId);
      if (!reservation) return;

      // Populate state with reservation data
      setSelectedBusiness(reservation.registrationNumber);
      setSelectedProduct(products.find(p => p.productId === reservation.serviceProductId) || null);
      setSelectedStaff(reservation.employeeId);

      // Convert startTime to date and time slot
      const dateObj = new Date(reservation.startTime);
      const startHours = dateObj.getHours().toString().padStart(2, "0");
      const startMinutes = dateObj.getMinutes().toString().padStart(2, "0");

      const endDate = new Date(dateObj.getTime() + reservation.durationMinutes * 60000);
      const endHours = endDate.getHours().toString().padStart(2, "0");
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

      setSelectedDate(dateObj.toISOString().split("T")[0]);
      setSelectedTime(`${startHours}:${startMinutes} - ${endHours}:${endMinutes}`);

      setClientName(reservation.clientName);
      setClientSurname(reservation.clientSurname);
      setClientPhone(reservation.clientPhone);
      setNotes(reservation.notes || "");
    };

    loadReservation();
  }, [appointmentId, products]);

  /* ================= FETCH AVAILABILITY ================= */
  useEffect(() => {
    if (!selectedDate || staff.length === 0) return;

    const load = async () => {
      const all: Reservation[] = [];

      for (const s of staff) {
        const reservations = await getTakenSlots(s.staffId, selectedDate);
        all.push(...reservations);
      }

      setTakenSlots(all);
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

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function isTaken(staffId: string, slot: string) {
    const [from, to] = slot.split(" - ");

    const slotStart = timeToMinutes(from);
    const slotEnd = timeToMinutes(to);

    return takenSlots.some(r => {
      if (r.employeeId !== staffId) return false;

      const start = new Date(r.startTime);
      const localMinutes = start.getHours() * 60 + start.getMinutes();
      const end = localMinutes + r.durationMinutes;

      // overlap check
      return slotStart < end && slotEnd > localMinutes;
    });
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!selectedStaff || !selectedTime || !selectedProduct || !appointmentId) {
      alert("Missing data");
      return;
    }

    const start = `${selectedDate}T${selectedTime.split(" - ")[0]}:00`;

    const updatedReservation = {
      registrationNumber: selectedBusiness,
      employeeId: selectedStaff,
      serviceProductId: selectedProduct.productId,
      startTime: new Date(start).toISOString(),
      durationMinutes: selectedProduct.durationMinutes,
      clientName,
      clientSurname,
      clientPhone,
      notes
    };

    try {
      await updateReservation(appointmentId, updatedReservation);
      alert("Appointment updated");
      navigate("/");
    } catch {
      alert("Failed to update appointment");
    }
  }

  /* ================= RENDER ================= */
  return (
      <div className="reservation-container">
        <h1>Edit appointment</h1>

        <div className="selectors">
          <select
              value={selectedBusiness}
              onChange={e => setSelectedBusiness(e.target.value)}
          >
            <option value="">Select location</option>
            {visibleBusinesses.map(b => (
                <option key={b.registrationNumber} value={b.registrationNumber}>
                  {b.name} ({b.location})
                </option>
            ))}
          </select>

          <select
              value={selectedProduct?.productId || ""}
              onChange={e =>
                  setSelectedProduct(
                      products.find(p => p.productId === e.target.value) || null
                  )
              }
          >
            <option value="">Select service</option>
            {visibleProducts.map(p => (
                <option key={p.productId} value={p.productId}>
                  {p.name} ({p.durationMinutes} min)
                </option>
            ))}
          </select>

          <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={e => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="staff-columns">
          {visibleStaff.map(s => (
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
          Update appointment
        </button>
      </div>
  );
}