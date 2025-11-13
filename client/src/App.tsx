import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Reservierung from "@/pages/Reservierung";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSnapshots from "@/pages/AdminSnapshots";
import { AdminGallery } from "@/pages/AdminGallery";
import { AdminMenu } from "@/pages/AdminMenu";
import { AdminContent } from "@/pages/AdminContent";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isAdminRoute = location.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin" component={() => <Redirect to="/admin/login" />} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/snapshots" component={AdminSnapshots} />
        <Route path="/admin/gallery" component={AdminGallery} />
        <Route path="/admin/menu" component={AdminMenu} />
        <Route path="/admin/content" component={AdminContent} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
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
