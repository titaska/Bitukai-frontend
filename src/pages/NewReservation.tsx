import React, { useState } from "react";
import "./NewReservation.css";
import { staffData as initialStaffData } from "../mock/staff";
import TimeSlotSelector from "../components/TimeSlotSelector";

export default function NewReservation() {
  const [staffData, setStaffData] = useState(initialStaffData); // now editable!

  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientSurname, setClientSurname] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSlotSelect(staffId: number, slotTime: string, taken: boolean) {
    if (taken) return;
    setSelectedStaff(staffId);
    setSelectedSlot(slotTime);
  }

  function handleSubmit() {
    if (!selectedStaff || !selectedSlot) {
      alert("Please select a staff member and time slot");
      return;
    }

    const updated = staffData.map((s) => {
      if (s.id !== selectedStaff) return s;

      return {
        ...s,
        slots: s.slots.map((slot) =>
          slot.time === selectedSlot ? { ...slot, taken: true } : slot
        ),
      };
    });

    setStaffData(updated);

    console.log("Appointment booked:", {
      staff: selectedStaff,
      time: selectedSlot,
      name: clientName,
      surname: clientSurname,
      phone: clientPhone,
      notes,
    });

    alert("Appointment added (mock)");

    setSelectedStaff(null);
    setSelectedSlot(null);
    setClientName("");
    setClientSurname("");
    setClientPhone("");
    setNotes("");
  }

  return (
    <div className="reservation-container">
      <h1 className="header">Add appointment</h1>

      <TimeSlotSelector
        staff={staffData}
        selectedStaff={selectedStaff}
        selectedSlot={selectedSlot}
        onSelect={handleSlotSelect}
      />

      <div className="client-info">
        <label>
          Name:
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>

        <label>
          Surname:
          <input
            value={clientSurname}
            onChange={(e) => setClientSurname(e.target.value)}
          />
        </label>

        <label>
          Phone number:
          <input
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </label>
      </div>

      <div className="notes-section">
        <label>Notes:</label>
        <textarea
          className="notes-box"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="submit-container">
        <button className="cancel-btn">Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>
          Add appointment
        </button>
      </div>
    </div>
  );
}
