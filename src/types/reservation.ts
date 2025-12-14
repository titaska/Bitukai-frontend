export interface ReservationInfoDto {
  appointmentId: string;
  registrationNumber: string;
  serviceProductId: string;
  serviceName: string;
  employeeId: string;
  employeeName: string;
  employeeSurname: string;
  startTime: string;
  durationMinutes: number;
  status: string;
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