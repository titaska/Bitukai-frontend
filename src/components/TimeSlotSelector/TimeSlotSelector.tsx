import React from "react";
import "./TimeSlotSelector.css";

interface Slot {
  time: string;
  taken: boolean;
}

interface Staff {
  id: number;
  name: string;
  slots: Slot[];
}

interface Props {
  staff: Staff[];
  selectedStaff: number | null;
  selectedSlot: string | null;
  onSelect: (staffId: number, slotTime: string, taken: boolean) => void;
}

export default function TimeSlotSelector({
  staff,
  selectedStaff,
  selectedSlot,
  onSelect,
}: Props) {
  return (
    <div className="staff-section">
      {staff.map((s) => (
        <div key={s.id} className="staff-column">
          <h2>{s.name}</h2>

          <div className="slot-list">
            {s.slots.map((slot) => {
              const isSelected =
                selectedStaff === s.id && selectedSlot === slot.time;

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
                  onClick={() => onSelect(s.id, slot.time, slot.taken)}
                  disabled={slot.taken}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
