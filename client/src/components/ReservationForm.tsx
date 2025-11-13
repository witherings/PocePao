import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const reservationFormSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  guests: z.coerce.number().int().min(1, "Mindestens 1 Person").max(20, "Maximal 20 Personen"),
  phone: z.string().min(5, "Bitte geben Sie eine gültige Telefonnummer ein"),
  date: z.string().min(1, "Bitte wählen Sie ein Datum"),
  time: z.string().min(1, "Bitte wählen Sie eine Uhrzeit"),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export function ReservationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: "",
      guests: 2,
      phone: "",
      date: "",
      time: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ReservationFormValues) => {
      return apiRequest("POST", "/api/reservations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({
        title: "Reservierung erfolgreich!",
        description: "Wir haben Ihre Reservierung erhalten und werden uns bei Ihnen melden.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Reservierung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      });
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-4 md:mb-6">
        <p className="text-xs md:text-sm text-ocean font-poppins font-semibold mb-1 md:mb-2" data-testid="text-reservation-subtitle">
          Reservierungsformular
        </p>
        <h2 className="font-poppins text-lg md:text-3xl font-bold text-foreground mb-1 md:mb-2" data-testid="text-reservation-title">
          Herzlich Willkommen! Reservieren Sie jetzt Ihren Tisch.
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vor- und Nachname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Vor- und Nachname"
                    {...field}
                    data-testid="input-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anzahl der Personen</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Anzahl der Personen"
                      {...field}
                      data-testid="input-guests"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Telefon"
                      {...field}
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datum</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uhrzeit</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      data-testid="input-time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ocean hover:bg-ocean-dark font-poppins font-bold text-base md:text-lg py-5 md:py-6"
            disabled={mutation.isPending}
            data-testid="button-submit-reservation"
          >
            {mutation.isPending ? "Wird gesendet..." : "Reservierung"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
