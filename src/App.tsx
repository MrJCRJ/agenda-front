import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AppointmentPage } from "./pages/AppointmentPage";
import { RecurrencePage } from "./pages/RecurrencePage";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation Bar - Fixed at top */}
        <header className="sticky top-0 z-10">
          <Navbar />
        </header>

        {/* Main Content with responsive padding */}
        <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/appointment">
                <Route index element={<AppointmentPage />} />
                <Route path=":id" element={<AppointmentPage />} />
              </Route>
              <Route path="/recurrence/:id" element={<RecurrencePage />} />
            </Routes>
          </div>
        </main>

        {/* Notification Toaster with mobile-friendly positioning */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              maxWidth: "90vw",
              fontSize: "0.875rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
