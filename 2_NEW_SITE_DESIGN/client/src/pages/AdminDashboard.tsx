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
  ShoppingCart, 
  CalendarDays, 
  Images, 
  LogOut,
  Settings
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
      title: "Menü verwalten",
      description: "Kategorien und Gerichte bearbeiten",
      icon: UtensilsCrossed,
      href: "/admin/menu",
      color: "bg-blue-500",
    },
    {
      title: "Bestellungen",
      description: "Kundenbestellungen ansehen",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500",
    },
    {
      title: "Reservierungen",
      description: "Tischreservierungen verwalten",
      icon: CalendarDays,
      href: "/admin/reservations",
      color: "bg-purple-500",
    },
    {
      title: "Galerie",
      description: "Bilder hochladen und verwalten",
      icon: Images,
      href: "/admin/gallery",
      color: "bg-orange-500",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${item.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-poppins text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-lato">
                  {item.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h2 className="font-poppins text-2xl font-bold text-foreground mb-4">
              Schnellzugriff
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/menu">
                <Button variant="outline" className="w-full justify-start">
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Menü bearbeiten
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Neue Bestellungen
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Zur Website
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
