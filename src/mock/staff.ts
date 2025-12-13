export interface TimeSlot {
  time: string;
  taken: boolean;
}

export interface StaffMember {
  id: number;
  name: string;
  slots: TimeSlot[];
}

export const staffData: StaffMember[] = [
  {
    id: 1,
    name: "Staff 1",
    slots: [
      { time: "9:00 - 10:30", taken: false },
      { time: "9:10 - 10:40", taken: false },
      { time: "9:20 - 10:50", taken: false },
      { time: "9:30 - 11:00", taken: false },
      { time: "14:00 - 15:30", taken: false },
      { time: "16:00 - 17:30", taken: false },
      { time: "16:10 - 17:40", taken: false },
      { time: "16:20 - 17:50", taken: false },
      { time: "16:30 - 18:00", taken: false },
    ]
  },
  {
    id: 2,
    name: "Staff 2",
    slots: [
      { time: "9:00 - 10:30", taken: false },
      { time: "9:10 - 10:40", taken: false },
      { time: "9:20 - 10:50", taken: false },
      { time: "9:30 - 11:00", taken: false },
      { time: "14:00 - 15:30", taken: false },
      { time: "16:00 - 17:30", taken: false },
      { time: "16:10 - 17:40", taken: false },
      { time: "16:20 - 17:50", taken: false },
      { time: "16:30 - 18:00", taken: false },
    ]
  },
  {
    id: 3,
    name: "Staff 3",
    slots: [
      { time: "9:00 - 10:30", taken: false },
      { time: "9:10 - 10:40", taken: false },
      { time: "9:20 - 10:50", taken: false },
      { time: "9:30 - 11:00", taken: false },
      { time: "14:00 - 15:30", taken: false },
      { time: "16:00 - 17:30", taken: false },
      { time: "16:10 - 17:40", taken: false },
      { time: "16:20 - 17:50", taken: false },
      { time: "16:30 - 18:00", taken: false },
    ]
  }
];
