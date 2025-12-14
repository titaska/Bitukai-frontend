import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Stack, Divider } from "@mui/material";
import { ReservationInfoDto, EventInfoProps } from "../types/reservation";
import { getDateYMD, getHoursAndMinutes } from "../utils/dateTime";
import { CustomBox } from "./CustomBox";

export default function EventInfo({ open, onClose, reservation, onEdit, onDelete }: EventInfoProps) {
  if (!reservation) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Reservation Details
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
        <Stack spacing={2}>
          <CustomBox title="Staff">
            {reservation.employeeName} {reservation.employeeSurname}
          </CustomBox>

          <CustomBox title="Service">
            {reservation.serviceName}
          </CustomBox>

          <CustomBox title="Date & Time">
            {`${getDateYMD(reservation.startTime)} ${getHoursAndMinutes(reservation.startTime)}-${getHoursAndMinutes(new Date(new Date(reservation.startTime).getTime() + reservation.durationMinutes * 60000).toISOString())}`}
          </CustomBox>

          <CustomBox title="Duration">
            {reservation.durationMinutes} minutes
          </CustomBox>

          <CustomBox title="Status">
            {reservation.status}
          </CustomBox>
        </Stack>

        <Stack spacing={2}>
          <CustomBox title="Client">
            {reservation.clientName} {reservation.clientSurname}
          </CustomBox>

          <CustomBox title="Phone">
            {reservation.clientPhone}
          </CustomBox>

          {reservation.notes && (
            <CustomBox title="Notes">
            {reservation.notes}
          </CustomBox>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "16px 24px", justifyContent: "space-between" }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ borderColor: "black", color: "black", borderRadius: "20px", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Stack direction="row" spacing={2}>
          <Button 
          sx={{ backgroundColor: "#5A5883", color: "white", borderRadius: "20px", textTransform: "none" }}
          onClick={() => onEdit(reservation)} 
          variant="outlined" 
        >
          Edit Reservation
        </Button>
        <Button 
          onClick={() => onDelete(reservation.appointmentId)} 
          variant="contained" 
          color="error"
          sx={{ borderRadius: "20px", textTransform: "none" }}
        >
          Delete Reservation
        </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}