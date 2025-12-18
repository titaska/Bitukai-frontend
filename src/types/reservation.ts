export interface ReservationInfoDto {
  productName: string;
  staffName: string;
  staffSurname: string;
  appointmentId: string;
  registrationNumber: string;
  serviceProductId: string;
  employeeId: string;
  startTime: string;
  durationMinutes: number;
  status: string;
  orderId: string | null;
  notes: string | null;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
};

export interface EventInfoProps {
  open: boolean;
  onClose: () => void;
  reservation: ReservationInfoDto | null;
  onEdit: (reservation: ReservationInfoDto) => void;
  onDelete: (appointmentId: string) => void;
}