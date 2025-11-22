import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Images, 
  LogOut,
  Settings,
  Save,
  Calendar
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if authenticated
  const { data: user, isLoading, isError } = useQuery<{ id: string; username: string }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet",
      });
      setLocation("/admin/login");
    },
  });

  useEffect(() => {
    if (!isLoading && isError) {
      setLocation("/admin/login");
    }
  }, [isLoading, isError, setLocation]);

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

  if (isError || !user) {
    return null;
  }

  const menuItems = [
    {
      title: "Snapshots",
      description: "Content-Versionen verwalten",
      icon: Save,
      href: "/admin/snapshots",
      color: "bg-indigo-500",
    },
    {
      title: "Menü verwalten",
      description: "Kategorien und Gerichte bearbeiten",
      icon: UtensilsCrossed,
      href: "/admin/menu",
      color: "bg-blue-500",
    },
    {
      title: "Reservierungen",
      description: "Tischreservierungen verwalten",
      icon: Calendar,
      href: "/admin/reservations",
      color: "bg-rose-500",
    },
    {
      title: "Startseite",
      description: "Header-Slider, Galerie und Hero-Section bearbeiten",
      icon: Images,
      href: "/admin/home",
      color: "bg-cyan-500",
    },
    {
      title: "Über Uns",
      description: "About-Seite bearbeiten",
      icon: Settings,
      href: "/admin/about",
      color: "bg-purple-500",
    },
    {
      title: "Kontakt",
      description: "Kontaktseite bearbeiten",
      icon: Settings,
      href: "/admin/contact",
      color: "bg-green-500",
    },
    {
      title: "Einstellungen",
      description: "Wartungsmodus und globale Einstellungen",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-poppins text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground font-lato">
              Willkommen, {user.username}!
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-ocean/50">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-poppins text-2xl font-bold text-foreground mb-3 group-hover:text-ocean transition-colors">
                  {item.title}
                </h3>
                <p className="text-base text-muted-foreground font-lato leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button size="lg" variant="outline" className="font-semibold">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Zur Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
