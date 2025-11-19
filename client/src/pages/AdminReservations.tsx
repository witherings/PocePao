import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, Phone, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Reservation {
  id: string;
  name: string;
  guests: number;
  phone: string;
  date: string;
  time: string;
}

export function AdminReservations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: reservations = [], isLoading, isError } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  const deleteReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/reservations/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({ title: "Reservierung gelöscht" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Reservierung konnte nicht gelöscht werden",
        variant: "destructive" 
      });
    },
  });

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/admin/dashboard")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-2">Reservierungen</h1>
        <p className="text-gray-600">Verwaltung der Tischreservierungen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Reservierungen ({reservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Lädt...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">Fehler beim Laden der Reservierungen</p>
              <p className="text-sm mt-2">Versuchen Sie, die Seite zu aktualisieren</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Keine Reservierungen vorhanden</p>
              <p className="text-sm mt-2">Neue Reservierungen erscheinen hier</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Datum</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Uhrzeit</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Gäste</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Telefon</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations.map((reservation) => {
                    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
                    const isPast = reservationDate < new Date();
                    
                    return (
                      <tr 
                        key={reservation.id} 
                        className={`border-b hover:bg-gray-50 ${isPast ? 'opacity-60' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-700 font-semibold text-sm">
                                {reservation.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{reservation.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {format(new Date(reservation.date), 'dd. MMM yyyy', { locale: de })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {reservation.time}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4 text-gray-400" />
                            {reservation.guests} {reservation.guests === 1 ? 'Gast' : 'Gäste'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`tel:${reservation.phone}`} 
                              className="hover:text-blue-600 hover:underline"
                            >
                              {reservation.phone}
                            </a>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteReservationMutation.mutate(reservation.id)}
                            disabled={deleteReservationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Löschen
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
