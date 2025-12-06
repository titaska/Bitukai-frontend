import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import {Box, Typography, Stack} from "@mui/material";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

import "./Reservations.css";

export default function Reservations() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const navigate = useNavigate();

  const events = [
    { id: "1", title: "14:00-14:30 Staff 1", date: "2025-12-08", color: "#a2f5d0" },
    { id: "2", title: "14:00-14:30 Staff 2", date: "2025-12-08", color: "#f5e6a2" },
    { id: "3", title: "14:00-14:30 Staff 3", date: "2025-12-08", color: "#7fd97a" },
    { id: "4", title: "14:30-15:00 Staff 1", date: "2025-12-08", color: "#a2f5d0" },
    { id: "5", title: "14:30-15:00 Staff 2", date: "2025-12-08", color: "#f5e6a2" },
    { id: "6", title: "15:00-15:30 Staff 1", date: "2025-12-08", color: "#a2f5d0" },
    { id: "7", title: "15:30-16:00 Staff 1", date: "2025-12-08", color: "#a2f5d0" }
  ];

  function renderEvent(eventInfo: any) {
    return (
      <Box
        sx={{
          backgroundColor: eventInfo.event.extendedProps.color,
          borderRadius: "20px",
          padding: "8px 5px",
          fontSize: "12px",
          color: "#333",
          display: "inline-block"
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
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEvent}
          eventClick={onEventClick}
          firstDay={1}
          contentHeight="auto"
          headerToolbar={{
            left: 'prev title next',
            center: '',
            right: 'dayGridDay,dayGridWeek,dayGridMonth addAppointmentButton'
            
          }}
          titleFormat={{ year: 'numeric', month: 'long', day: 'numeric' }}
          dayHeaderFormat={{ weekday: 'short' }}
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