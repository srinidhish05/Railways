// Complete list of Trains operating in Karnataka
export interface TrainSchedule {
  trainNumber: string;
  trainName: string;
  type: "Express" | "Superfast" | "Passenger" | "Mail" | "Rajdhani" | "Shatabdi" | "Duronto" | "Garib Rath" | "Jan Shatabdi" | "Intercity" | "MEMU" | "DEMU";
  from: string; // Station Code
  to: string; // Station Code
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number; // in KM
  runningDays: string[]; // Days of week
  viaStations: string[]; // Major stations in route
  classes: TrainClass[];
  frequency: "Daily" | "Weekly" | "Bi-Weekly" | "Tri-Weekly";
  zone: string;
  status: "Active" | "Cancelled" | "Diverted" | "Late Running";
}

export interface TrainClass {
  class: "1A" | "2A" | "3A" | "SL" | "CC" | "2S" | "FC" | "EC";
  className: string;
  totalSeats: number;
  availableSeats: number;
  basePrice: number;
  currentPrice: number;
  status: "AVAILABLE" | "RAC" | "WL" | "NOT_AVAILABLE";
  waitingList?: number;
}

export const karnatakaTrains: TrainSchedule[] = [
  // Major Rajdhani/Duronto Express Trains
  {
    trainNumber: "12628",
    trainName: "Karnataka Express",
    type: "Mail",
    from: "SBC",
    to: "NDLS",
    fromName: "KSR Bengaluru City Junction",
    toName: "New Delhi",
    departureTime: "20:15",
    arrivalTime: "10:45+2",
    duration: "38h 30m",
    distance: 2444,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "GTL", "WADI", "RC", "AD", "DMM", "ATP", "GY", "SC", "BPL", "JHS", "NDLS"],
    classes: [
      { class: "1A", className: "AC First Class", totalSeats: 18, availableSeats: 8, basePrice: 6500, currentPrice: 6850, status: "AVAILABLE" },
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 23, basePrice: 4200, currentPrice: 4400, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 67, basePrice: 2950, currentPrice: 3100, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 462, availableSeats: 245, basePrice: 1850, currentPrice: 1850, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },
  
  {
    trainNumber: "12627",
    trainName: "Karnataka Express",
    type: "Mail",
    from: "NDLS",
    to: "SBC",
    fromName: "New Delhi",
    toName: "KSR Bengaluru City Junction",
    departureTime: "21:50",
    arrivalTime: "04:30+2",
    duration: "30h 40m",
    distance: 2444,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["JHS", "BPL", "SC", "GY", "ATP", "DMM", "AD", "RC", "WADI", "GTL", "TK", "SBC"],
    classes: [
      { class: "1A", className: "AC First Class", totalSeats: 18, availableSeats: 5, basePrice: 6500, currentPrice: 6850, status: "AVAILABLE" },
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 12, basePrice: 4200, currentPrice: 4400, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 2950, currentPrice: 3100, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 462, availableSeats: 178, basePrice: 1850, currentPrice: 1850, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Shatabdi Express Trains
  {
    trainNumber: "12079",
    trainName: "Jan Shatabdi Express",
    type: "Jan Shatabdi",
    from: "MAQ",
    to: "SBC",
    fromName: "Mangaluru Central",
    toName: "KSR Bengaluru City Junction",
    departureTime: "05:50",
    arrivalTime: "14:30",
    duration: "8h 40m",
    distance: 352,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SL", "UD", "KUDA", "HAS", "ASK", "TK"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 45, basePrice: 890, currentPrice: 940, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 320, currentPrice: 320, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "12080",
    trainName: "Jan Shatabdi Express",
    type: "Jan Shatabdi",
    from: "SBC",
    to: "MAQ",
    fromName: "KSR Bengaluru City Junction",
    toName: "Mangaluru Central",
    departureTime: "15:15",
    arrivalTime: "23:20",
    duration: "8h 05m",
    distance: 352,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "HAS", "KUDA", "UD", "SL"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 34, basePrice: 890, currentPrice: 940, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 320, currentPrice: 320, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Inter-city Express Trains
  {
    trainNumber: "16022",
    trainName: "Kaveri Express",
    type: "Express",
    from: "MYS",
    to: "MAS",
    fromName: "Mysuru Junction",
    toName: "Chennai Central",
    departureTime: "21:00",
    arrivalTime: "06:00+1",
    duration: "9h 00m",
    distance: 497,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["MAD", "MYA", "SBC", "BWT", "JTJ", "SA"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 23, basePrice: 2100, currentPrice: 2250, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 570, currentPrice: 570, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16021",
    trainName: "Kaveri Express",
    type: "Express",
    from: "MAS",
    to: "MYS",
    fromName: "Chennai Central",
    toName: "Mysuru Junction",
    departureTime: "22:20",
    arrivalTime: "07:30+1",
    duration: "9h 10m",
    distance: 497,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SA", "JTJ", "BWT", "SBC", "MYA", "MAD"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 15, basePrice: 2100, currentPrice: 2250, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 56, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 570, currentPrice: 570, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Local Karnataka Trains
  {
    trainNumber: "17326",
    trainName: "Vishwamanava Express",
    type: "Express",
    from: "SBC",
    to: "MYS",
    fromName: "KSR Bengaluru City Junction",
    toName: "Mysuru Junction",
    departureTime: "08:20",
    arrivalTime: "11:30",
    duration: "3h 10m",
    distance: 139,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["RMGM", "CAN", "MAD", "MYA"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 34, basePrice: 450, currentPrice: 475, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 130, currentPrice: 130, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "17325",
    trainName: "Vishwamanava Express",
    type: "Express",
    from: "MYS",
    to: "SBC",
    fromName: "Mysuru Junction",
    toName: "KSR Bengaluru City Junction",
    departureTime: "15:45",
    arrivalTime: "19:00",
    duration: "3h 15m",
    distance: 139,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["MYA", "MAD", "CAN", "RMGM"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 23, basePrice: 450, currentPrice: 475, status: "RAC" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 130, currentPrice: 130, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // North Karnataka Trains
  {
    trainNumber: "16535",
    trainName: "Gol Gumbaz Express",
    type: "Express",
    from: "SBC",
    to: "BJP",
    fromName: "KSR Bengaluru City Junction",
    toName: "Vijayapura",
    departureTime: "19:00",
    arrivalTime: "07:00+1",
    duration: "12h 00m",
    distance: 613,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "DVG", "HRR", "RNR", "HVR", "GDG", "UBL", "DWR", "BGM"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 12, basePrice: 2850, currentPrice: 2950, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 34, basePrice: 1950, currentPrice: 2050, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 378, availableSeats: 234, basePrice: 780, currentPrice: 780, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16536",
    trainName: "Gol Gumbaz Express",
    type: "Express",
    from: "BJP",
    to: "SBC",
    fromName: "Vijayapura",
    toName: "KSR Bengaluru City Junction",
    departureTime: "20:30",
    arrivalTime: "08:45+1",
    duration: "12h 15m",
    distance: 613,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["BGM", "DWR", "UBL", "GDG", "HVR", "RNR", "HRR", "DVG", "ASK", "TK"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 8, basePrice: 2850, currentPrice: 2950, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 28, basePrice: 1950, currentPrice: 2050, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 378, availableSeats: 187, basePrice: 780, currentPrice: 780, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Coastal Karnataka Trains
  {
    trainNumber: "16591",
    trainName: "Hampi Express",
    type: "Express",
    from: "UBL",
    to: "MYS",
    fromName: "Hubballi Junction",
    toName: "Mysuru Junction",
    departureTime: "18:30",
    arrivalTime: "06:00+1",
    duration: "11h 30m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["GDG", "HVR", "RNR", "DVG", "ASK", "HAS"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 15, basePrice: 2200, currentPrice: 2350, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1550, currentPrice: 1650, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 650, currentPrice: 650, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16592",
    trainName: "Hampi Express",
    type: "Express",
    from: "MYS",
    to: "UBL",
    fromName: "Mysuru Junction",
    toName: "Hubballi Junction",
    departureTime: "21:15",
    arrivalTime: "08:45+1",
    duration: "11h 30m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["HAS", "ASK", "DVG", "RNR", "HVR", "GDG"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 23, basePrice: 2200, currentPrice: 2350, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 56, basePrice: 1550, currentPrice: 1650, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 650, currentPrice: 650, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Express Trains to Major Cities
  {
    trainNumber: "16589",
    trainName: "Rani Chennamma Express",
    type: "Express",
    from: "BGM",
    to: "SBC",
    fromName: "Belagavi",
    toName: "KSR Bengaluru City Junction",
    departureTime: "21:30",
    arrivalTime: "07:00+1",
    duration: "9h 30m",
    distance: 502,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["LD", "DWR", "UBL", "GDG", "HVR", "RNR", "DVG", "ASK", "TK"],
    classes: [
      { class: "1A", className: "AC First Class", totalSeats: 18, availableSeats: 5, basePrice: 4500, currentPrice: 4750, status: "AVAILABLE" },
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 23, basePrice: 2950, currentPrice: 3100, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 2050, currentPrice: 2150, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 378, availableSeats: 234, basePrice: 850, currentPrice: 850, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // More Karnataka Local Trains
  {
    trainNumber: "12785",
    trainName: "Kochuveli Express",
    type: "Express",
    from: "UBL",
    to: "KCVL",
    fromName: "Hubballi Junction",
    toName: "Kochuveli",
    departureTime: "06:30",
    arrivalTime: "14:45+1",
    duration: "32h 15m",
    distance: 1245,
    runningDays: ["Mon", "Wed", "Fri"],
    viaStations: ["GDG", "HVR", "RNR", "DVG", "ASK", "SBC", "MAQ", "CAN", "CLT"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 12, basePrice: 3850, currentPrice: 4050, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 34, basePrice: 2650, currentPrice: 2800, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 1250, currentPrice: 1250, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // Add more trains continuing the pattern...
  {
    trainNumber: "16595",
    trainName: "Panchaganga Express",
    type: "Express",
    from: "MAJN",
    to: "KOP",
    fromName: "Mangaluru Junction",
    toName: "Kolhapur",
    departureTime: "22:00",
    arrivalTime: "18:30+1",
    duration: "20h 30m",
    distance: 785,
    runningDays: ["Tue", "Thu", "Sun"],
    viaStations: ["SL", "UD", "KUDA", "KT", "GOK", "KAWR", "MAO", "SWV"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 23, basePrice: 2850, currentPrice: 3000, status: "AVAILABLE" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1950, currentPrice: 2050, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 950, currentPrice: 950, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // Continue with more trains...
  // Adding passenger trains and MEMU services
  {
    trainNumber: "56901",
    trainName: "SBC-UBL Passenger",
    type: "Passenger",
    from: "SBC",
    to: "UBL",
    fromName: "KSR Bengaluru City Junction",
    toName: "Hubballi Junction",
    departureTime: "06:00",
    arrivalTime: "17:45",
    duration: "11h 45m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "DVG", "HRR", "RNR", "HVR", "GDG"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 156, availableSeats: 89, basePrice: 145, currentPrice: 145, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56902",
    trainName: "UBL-SBC Passenger",
    type: "Passenger",
    from: "UBL",
    to: "SBC",
    fromName: "Hubballi Junction",
    toName: "KSR Bengaluru City Junction",
    departureTime: "05:30",
    arrivalTime: "17:15",
    duration: "11h 45m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["GDG", "HVR", "RNR", "HRR", "DVG", "ASK", "TK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 156, availableSeats: 123, basePrice: 145, currentPrice: 145, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // MEMU Services
  {
    trainNumber: "66525",
    trainName: "SBC-MYS MEMU",
    type: "MEMU",
    from: "SBC",
    to: "MYS",
    fromName: "KSR Bengaluru City Junction",
    toName: "Mysuru Junction",
    departureTime: "06:30",
    arrivalTime: "09:45",
    duration: "3h 15m",
    distance: 139,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["RMGM", "CAN", "MAD", "MYA"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 167, basePrice: 45, currentPrice: 45, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "66526",
    trainName: "MYS-SBC MEMU",
    type: "MEMU",
    from: "MYS",
    to: "SBC",
    fromName: "Mysuru Junction",
    toName: "KSR Bengaluru City Junction",
    departureTime: "17:00",
    arrivalTime: "20:15",
    duration: "3h 15m",
    distance: 139,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["MYA", "MAD", "CAN", "RMGM"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 189, basePrice: 45, currentPrice: 45, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // More express trains
  {
    trainNumber: "18047",
    trainName: "Amaravathi Express",
    type: "Express",
    from: "SBC",
    to: "UBL",
    fromName: "KSR Bengaluru City Junction",
    toName: "Hubballi Junction",
    departureTime: "14:30",
    arrivalTime: "23:45",
    duration: "9h 15m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "DVG", "HRR", "RNR", "HVR", "GDG"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 570, currentPrice: 570, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 190, currentPrice: 190, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "18048",
    trainName: "Amaravathi Express",
    type: "Express",
    from: "UBL",
    to: "SBC",
    fromName: "Hubballi Junction",
    toName: "KSR Bengaluru City Junction",
    departureTime: "05:15",
    arrivalTime: "14:30",
    duration: "9h 15m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["GDG", "HVR", "RNR", "HRR", "DVG", "ASK", "TK"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 56, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 570, currentPrice: 570, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 190, currentPrice: 190, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Coastal trains
  {
    trainNumber: "56641",
    trainName: "MAQ-SBC Passenger",
    type: "Passenger",
    from: "MAQ",
    to: "SBC",
    fromName: "Mangaluru Central",
    toName: "KSR Bengaluru City Junction",
    departureTime: "06:15",
    arrivalTime: "16:30",
    duration: "10h 15m",
    distance: 352,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SL", "UD", "KUDA", "HAS", "ASK", "TK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 156, basePrice: 120, currentPrice: 120, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56642",
    trainName: "SBC-MAQ Passenger",
    type: "Passenger",
    from: "SBC",
    to: "MAQ",
    fromName: "KSR Bengaluru City Junction",
    toName: "Mangaluru Central",
    departureTime: "07:45",
    arrivalTime: "18:00",
    duration: "10h 15m",
    distance: 352,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "HAS", "KUDA", "UD", "SL"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 198, basePrice: 120, currentPrice: 120, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // UBL to TIP connecting trains
  {
    trainNumber: "56921",
    trainName: "UBL-TIP Passenger",
    type: "Passenger",
    from: "UBL",
    to: "TIP",
    fromName: "Hubballi Junction",
    toName: "Tiptur",
    departureTime: "08:00",
    arrivalTime: "16:45",
    duration: "8h 45m",
    distance: 285,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["GDG", "HVR", "RNR", "HRR", "DVG", "ASK", "TK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 156, availableSeats: 89, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56922",
    trainName: "TIP-UBL Passenger",
    type: "Passenger",
    from: "TIP",
    to: "UBL",
    fromName: "Tiptur",
    toName: "Hubballi Junction",
    departureTime: "06:30",
    arrivalTime: "15:15",
    duration: "8h 45m",
    distance: 285,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["TK", "ASK", "DVG", "HRR", "RNR", "HVR", "GDG"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 156, availableSeats: 123, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Express train connecting UBL and TIP via Bangalore
  {
    trainNumber: "17319",
    trainName: "Hubballi-Tiptur Express",
    type: "Express",
    from: "UBL",
    to: "TIP",
    fromName: "Hubballi Junction",
    toName: "Tiptur",
    departureTime: "22:00",
    arrivalTime: "05:30+1",
    duration: "7h 30m",
    distance: 285,
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    viaStations: ["GDG", "HVR", "RNR", "DVG", "ASK", "TK"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 178, basePrice: 285, currentPrice: 285, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 135, currentPrice: 135, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "17320",
    trainName: "Tiptur-Hubballi Express",
    type: "Express",
    from: "TIP",
    to: "UBL",
    fromName: "Tiptur",
    toName: "Hubballi Junction",
    departureTime: "19:45",
    arrivalTime: "03:15+1",
    duration: "7h 30m",
    distance: 285,
    runningDays: ["Tue", "Thu", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "DVG", "RNR", "HVR", "GDG"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 189, basePrice: 285, currentPrice: 285, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 135, currentPrice: 135, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // YPR to DWR connecting trains
  {
    trainNumber: "16591",
    trainName: "Hampi Express",
    type: "Express",
    from: "YPR",
    to: "DWR",
    fromName: "Yesvantpur Junction",
    toName: "Dharwad",
    departureTime: "20:15",
    arrivalTime: "06:30+1",
    duration: "10h 15m",
    distance: 465,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "DVG", "HRR", "UBL"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 23, basePrice: 2100, currentPrice: 2200, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 550, currentPrice: 550, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16592",
    trainName: "Hampi Express",
    type: "Express",
    from: "DWR",
    to: "YPR",
    fromName: "Dharwad",
    toName: "Yesvantpur Junction",
    departureTime: "21:00",
    arrivalTime: "07:15+1",
    duration: "10h 15m",
    distance: 465,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["UBL", "HRR", "DVG", "ASK", "TK"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 54, availableSeats: 18, basePrice: 2100, currentPrice: 2200, status: "RAC" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 56, basePrice: 1450, currentPrice: 1520, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 550, currentPrice: 550, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // YPR to DWR via different route
  {
    trainNumber: "56909",
    trainName: "YPR-DWR Passenger",
    type: "Passenger",
    from: "YPR",
    to: "DWR",
    fromName: "Yesvantpur Junction",
    toName: "Dharwad",
    departureTime: "07:30",
    arrivalTime: "19:45",
    duration: "12h 15m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["SBC", "TK", "ASK", "DVG", "HRR", "UBL"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 167, basePrice: 145, currentPrice: 145, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56910",
    trainName: "DWR-YPR Passenger",
    type: "Passenger",
    from: "DWR",
    to: "YPR",
    fromName: "Dharwad",
    toName: "Yesvantpur Junction",
    departureTime: "06:00",
    arrivalTime: "18:15",
    duration: "12h 15m",
    distance: 485,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["UBL", "HRR", "DVG", "ASK", "TK", "SBC"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 234, availableSeats: 198, basePrice: 145, currentPrice: 145, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Bengaluru Local/Suburban trains
  {
    trainNumber: "66501",
    trainName: "YPR-BAND Local",
    type: "MEMU",
    from: "YPR",
    to: "BAND",
    fromName: "Yesvantpur Junction",
    toName: "Banaswadi",
    departureTime: "06:30",
    arrivalTime: "07:15",
    duration: "45m",
    distance: 25,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["HNS", "YNK", "KJM", "WFD"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 89, basePrice: 15, currentPrice: 15, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "66502",
    trainName: "BAND-YPR Local",
    type: "MEMU",
    from: "BAND",
    to: "YPR",
    fromName: "Banaswadi",
    toName: "Yesvantpur Junction",
    departureTime: "08:00",
    arrivalTime: "08:45",
    duration: "45m",
    distance: 25,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["WFD", "KJM", "YNK", "HNS"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 134, basePrice: 15, currentPrice: 15, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "66503",
    trainName: "SBC-BAND Express",
    type: "Express",
    from: "SBC",
    to: "BAND",
    fromName: "KSR Bengaluru City Junction",
    toName: "Banaswadi",
    departureTime: "09:30",
    arrivalTime: "10:30",
    duration: "1h",
    distance: 18,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["BNC", "KJM", "WFD"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 200, availableSeats: 156, basePrice: 20, currentPrice: 20, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "66504", 
    trainName: "BAND-SBC Express",
    type: "Express",
    from: "BAND",
    to: "SBC", 
    fromName: "Banaswadi",
    toName: "KSR Bengaluru City Junction",
    departureTime: "17:30",
    arrivalTime: "18:30",
    duration: "1h",
    distance: 18,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["WFD", "KJM", "BNC"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 200, availableSeats: 178, basePrice: 20, currentPrice: 20, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Adding trains for Shivamogga connections
  {
    trainNumber: "56925",
    trainName: "SMET-SBC Express",
    type: "Express",
    from: "SMET",
    to: "SBC",
    fromName: "Shivamogga Town",
    toName: "KSR Bengaluru City Junction",
    departureTime: "06:00",
    arrivalTime: "12:30",
    duration: "6h 30m",
    distance: 285,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["ASK", "TK"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 189, basePrice: 285, currentPrice: 285, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 135, currentPrice: 135, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56926",
    trainName: "SBC-SMET Express",
    type: "Express",
    from: "SBC",
    to: "SMET",
    fromName: "KSR Bengaluru City Junction",
    toName: "Shivamogga Town",
    departureTime: "17:00",
    arrivalTime: "23:30",
    duration: "6h 30m",
    distance: 285,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 156, basePrice: 285, currentPrice: 285, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 135, currentPrice: 135, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // BGM to TLGP connecting train
  {
    trainNumber: "16950",
    trainName: "Western Ghat Express",
    type: "Express",
    from: "BGM",
    to: "TLGP",
    fromName: "Belagavi",
    toName: "Talguppa",
    departureTime: "14:30",
    arrivalTime: "21:45",
    duration: "7h 15m",
    distance: 320,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["UBL", "HVR", "HRR", "DVG", "ASK"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 34, basePrice: 1850, currentPrice: 1950, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 189, basePrice: 650, currentPrice: 650, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 220, currentPrice: 220, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16951",
    trainName: "Western Ghat Express",
    type: "Express",
    from: "TLGP",
    to: "BGM",
    fromName: "Talguppa",
    toName: "Belagavi",
    departureTime: "08:15",
    arrivalTime: "15:30",
    duration: "7h 15m",
    distance: 320,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["ASK", "DVG", "HRR", "HVR", "UBL"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 72, availableSeats: 45, basePrice: 1850, currentPrice: 1950, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 334, availableSeats: 234, basePrice: 650, currentPrice: 650, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 220, currentPrice: 220, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Direct TIP to SBC trains  
  {
    trainNumber: "16595",
    trainName: "TIP-SBC Express",
    type: "Express",
    from: "TIP",
    to: "SBC",
    fromName: "Tiptur",
    toName: "KSR Bengaluru City Junction",
    departureTime: "05:45",
    arrivalTime: "08:15",
    duration: "2h 30m",
    distance: 105,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 34, basePrice: 280, currentPrice: 295, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 85, currentPrice: 85, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16596",
    trainName: "SBC-TIP Express",
    type: "Express",
    from: "SBC",
    to: "TIP",
    fromName: "KSR Bengaluru City Junction",
    toName: "Tiptur",
    departureTime: "20:30",
    arrivalTime: "23:00",
    duration: "2h 30m",
    distance: 105,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 78, availableSeats: 45, basePrice: 280, currentPrice: 295, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 85, currentPrice: 85, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Direct SMET to TIP trains via Tumakuru (TK)
  {
    trainNumber: "56951",
    trainName: "SMET-TIP Passenger",
    type: "Passenger",
    from: "SMET",
    to: "TIP",
    fromName: "Shivamogga Town",
    toName: "Tiptur", 
    departureTime: "07:30",
    arrivalTime: "11:45",
    duration: "4h 15m",
    distance: 195,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["ASK", "TK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 123, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56952",
    trainName: "TIP-SMET Passenger", 
    type: "Passenger",
    from: "TIP",
    to: "SMET",
    fromName: "Tiptur",
    toName: "Shivamogga Town",
    departureTime: "15:00",
    arrivalTime: "19:15",
    duration: "4h 15m",
    distance: 195,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["TK", "ASK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 134, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Daily", 
    zone: "SWR",
    status: "Active"
  },

  // SMET to TIP Express via alternate route
  {
    trainNumber: "12941",
    trainName: "Shivamogga-Tiptur Express",
    type: "Express",
    from: "SMET",
    to: "TIP", 
    fromName: "Shivamogga Town",
    toName: "Tiptur",
    departureTime: "14:30",
    arrivalTime: "17:45",
    duration: "3h 15m", 
    distance: 180,
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    viaStations: ["ASK", "TK"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 68, availableSeats: 23, basePrice: 245, currentPrice: 260, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 120, currentPrice: 120, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR", 
    status: "Active"
  },

  {
    trainNumber: "12942",
    trainName: "Tiptur-Shivamogga Express",
    type: "Express",
    from: "TIP",
    to: "SMET",
    fromName: "Tiptur", 
    toName: "Shivamogga Town",
    departureTime: "09:15",
    arrivalTime: "12:30",
    duration: "3h 15m",
    distance: 180,
    runningDays: ["Tue", "Thu", "Sat", "Sun"],
    viaStations: ["TK", "ASK"],
    classes: [
      { class: "CC", className: "AC Chair Car", totalSeats: 68, availableSeats: 31, basePrice: 245, currentPrice: 260, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 120, currentPrice: 120, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // Additional connecting routes for common searches
  // BGM to MYS via UBL
  {
    trainNumber: "56953",
    trainName: "BGM-MYS Express",
    type: "Express",
    from: "BGM",
    to: "MYS",
    fromName: "Belagavi",
    toName: "Mysuru Junction",
    departureTime: "06:45",
    arrivalTime: "14:30",
    duration: "7h 45m",
    distance: 425,
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    viaStations: ["UBL", "DWR", "RRB"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 167, basePrice: 195, currentPrice: 195, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56954",
    trainName: "MYS-BGM Express",
    type: "Express",
    from: "MYS",
    to: "BGM",
    fromName: "Mysuru Junction",
    toName: "Belagavi",
    departureTime: "16:15",
    arrivalTime: "00:00+1",
    duration: "7h 45m",
    distance: 425,
    runningDays: ["Tue", "Thu", "Sat", "Sun"],
    viaStations: ["RRB", "DWR", "UBL"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 189, basePrice: 195, currentPrice: 195, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 78, basePrice: 95, currentPrice: 95, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // HPT to MYS via UBL
  {
    trainNumber: "56955",
    trainName: "HPT-MYS Passenger",
    type: "Passenger",
    from: "HPT",
    to: "MYS",
    fromName: "Hospet Junction",
    toName: "Mysuru Junction",
    departureTime: "05:30",
    arrivalTime: "12:15",
    duration: "6h 45m",
    distance: 385,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["UBL", "DWR", "RRB"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 134, basePrice: 85, currentPrice: 85, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56956",
    trainName: "MYS-HPT Passenger",
    type: "Passenger",
    from: "MYS",
    to: "HPT",
    fromName: "Mysuru Junction",
    toName: "Hospet Junction",
    departureTime: "18:45",
    arrivalTime: "01:30+1",
    duration: "6h 45m",
    distance: 385,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    viaStations: ["RRB", "DWR", "UBL"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 150, availableSeats: 123, basePrice: 85, currentPrice: 85, status: "AVAILABLE" },
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // More connecting trains for comprehensive coverage
  // SMET to MYS via TK and SBC
  {
    trainNumber: "56957",
    trainName: "SMET-MYS Express",
    type: "Express", 
    from: "SMET",
    to: "MYS",
    fromName: "Shivamogga Town",
    toName: "Mysuru Junction",
    departureTime: "08:15",
    arrivalTime: "16:45",
    duration: "8h 30m",
    distance: 445,
    runningDays: ["Mon", "Wed", "Fri", "Sun"],
    viaStations: ["ASK", "TK", "SBC", "RRB"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 178, basePrice: 215, currentPrice: 215, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 89, basePrice: 125, currentPrice: 125, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56958",
    trainName: "MYS-SMET Express",
    type: "Express",
    from: "MYS", 
    to: "SMET",
    fromName: "Mysuru Junction",
    toName: "Shivamogga Town",
    departureTime: "12:30",
    arrivalTime: "21:00",
    duration: "8h 30m",
    distance: 445,
    runningDays: ["Tue", "Thu", "Sat", "Sun"],
    viaStations: ["RRB", "SBC", "TK", "ASK"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 234, availableSeats: 156, basePrice: 215, currentPrice: 215, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 112, availableSeats: 67, basePrice: 125, currentPrice: 125, status: "AVAILABLE" },
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  // Additional Popular Karnataka Routes for "Where is my train" searches
  {
    trainNumber: "16535",
    trainName: "Gol Gumbaz Express",
    type: "Express",
    from: "SBC",
    to: "BJP",
    fromName: "KSR Bengaluru City Junction",
    toName: "Vijayapura",
    departureTime: "06:50",
    arrivalTime: "16:15",
    duration: "9h 25m",
    distance: 502,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "RRB", "HVR", "DVG", "UBL", "BJP"],
    classes: [
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 45, basePrice: 180, currentPrice: 185, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 78, basePrice: 85, currentPrice: 90, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "17301",
    trainName: "Dharwad Express",
    type: "Express", 
    from: "SBC",
    to: "DWR",
    fromName: "KSR Bengaluru City Junction",
    toName: "Dharwad",
    departureTime: "14:30",
    arrivalTime: "23:45",
    duration: "9h 15m",
    distance: 468,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["TK", "ASK", "RRB", "HVR", "UBL", "DWR"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 32, basePrice: 850, currentPrice: 890, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 52, basePrice: 225, currentPrice: 235, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 89, basePrice: 95, currentPrice: 100, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16595",
    trainName: "Panchaganga Express",
    type: "Express",
    from: "SBC",
    to: "KOP",
    fromName: "KSR Bengaluru City Junction", 
    toName: "Kolhapur",
    departureTime: "21:40",
    arrivalTime: "12:30+1",
    duration: "14h 50m",
    distance: 668,
    runningDays: ["Mon", "Wed", "Fri"],
    viaStations: ["TK", "ASK", "RRB", "HVR", "UBL", "BJP", "SUR", "KOP"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 18, basePrice: 1250, currentPrice: 1350, status: "AVAILABLE" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 28, basePrice: 890, currentPrice: 920, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 35, basePrice: 290, currentPrice: 310, status: "AVAILABLE" }
    ],
    frequency: "Tri-Weekly",
    zone: "SWR", 
    status: "Active"
  },

  {
    trainNumber: "17325",
    trainName: "Vishwamanava Express",
    type: "Express",
    from: "SBC",
    to: "VSG",
    fromName: "KSR Bengaluru City Junction",
    toName: "Vasco Da Gama",
    departureTime: "07:45",
    arrivalTime: "19:30",
    duration: "11h 45m",
    distance: 592,
    runningDays: ["Tue", "Thu", "Sun"],
    viaStations: ["TK", "ASK", "UBL", "BGM", "MDO", "VSG"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 41, basePrice: 920, currentPrice: 980, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 58, basePrice: 240, currentPrice: 255, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 92, basePrice: 110, currentPrice: 115, status: "AVAILABLE" }
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16339",
    trainName: "Nagarcoil Express",
    type: "Express",
    from: "SBC",
    to: "NCJ",
    fromName: "KSR Bengaluru City Junction",
    toName: "Nagarcoil Junction",
    departureTime: "11:20",
    arrivalTime: "04:15+1",
    duration: "16h 55m",
    distance: 784,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SBC", "BNC", "JTJ", "SA", "ED", "TPJ", "DG", "MDU", "NCJ"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 22, basePrice: 1680, currentPrice: 1750, status: "AVAILABLE" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 38, basePrice: 1180, currentPrice: 1220, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 45, basePrice: 385, currentPrice: 400, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "12976",
    trainName: "Jaipur Superfast Express",
    type: "Superfast",
    from: "MYS",
    to: "JP",
    fromName: "Mysore Junction", 
    toName: "Jaipur",
    departureTime: "14:50",
    arrivalTime: "05:40+2",
    duration: "38h 50m",
    distance: 1856,
    runningDays: ["Wed", "Sun"],
    viaStations: ["MYS", "SBC", "GTL", "WADI", "SC", "BPL", "KOTA", "JP"],
    classes: [
      { class: "1A", className: "AC First Class", totalSeats: 18, availableSeats: 5, basePrice: 4850, currentPrice: 5100, status: "AVAILABLE" },
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 12, basePrice: 2650, currentPrice: 2780, status: "AVAILABLE" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 25, basePrice: 1890, currentPrice: 1950, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 38, basePrice: 620, currentPrice: 645, status: "AVAILABLE" }
    ],
    frequency: "Bi-Weekly", 
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16022",
    trainName: "Kaveri Express",
    type: "Express",
    from: "MYS",
    to: "MAS",
    fromName: "Mysore Junction",
    toName: "Chennai Central",
    departureTime: "06:30",
    arrivalTime: "14:45",
    duration: "8h 15m",
    distance: 497,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["MYS", "SBC", "BNC", "JTJ", "SA", "BWT", "MAS"],
    classes: [
      { class: "2A", className: "AC 2 Tier", totalSeats: 48, availableSeats: 28, basePrice: 1180, currentPrice: 1220, status: "AVAILABLE" },
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 42, basePrice: 850, currentPrice: 880, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 55, basePrice: 275, currentPrice: 285, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 85, basePrice: 125, currentPrice: 130, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16217",
    trainName: "Chamundi Express", 
    type: "Express",
    from: "MYS",
    to: "SBC",
    fromName: "Mysore Junction",
    toName: "KSR Bengaluru City Junction",
    departureTime: "14:00",
    arrivalTime: "17:15",
    duration: "3h 15m",
    distance: 139,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["MYS", "S", "MAN", "SBC"],
    classes: [
      { class: "CC", className: "Chair Car", totalSeats: 78, availableSeats: 52, basePrice: 165, currentPrice: 170, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 89, basePrice: 45, currentPrice: 50, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "17311",
    trainName: "Vasco Express",
    type: "Express", 
    from: "VSG",
    to: "SBC",
    fromName: "Vasco Da Gama",
    toName: "KSR Bengaluru City Junction",
    departureTime: "08:15",
    arrivalTime: "20:00",
    duration: "11h 45m",
    distance: 592,
    runningDays: ["Mon", "Wed", "Fri"],
    viaStations: ["VSG", "MDO", "BGM", "UBL", "ASK", "TK", "SBC"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 35, basePrice: 920, currentPrice: 980, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 48, basePrice: 240, currentPrice: 255, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 78, basePrice: 110, currentPrice: 115, status: "AVAILABLE" }
    ],
    frequency: "Tri-Weekly",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "16057",
    trainName: "Sapthagiri Express",
    type: "Express",
    from: "SBC",
    to: "TPTY",
    fromName: "KSR Bengaluru City Junction",
    toName: "Tirupati",
    departureTime: "20:30",
    arrivalTime: "05:45+1",
    duration: "9h 15m", 
    distance: 357,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SBC", "BNC", "JTJ", "KPD", "RU", "TPTY"],
    classes: [
      { class: "3A", className: "AC 3 Tier", totalSeats: 64, availableSeats: 38, basePrice: 680, currentPrice: 720, status: "AVAILABLE" },
      { class: "SL", className: "Sleeper Class", totalSeats: 72, availableSeats: 52, basePrice: 220, currentPrice: 235, status: "AVAILABLE" },
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 88, basePrice: 95, currentPrice: 100, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  // Local/Regional trains for short distances
  {
    trainNumber: "56901",
    trainName: "Bangalore-Tumkur Passenger",
    type: "Passenger",
    from: "SBC",
    to: "TK",
    fromName: "KSR Bengaluru City Junction",
    toName: "Tumkur",
    departureTime: "06:15",
    arrivalTime: "08:30",
    duration: "2h 15m",
    distance: 70,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["SBC", "YPR", "DBU", "GBD", "TK"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 92, basePrice: 25, currentPrice: 25, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  },

  {
    trainNumber: "56903",
    trainName: "Hassan-Bangalore Passenger",
    type: "Passenger",
    from: "HAS",
    to: "SBC",
    fromName: "Hassan",
    toName: "KSR Bengaluru City Junction",
    departureTime: "05:45",
    arrivalTime: "10:30",
    duration: "4h 45m",
    distance: 187,
    runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    viaStations: ["HAS", "ASK", "TK", "SBC"],
    classes: [
      { class: "2S", className: "Second Sitting", totalSeats: 108, availableSeats: 85, basePrice: 55, currentPrice: 55, status: "AVAILABLE" }
    ],
    frequency: "Daily",
    zone: "SWR",
    status: "Active"
  }
];

// Helper functions for train search and filtering
export const searchTrains = (query: string): TrainSchedule[] => {
  if (!query || query.length < 2) return karnatakaTrains;
  
  const searchTerm = query.toLowerCase();
  
  // Enhanced search for "where is my train" scenarios
  return karnatakaTrains.filter(train => 
    train.trainName.toLowerCase().includes(searchTerm) ||
    train.trainNumber.includes(searchTerm) ||
    train.fromName.toLowerCase().includes(searchTerm) ||
    train.toName.toLowerCase().includes(searchTerm) ||
    train.from.toLowerCase().includes(searchTerm) ||
    train.to.toLowerCase().includes(searchTerm) ||
    train.type.toLowerCase().includes(searchTerm) ||
    // Search in via stations
    train.viaStations.some(station => station.toLowerCase().includes(searchTerm)) ||
    // Search by route keywords
    (searchTerm.includes('express') && train.type === 'Express') ||
    (searchTerm.includes('superfast') && train.type === 'Superfast') ||
    (searchTerm.includes('passenger') && train.type === 'Passenger') ||
    (searchTerm.includes('mail') && train.type === 'Mail') ||
    // Search by popular route names
    (searchTerm.includes('bangalore') && (train.from === 'SBC' || train.to === 'SBC' || train.viaStations.includes('SBC'))) ||
    (searchTerm.includes('mysore') && (train.from === 'MYS' || train.to === 'MYS' || train.viaStations.includes('MYS'))) ||
    (searchTerm.includes('hubli') && (train.from === 'UBL' || train.to === 'UBL' || train.viaStations.includes('UBL'))) ||
    (searchTerm.includes('delhi') && (train.to === 'NDLS' || train.viaStations.includes('NDLS'))) ||
    (searchTerm.includes('chennai') && (train.to === 'MAS' || train.viaStations.includes('MAS'))) ||
    (searchTerm.includes('mumbai') && (train.to === 'CSMT' || train.viaStations.includes('CSMT'))) ||
    // Search by time patterns
    (searchTerm.includes('morning') && parseInt(train.departureTime.split(':')[0]) >= 6 && parseInt(train.departureTime.split(':')[0]) <= 11) ||
    (searchTerm.includes('evening') && parseInt(train.departureTime.split(':')[0]) >= 17 && parseInt(train.departureTime.split(':')[0]) <= 21) ||
    (searchTerm.includes('night') && (parseInt(train.departureTime.split(':')[0]) >= 22 || parseInt(train.departureTime.split(':')[0]) <= 5))
  );
};

// Search trains between stations
export const searchTrainsBetweenStations = (from: string, to: string): TrainSchedule[] => {
  const fromCode = from.toUpperCase()
  const toCode = to.toUpperCase()
  
  return karnatakaTrains.filter(train => {
    // Direct route match
    if ((train.from === fromCode && train.to === toCode) || 
        (train.from === toCode && train.to === fromCode)) {
      return true
    }
    
    // Check if both stations are in the route (including via stations)
    const allFromStations = [train.from, ...train.viaStations]
    const allToStations = [train.to, ...train.viaStations]
    
    const hasFromStation = allFromStations.includes(fromCode)
    const hasToStation = allToStations.includes(toCode)
    
    // For connecting routes, check if both stations exist in the train's path
    if (hasFromStation && hasToStation) {
      // Make sure the direction is correct (from comes before to in the route)
      const trainRoute = [train.from, ...train.viaStations, train.to]
      const fromIndex = trainRoute.indexOf(fromCode)
      const toIndex = trainRoute.indexOf(toCode)
      
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex
    }
    
    return false
  })
};

// Get trains by type
export const getTrainsByType = (type: TrainSchedule['type']): TrainSchedule[] => {
  return karnatakaTrains.filter(train => train.type === type);
};

// Get trains running on specific day
export const getTrainsByDay = (day: string): TrainSchedule[] => {
  return karnatakaTrains.filter(train => 
    train.runningDays.includes(day)
  );
};

// Get train by number
export const getTrainByNumber = (trainNumber: string): TrainSchedule | undefined => {
  return karnatakaTrains.find(train => train.trainNumber === trainNumber);
};
