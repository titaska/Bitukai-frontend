import React, { useState } from "react";
import "./NewReservation.css";
import { staffData } from "../mock/staff";

export default function NewReservation() {
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

    console.log("Appointment booked:", {
      staff: selectedStaff,
      time: selectedSlot,
      name: clientName,
      surname: clientSurname,
      phone: clientPhone,
      notes,
    });

    alert("Appointment added (mock)");
  }

  return (
    <div className="reservation-container">
      <h1 className="header">Add appointment</h1>

      <div className="staff-section">
        {staffData.map((staff) => (
          <div key={staff.id} className="staff-column">
            <h2>{staff.name}</h2>

            <div className="slot-list">
              {staff.slots.map((slot) => {
                const isSelected = selectedStaff === staff.id && selectedSlot === slot.time;

                return (
                  <button
                    key={slot.time}
                    className={
                      slot.taken
                        ? "slot taken"
                        : isSelected
                        ? "slot selected"
                        : "slot"
                    }
                    onClick={() => handleSlotSelect(staff.id, slot.time, slot.taken)}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="client-info">
        <label>
          Name:
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>

        <label>
          Surname:
          <input value={clientSurname} onChange={(e) => setClientSurname(e.target.value)} />
        </label>

        <label>
          Phone number:
          <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
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

