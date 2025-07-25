# Indian Railways Information Portal

A modern, full-stack web application for Indian Railways information, built with Next.js, TypeScript, Tailwind CSS, and Radix UI. This project provides features such as PNR status lookup, train and station details, and emergency contacts, with a focus on accessibility, performance, and a seamless user experience.

---

## Features

### PNR Status Lookup
- Allows users to check the status of their railway ticket using the PNR number.
- Displays passenger details, booking status (CNF, RAC, WL, etc.), and journey information.

### Train Information
- Shows train schedules, including departure and arrival times.
- Provides source and destination details for each train.

### Station Details
- Lists information about railway stations, including station code, name, state, and geolocation (latitude and longitude).

### Emergency Contacts
- Displays emergency contact information for Medical, Fire, Security, and Technical departments.
- Each contact includes name, phone number, and department.

### Modern UI & Accessibility
- Built with Radix UI and Tailwind CSS for a responsive, accessible interface.
- Supports dark mode and theme switching.
- Custom railway-specific colors, animations, and grid layouts for seat maps and timetables.

### Type Safety & Component Library
- All data structures are strictly typed with TypeScript.
- Modular, reusable UI components (such as Accordion, Modals, etc.) for rapid development and maintainability.

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (preferred) or npm/yarn
- Internet connection for API data (if using live endpoints)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/imDarshanGK/railways-portal.git
cd railways-portal
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add any required API keys or environment variables. Example:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
```

### 4. Run the Development Server

```bash
pnpm dev
```
or
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### 5. Build for Production

```bash
pnpm build
pnpm start
```
or
```bash
npm run build
npm start
```

---

## Project Structure

- `components/` - Reusable UI components (Accordion, Modals, etc.)
- `pages/` or `app/` - Next.js pages and routes
- `lib/` - Utility functions and helpers
- `types/` - TypeScript type definitions (e.g., PNRStatus, Train, Station, EmergencyContact)
- `public/` - Static assets
- `styles/` - Global and Tailwind CSS files

---

## Team Members

- [Bharath Kumar P](https://github.com/imBharathkumarp)
- [Darshan G K](https://github.com/imDarshanGK)
- Prashant G M
- [Srinidhi S H](https://github.com/srinidhish05)

---

## License

This project is for educational and demonstration purposes.

---