import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AppointmentPage } from "./pages/AppointmentPage";
import { RecurrencePage } from "./pages/RecurrencePage";
import { Navbar } from "./components/Navbar.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/appointment/:id?" element={<AppointmentPage />} />
            <Route path="/recurrence/:id" element={<RecurrencePage />} />
          </Routes>
        </main>

        {/* Notification Toaster */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
