// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useBackendConnection } from "./hooks/useBackendConnection";
import { ConnectionSpinner } from "./components/Spinner";

function App() {
  const isBackendConnected = useBackendConnection();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Mostra o spinner enquanto não conectar */}
        {!isBackendConnected && <ConnectionSpinner />}

        {/* Navigation Bar - Fixed at top */}
        <header className="sticky top-0 z-10">
          <Navbar />
        </header>

        {/* Main Content - Só mostra quando conectar */}
        {isBackendConnected && (
          <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/appointment"></Route>
              </Routes>
            </div>
          </main>
        )}

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
