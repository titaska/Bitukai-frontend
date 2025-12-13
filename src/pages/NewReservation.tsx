import React, { useState } from "react";
import "./NewReservation.css";
import { staffData } from "../mock/staff";
import { createReservation } from "../api/ReservationsApi";

export default function NewReservation() {
  // top controls
  const [location, setLocation] = useState("Location 1");
  const [selectedService, setSelectedService] = useState("HAIRCUT");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // slot selection
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // client info
  const [clientName, setClientName] = useState("");
  const [clientSurname, setClientSurname] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSlotSelect(staffId: number, slotTime: string, taken: boolean) {
    if (taken) return;
    setSelectedStaff(staffId);
    setSelectedSlot(slotTime);
  }

  async function handleSubmit() {
    if (!selectedStaff || !selectedSlot) {
      alert("Please select a staff member and time slot");
      return;
    }

    try {
      await createReservation({
        registrationNumber: "123456789", // mock business for now
        serviceProductId: selectedService,
        employeeId: selectedStaff.toString(),
        startTime: new Date(
          `${selectedDate} ${selectedSlot.split(" - ")[0]}`
        ).toISOString(),
        durationMinutes: 30,
        clientName,
        clientSurname,
        clientPhone,
        notes,
      });

      alert("Appointment added");
    } catch (err: any) {
      console.error(err);
      alert("Failed to add appointment");
    }
  }

  return (
    <div className="reservation-container">
      <h1 className="header">Add appointment</h1>

      {/* TOP FILTERS */}
      <div className="top-controls">
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option>Location 1</option>
          <option>Location 2</option>
          <option>Location 3</option>
        </select>

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="HAIRCUT">Haircut</option>
          <option value="MASSAGE">Massage</option>
          <option value="BROWS">Brows</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* STAFF + TIME SLOTS */}
      <div className="staff-section">
        {staffData.map((staff) => (
          <div key={staff.id} className="staff-column">
            <h2>{staff.name}</h2>

            <div className="slot-list">
              {staff.slots.map((slot) => {
                const isSelected =
                  selectedStaff === staff.id &&
                  selectedSlot === slot.time;

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
                    onClick={() =>
                      handleSlotSelect(staff.id, slot.time, slot.taken)
                    }
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CLIENT INFO */}
      <div className="client-info">
        <label>
          Name:
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
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

      {/* NOTES */}
      <div className="notes-section">
        <label>Notes:</label>
        <textarea
          className="notes-box"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="submit-container">
        <button className="cancel-btn">Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>
          Add appointment
        </button>
      </div>
    </div>
  );
}
