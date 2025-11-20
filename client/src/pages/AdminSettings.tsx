import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

interface AppSettings {
  maintenanceMode: number;
}

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<AppSettings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newSettings),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setSuccessMessage("Einstellungen erfolgreich gespeichert!");
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  const handleMaintenanceModeToggle = (enabled: boolean) => {
    updateSettings.mutate({ maintenanceMode: enabled ? 1 : 0 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link href="/admin">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Button>
      </Link>
      
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl mb-2">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die globalen Einstellungen für Ihre Website
        </p>
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Wartungsmodus</CardTitle>
          <CardDescription>
            Aktivieren Sie den Wartungsmodus, um die Website für Besucher zu sperren
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="maintenance-mode" className="text-base font-semibold">
                Wartungsmodus aktivieren
              </Label>
              <p className="text-sm text-muted-foreground">
                Besucher sehen eine Wartungsseite. Der Admin-Bereich bleibt zugänglich.
              </p>
            </div>
            <Switch
              id="maintenance-mode"
              checked={settings?.maintenanceMode === 1}
              onCheckedChange={handleMaintenanceModeToggle}
              disabled={updateSettings.isPending}
            />
          </div>

          {settings?.maintenanceMode === 1 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Wartungsmodus ist aktiv!</strong> Ihre Website ist für Besucher nicht erreichbar.
                <br />
                Um die Website wieder freizugeben, deaktivieren Sie den Wartungsmodus.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
