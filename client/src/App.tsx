import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MaintenanceOverlay } from "@/components/MaintenanceOverlay";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Reservierung from "@/pages/Reservierung";
import Gallery from "@/pages/Gallery";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSnapshots from "@/pages/AdminSnapshots";
import AdminSettings from "@/pages/AdminSettings";
import { AdminGallery } from "@/pages/AdminGallery";
import { AdminMenu } from "@/pages/AdminMenu";
import { AdminReservations } from "@/pages/AdminReservations";
import { AdminContent } from "@/pages/AdminContent";
import { AdminAbout } from "@/pages/AdminAbout";
import { AdminContact } from "@/pages/AdminContact";
import { AdminHome } from "@/pages/AdminHome";
import NotFound from "@/pages/not-found";

function AdminRedirect() {
  const { data: user, isLoading } = useQuery<{ id: string; username: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/admin/dashboard" />;
  }

  return <Redirect to="/admin/login" />;
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin" component={AdminRedirect} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/snapshots" component={AdminSnapshots} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/menu" component={AdminMenu} />
        <Route path="/admin/reservations" component={AdminReservations} />
        <Route path="/admin/content" component={AdminContent} />
        <Route path="/admin/home" component={AdminHome} />
        <Route path="/admin/about" component={AdminAbout} />
        <Route path="/admin/contact" component={AdminContact} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/reservierung" component={Reservierung} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!isAdminRoute && <MaintenanceOverlay />}
        <div className="min-h-screen flex flex-col">
          {!isAdminRoute && <Header />}
          <main className="flex-1">
            <Router />
          </main>
          {!isAdminRoute && <Footer />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
