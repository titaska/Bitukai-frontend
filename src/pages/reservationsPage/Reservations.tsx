import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect, useCallback, useContext } from "react";
import {Box, Typography, Stack} from "@mui/material";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "./Reservations.css";
import { getReservationsWithDetails } from "../../hooks/getReservationsWithDetails";
import { ReservationInfoDto } from "../../types/reservation";
import EventInfo from "../../components/EventInfo";
import { updateReservationStatus } from "../../hooks/updateReservationStatus";
import { filterByRegistrationNumber } from "../../utils/filterByBusinessReg";
import { BusinessContext } from '../../types/BusinessContext';

export default function Reservations() {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [selectedReservation, setSelectedReservation] = useState<ReservationInfoDto | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { registrationNumber } = useContext(BusinessContext);

  const fetchReservations = useCallback( async () => {
    try {
      const reservations = await getReservationsWithDetails();
      const filteredReservations = filterByRegistrationNumber(reservations, registrationNumber)
      const calendarEvents = filteredReservations.map((reservation) => {
        const startTime = new Date(reservation.startTime);
        const endTime = new Date(startTime.getTime() + reservation.durationMinutes * 60000);

        return {
          id: reservation.appointmentId,
          title: `${reservation.staffName} ${reservation.staffSurname}`,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: { reservation }
        };
      });
      setEvents(calendarEvents);
    }
    catch (error) {
      console.error("Failed to fetch reservations: ", error);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  function renderEvent(eventInfo: any) {
    return (
      <Box
        sx={{
          backgroundColor: "#5A5883",
          borderRadius: "10px",
          padding: "8px 5px",
          fontSize: "12px",
          color: "#FFFFFF",
          display: "inline-block",
          width: "100%",
        }}
      >
        {eventInfo.event.title}
      </Box>
    );
  }

  const handleEventClick = (clickInfo: any) => {
    const reservation: ReservationInfoDto = clickInfo.event.extendedProps.reservation;
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleEdit = (reservation: ReservationInfoDto) => {
    console.log("Edit reservation:", reservation);
    // Navigate to edit page or open edit dialog
    setOpenDialog(false);
  };

  const handleDelete = async (appointmentId: string) => {
    try {
      await updateReservationStatus({ appointmentId, status: "CANCELLED" });
      await fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation: ", error);
    } finally {
      setOpenDialog(false);
    }
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