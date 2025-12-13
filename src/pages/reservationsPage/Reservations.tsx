import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import {Box, Typography, Stack} from "@mui/material";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

import "./Reservations.css";
import { time } from "console";

export default function Reservations() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();

  const events = [
    { id: "1", title: "Staff 1", start: "2025-12-13T14:00:00", end: "2025-12-13T14:30:00", backgroundColor: "#a2f5d0" },
    { id: "2", title: "Staff 2", start: "2025-12-13T14:00:00", end: "2025-12-13T14:30:00", backgroundColor: "#f5e6a2" },
    { id: "3", title: "Staff 3", start: "2025-12-13T14:00:00", end: "2025-12-13T14:30:00", backgroundColor: "#7fd97a" },
    { id: "4", title: "Staff 1", start: "2025-12-13T14:30:00", end: "2025-12-13T15:00:00", backgroundColor: "#a2f5d0" },
    { id: "5", title: "Staff 2", start: "2025-12-13T14:30:00", end: "2025-12-13T15:00:00", backgroundColor: "#f5e6a2" },
    { id: "6", title: "Staff 1", start: "2025-12-13T15:00:00", end: "2025-12-13T15:30:00", backgroundColor: "#a2f5d0" },
    { id: "7", title: "Staff 1", start: "2025-12-13T15:30:00", end: "2025-12-13T16:00:00", backgroundColor: "#a2f5d0" }
  ];

  function renderEvent(eventInfo: any) {
    return (
      <Box
        sx={{
          backgroundColor: eventInfo.event.backgroundColor,
          borderRadius: "10px",
          padding: "8px 5px",
          fontSize: "12px",
          color: "#333",
          display: "inline-block",
          width: "100%",
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  }

  function onEventClick(info: any) {
    setSelectedEvent(info.event);
  }

  return (
    <Stack>
      <Typography
        variant="h5" 
        sx={{
          fontWeight: '600',
          paddingLeft: '25px', 
          marginTop: '10px',
          borderBottom: '3px solid #B3B0C8',
          paddingBottom: '10px',
        }}
      >
        All reservations
      </Typography>
      <Stack
        sx={{
          margin: '20px',
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          events={events}
          eventContent={renderEvent}
          eventClick={onEventClick}
          firstDay={1}
          contentHeight="auto"
          allDaySlot={false}
          headerToolbar={{
            left: 'prev title next',
            center: '',
            right: 'timeGridDay,dayGridWeek,dayGridMonth,addAppointmentButton'
            
          }}
          titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
          dayHeaderFormat={{ weekday: 'short' }}
          slotDuration="00:15:00"
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          customButtons={{
            addAppointmentButton: {
              text: 'Add Appointment',
              click: function() {
                navigate('/new-reservation');
              }
            }
          }}
        />
      </Stack>
    </Stack>
  );
}