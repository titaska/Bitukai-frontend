import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect } from "react";
import {Box, Typography, Stack} from "@mui/material";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "./Reservations.css";
import { getReservations } from "../../hooks/getReservations";
import { ReservationInfoDto } from "../../types/reservation";
import EventInfo from "../../components/EventInfo";

export default function Reservations() {
  //const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [selectedReservation, setSelectedReservation] = useState<ReservationInfoDto | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // useEffect(() => {
  //   const fetchReservations = async () => {
  //     try {
  //       const reservations = await getReservations();
  //       const calendarEvents = reservations.map((reservation) => {
  //         const startTime = new Date(reservation.startTime);
  //         const endTime = new Date(startTime.getTime() + reservation.durationMinutes * 60000);

  //         return {
  //           id: reservation.appointmentId,
  //           title: `${reservation.clientName} ${reservation.clientSurname}`,
  //           start: startTime.toISOString(),
  //           end: endTime.toISOString(),
  //           backgroundColor: "#a2f5d0",
  //         };
  //       });
  //       setEvents(calendarEvents);
  //     }
  //     catch (error) {
  //       console.error("Failed to fetch reservations: ", error);
  //     }
  //   };

  //   fetchReservations();
  // }, []);

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

  const handleEventClick = (clickInfo: any) => {
    // For now, with mock data, you'll need to create a mock reservation
    // When using real data: setSelectedReservation(clickInfo.event.extendedProps.reservation);
    const mockReservation: ReservationInfoDto = {
      appointmentId: clickInfo.event.id,
      registrationNumber: "REG123",
      serviceProductId: "SVC001",
      serviceName: "Men's Haircut",
      employeeId: "EMP001",
      employeeName: "Alice",
      employeeSurname: "Smith",
      startTime: clickInfo.event.start.toISOString(),
      durationMinutes: 30,
      status: "BOOKED",
      notes: "Sample reservation",
      clientName: "John",
      clientSurname: "Doe",
      clientPhone: "+370 600 00000"
    };
    setSelectedReservation(mockReservation);
    setOpenDialog(true);
  };

  const handleEdit = (reservation: ReservationInfoDto) => {
    console.log("Edit reservation:", reservation);
    // Navigate to edit page or open edit dialog
    setOpenDialog(false);
  };

  const handleDelete = (appointmentId: string) => {
    console.log("Delete reservation:", appointmentId);
    // Implement delete logic
    setOpenDialog(false);
  };

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
          eventClick={handleEventClick}
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

        <EventInfo
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        reservation={selectedReservation}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      </Stack>
    </Stack>
  );
}