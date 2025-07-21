// Complete list of Railway Stations in Karnataka
export interface Station {
  code: string;
  name: string;
  city: string;
  district: string;
  zone: string; // Railway Zone
  division: string; // Railway Division
}

export const karnatakaStations: Station[] = [
  // Major Junction Stations
  { code: "SBC", name: "KSR Bengaluru City Junction", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "YPR", name: "Yesvantpur Junction", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "BAND", name: "Banaswadi", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "KJM", name: "Krishnarajapuram", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "UBL", name: "Hubballi Junction", city: "Hubballi", district: "Dharwad", zone: "SWR", division: "Hubli" },
  { code: "MYS", name: "Mysuru Junction", city: "Mysuru", district: "Mysuru", zone: "SWR", division: "Mysore" },
  
  // Coastal Karnataka - Mangalore Division
  { code: "MAJN", name: "Mangaluru Junction", city: "Mangaluru", district: "Dakshina Kannada", zone: "SWR", division: "Palakkad" },
  { code: "MAQ", name: "Mangaluru Central", city: "Mangaluru", district: "Dakshina Kannada", zone: "SWR", division: "Palakkad" },
  { code: "UD", name: "Udupi", city: "Udupi", district: "Udupi", zone: "SWR", division: "Palakkad" },
  { code: "KUDA", name: "Kundapura", city: "Kundapura", district: "Udupi", zone: "SWR", division: "Palakkad" },
  { code: "BTJL", name: "Bhatkal", city: "Bhatkal", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  { code: "KT", name: "Kumta", city: "Kumta", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  { code: "GOK", name: "Gokarna Road", city: "Gokarna", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  { code: "KAWR", name: "Karwar", city: "Karwar", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  { code: "ANKR", name: "Ankola", city: "Ankola", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  
  // North Karnataka - Hubli Division
  { code: "BGM", name: "Belagavi", city: "Belagavi", district: "Belagavi", zone: "SWR", division: "Hubli" },
  { code: "BJP", name: "Vijayapura", city: "Vijayapura", district: "Vijayapura", zone: "SWR", division: "Hubli" },
  { code: "GDG", name: "Gadag Junction", city: "Gadag", district: "Gadag", zone: "SWR", division: "Hubli" },
  { code: "KBL", name: "Koppal", city: "Koppal", district: "Koppal", zone: "SWR", division: "Hubli" },
  { code: "HPT", name: "Hospet Junction", city: "Hospet", district: "Vijayanagara", zone: "SWR", division: "Hubli" },
  { code: "BAY", name: "Ballari Junction", city: "Ballari", district: "Ballari", zone: "SWR", division: "Hubli" },
  { code: "KLBG", name: "Kalaburagi", city: "Kalaburagi", district: "Kalaburagi", zone: "SWR", division: "Hubli" },
  { code: "RC", name: "Raichur Junction", city: "Raichur", district: "Raichur", zone: "SWR", division: "Hubli" },
  { code: "YG", name: "Yadgir", city: "Yadgir", district: "Yadgir", zone: "SWR", division: "Hubli" },
  { code: "LD", name: "Londa Junction", city: "Londa", district: "Belagavi", zone: "SWR", division: "Hubli" },
  
  // Bangalore Division
  { code: "TK", name: "Tumakuru", city: "Tumakuru", district: "Tumakuru", zone: "SWR", division: "Bangalore" },
  { code: "TIP", name: "Tiptur", city: "Tiptur", district: "Tumakuru", zone: "SWR", division: "Bangalore" },
  { code: "ASK", name: "Arsikere Junction", city: "Arsikere", district: "Hassan", zone: "SWR", division: "Bangalore" },
  { code: "DVG", name: "Davangere", city: "Davangere", district: "Davangere", zone: "SWR", division: "Bangalore" },
  { code: "HRR", name: "Harihar", city: "Harihar", district: "Davangere", zone: "SWR", division: "Bangalore" },
  { code: "RRB", name: "Birur Junction", city: "Birur", district: "Chikkamagaluru", zone: "SWR", division: "Bangalore" },
  { code: "CKM", name: "Chikkamagaluru", city: "Chikkamagaluru", district: "Chikkamagaluru", zone: "SWR", division: "Bangalore" },
  { code: "SMET", name: "Shivamogga Town", city: "Shivamogga", district: "Shivamogga", zone: "SWR", division: "Bangalore" },
  { code: "TLGP", name: "Talguppa", city: "Talguppa", district: "Shivamogga", zone: "SWR", division: "Bangalore" },
  
  // Mysore Division
  { code: "HAS", name: "Hassan Junction", city: "Hassan", district: "Hassan", zone: "SWR", division: "Mysore" },
  { code: "SKLR", name: "Sakleshpur", city: "Sakleshpur", district: "Hassan", zone: "SWR", division: "Mysore" },
  { code: "SBHR", name: "Subrahmanya Road", city: "Subrahmanya", district: "Dakshina Kannada", zone: "SWR", division: "Mysore" },
  { code: "KBPR", name: "Kabaka Puttur", city: "Puttur", district: "Dakshina Kannada", zone: "SWR", division: "Mysore" },
  { code: "MYA", name: "Mandya", city: "Mandya", district: "Mandya", zone: "SWR", division: "Mysore" },
  { code: "PAN", name: "Pandavapura", city: "Pandavapura", district: "Mandya", zone: "SWR", division: "Mysore" },
  { code: "MAD", name: "Maddur", city: "Maddur", district: "Mandya", zone: "SWR", division: "Mysore" },
  { code: "CPT", name: "Chamarajanagar", city: "Chamarajanagar", district: "Chamarajanagar", zone: "SWR", division: "Mysore" },
  { code: "BDP", name: "Bandipur", city: "Bandipur", district: "Chamarajanagar", zone: "SWR", division: "Mysore" },
  
  // Additional Stations - Central Karnataka
  { code: "JTJ", name: "Jolarpettai Junction", city: "Jolarpettai", district: "Kolar", zone: "SWR", division: "Bangalore" },
  { code: "BWT", name: "Bangarapet", city: "Bangarapet", district: "Kolar", zone: "SWR", division: "Bangalore" },
  { code: "KQZ", name: "Kolar Gold Fields", city: "KGF", district: "Kolar", zone: "SWR", division: "Bangalore" },
  { code: "MLU", name: "Malur", city: "Malur", district: "Kolar", zone: "SWR", division: "Bangalore" },
  { code: "WFD", name: "Whitefield", city: "Bengaluru", district: "Bengaluru Rural", zone: "SWR", division: "Bangalore" },
  { code: "CKI", name: "Chikkaballapur", city: "Chikkaballapur", district: "Chikkaballapur", zone: "SWR", division: "Bangalore" },
  { code: "GDY", name: "Gudiyatham", city: "Gudiyatham", district: "Kolar", zone: "SWR", division: "Bangalore" },
  { code: "BFD", name: "Byatarayanadurga", city: "Byatarayanadurga", district: "Tumakuru", zone: "SWR", division: "Bangalore" },
  
  // Additional North Karnataka Stations
  { code: "LWR", name: "Alnavar Junction", city: "Alnavar", district: "Dharwad", zone: "SWR", division: "Hubli" },
  { code: "DWR", name: "Dharwad", city: "Dharwad", district: "Dharwad", zone: "SWR", division: "Hubli" },
  { code: "NGR", name: "Annigeri", city: "Annigeri", district: "Dharwad", zone: "SWR", division: "Hubli" },
  { code: "RNR", name: "Ranibennur", city: "Ranibennur", district: "Haveri", zone: "SWR", division: "Hubli" },
  { code: "HVR", name: "Haveri", city: "Haveri", district: "Haveri", zone: "SWR", division: "Hubli" },
  { code: "BYD", name: "Byadgi", city: "Byadgi", district: "Haveri", zone: "SWR", division: "Hubli" },
  { code: "HG", name: "Hangal", city: "Hangal", district: "Haveri", zone: "SWR", division: "Hubli" },
  { code: "RON", name: "Ron", city: "Ron", district: "Gadag", zone: "SWR", division: "Hubli" },
  { code: "MRB", name: "Munirabad", city: "Munirabad", district: "Koppal", zone: "SWR", division: "Hubli" },
  { code: "GIN", name: "Ginigera", city: "Ginigera", district: "Koppal", zone: "SWR", division: "Hubli" },
  { code: "KBL", name: "Koppal", city: "Koppal", district: "Koppal", zone: "SWR", division: "Hubli" },
  { code: "GBD", name: "Gauribidanur", city: "Gauribidanur", district: "Chikkaballapur", zone: "SWR", division: "Bangalore" },
  { code: "DMM", name: "Dharmavaram Junction", city: "Dharmavaram", district: "Anantapur", zone: "SWR", division: "Hubli" },
  
  // Additional Coastal Karnataka
  { code: "SL", name: "Surathkal", city: "Surathkal", district: "Dakshina Kannada", zone: "SWR", division: "Palakkad" },
  { code: "MULK", name: "Mulki", city: "Mulki", district: "Dakshina Kannada", zone: "SWR", division: "Palakkad" },
  { code: "KKLR", name: "Karkala", city: "Karkala", district: "Udupi", zone: "SWR", division: "Palakkad" },
  { code: "BTKL", name: "Bantakal", city: "Bantakal", district: "Udupi", zone: "SWR", division: "Palakkad" },
  { code: "BLKN", name: "Brahmavara", city: "Brahmavara", district: "Udupi", zone: "SWR", division: "Palakkad" },
  { code: "HNSM", name: "Honnavar", city: "Honnavar", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  { code: "MVRD", name: "Mavinakere", city: "Mavinakere", district: "Uttara Kannada", zone: "SWR", division: "Palakkad" },
  
  // Additional South Karnataka
  { code: "CMNR", name: "Chamarajanagar", city: "Chamarajanagar", district: "Chamarajanagar", zone: "SWR", division: "Mysore" },
  { code: "YDM", name: "Yedamangala", city: "Yedamangala", district: "Tumakuru", zone: "SWR", division: "Bangalore" },
  { code: "KNF", name: "Kengeri", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "RMGM", name: "Ramanagara", city: "Ramanagara", district: "Ramanagara", zone: "SWR", division: "Bangalore" },
  { code: "CAN", name: "Channapatna", city: "Channapatna", district: "Ramanagara", zone: "SWR", division: "Bangalore" },
  { code: "SHC", name: "Shravanabelagola", city: "Shravanabelagola", district: "Hassan", zone: "SWR", division: "Mysore" },
  { code: "KGI", name: "Kengeri Satellite Town", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "BYPL", name: "Baiyappanahalli", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "LOGH", name: "Lottegollahalli", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  
  // Border Stations (Karnataka boundary)
  { code: "CSTM", name: "Chhatrapati Shivaji Terminus", city: "Mumbai", district: "Mumbai", zone: "CR", division: "Mumbai" },
  { code: "MAS", name: "Chennai Central", city: "Chennai", district: "Chennai", zone: "SR", division: "Chennai" },
  { code: "TPJ", name: "Tiruchirapalli Junction", city: "Tiruchirappalli", district: "Tiruchirappalli", zone: "SR", division: "Tiruchirappalli" },
  { code: "SA", name: "Salem Junction", city: "Salem", district: "Salem", zone: "SR", division: "Salem" },
  { code: "BNC", name: "Bangalore Cantonment", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  { code: "BNCE", name: "Bangalore East", city: "Bengaluru", district: "Bengaluru Urban", zone: "SWR", division: "Bangalore" },
  
  // Additional Junction and Important Stations
  { code: "GTL", name: "Guntakal Junction", city: "Guntakal", district: "Anantapur", zone: "SWR", division: "Guntakal" },
  { code: "AD", name: "Adoni", city: "Adoni", district: "Kurnool", zone: "SWR", division: "Guntakal" },
  { code: "MALM", name: "Mantralayam Road", city: "Mantralayam", district: "Kurnool", zone: "SWR", division: "Guntakal" },
  { code: "RC", name: "Raichur Junction", city: "Raichur", district: "Raichur", zone: "SWR", division: "Hubli" },
  { code: "WADI", name: "Wadi Junction", city: "Wadi", district: "Kalaburagi", zone: "SWR", division: "Hubli" },
  { code: "SRNR", name: "Shoranur Junction", city: "Shoranur", district: "Palakkad", zone: "SR", division: "Palakkad" },
  { code: "CLT", name: "Kozhikode", city: "Kozhikode", district: "Kozhikode", zone: "SR", division: "Palakkad" },
  { code: "CAN", name: "Kannur", city: "Kannur", district: "Kannur", zone: "SR", division: "Palakkad" },
  { code: "PAY", name: "Payyanur", city: "Payyanur", district: "Kannur", zone: "SR", division: "Palakkad" },
];

// Station search helper function
export const searchStations = (query: string): Station[] => {
  if (!query || query.length < 2) return karnatakaStations;
  
  const searchTerm = query.toLowerCase();
  return karnatakaStations.filter(station => 
    station.name.toLowerCase().includes(searchTerm) ||
    station.code.toLowerCase().includes(searchTerm) ||
    station.city.toLowerCase().includes(searchTerm) ||
    station.district.toLowerCase().includes(searchTerm)
  );
};

// Get station by code
export const getStationByCode = (code: string): Station | undefined => {
  return karnatakaStations.find(station => station.code.toLowerCase() === code.toLowerCase());
};

// Get stations by city
export const getStationsByCity = (city: string): Station[] => {
  return karnatakaStations.filter(station => 
    station.city.toLowerCase().includes(city.toLowerCase())
  );
};

// Get stations by district
export const getStationsByDistrict = (district: string): Station[] => {
  return karnatakaStations.filter(station => 
    station.district.toLowerCase().includes(district.toLowerCase())
  );
};
