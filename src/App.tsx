
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Discussions from "./pages/Discussions";
import Career from "./pages/Career";
import Alumni from "./pages/Alumni";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/events" element={<Events />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/career" element={<Career />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
