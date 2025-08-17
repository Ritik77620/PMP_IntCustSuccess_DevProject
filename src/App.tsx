import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Projects } from "@/pages/Projects";
import { WeeklyTracker } from "@/pages/WeeklyTracker";
import { TicketingSystem } from "@/pages/TicketingSystem";
import { Masters } from "@/pages/Masters";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import NotFound from "./pages/NotFound";

// Masters Subpages
import { ProjectMaster } from "@/pages/masters/ProjectMaster";
import { ClientMaster } from "@/pages/masters/ClientMaster";
import { VendorMaster } from "@/pages/masters/VendorMaster";
import { MilestoneMaster } from "@/pages/masters/MilestoneMaster";
import { UserMaster } from "@/pages/masters/UserMaster";

import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="timesheet" element={<WeeklyTracker />} />
              <Route path="reports" element={<TicketingSystem />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              {/* Masters Main Page */}
              <Route path="masters" element={<Masters />} />

              {/* Masters Subpages */}
              <Route path="masters/project" element={<ProjectMaster />} />
              <Route path="masters/client" element={<ClientMaster />} />
              <Route path="masters/vendor" element={<VendorMaster />} />
              <Route path="masters/milestone" element={<MilestoneMaster />} />
              <Route path="masters/user" element={<UserMaster />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
