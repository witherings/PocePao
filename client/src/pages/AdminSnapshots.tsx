import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Save, 
  RotateCcw, 
  Trash2, 
  Clock,
  FileText,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface Snapshot {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function AdminSnapshots() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState("");
  const [newSnapshotDescription, setNewSnapshotDescription] = useState("");

  // Fetch all snapshots
  const { data: snapshots, isLoading } = useQuery<Snapshot[]>({
    queryKey: ["/api/admin/snapshots"],
  });

  // Create snapshot mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await apiRequest("POST", "/api/admin/snapshots", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/snapshots"] });
      toast({
        title: "Snapshot erstellt",
        description: "Ihr Snapshot wurde erfolgreich gespeichert",
      });
      setIsCreateDialogOpen(false);
      setNewSnapshotName("");
      setNewSnapshotDescription("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.message || "Snapshot konnte nicht erstellt werden",
      });
    },
  });

  // Restore snapshot mutation
  const restoreMutation = useMutation({
    mutationFn: async (snapshotId: string) => {
      return await apiRequest("POST", `/api/admin/snapshots/${snapshotId}/restore`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/snapshots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Wiederhergestellt!",
        description: "Der Snapshot wurde erfolgreich wiederhergestellt",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.message || "Snapshot konnte nicht wiederhergestellt werden",
      });
    },
  });

  // Delete snapshot mutation
  const deleteMutation = useMutation({
    mutationFn: async (snapshotId: string) => {
      return await apiRequest("DELETE", `/api/admin/snapshots/${snapshotId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/snapshots"] });
      toast({
        title: "Gelöscht",
        description: "Snapshot wurde gelöscht",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.message || "Snapshot konnte nicht gelöscht werden",
      });
    },
  });

  const handleCreateSnapshot = () => {
    if (!newSnapshotName.trim()) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte geben Sie einen Namen ein",
      });
      return;
    }
    createMutation.mutate({
      name: newSnapshotName,
      description: newSnapshotDescription,
    });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/admin/dashboard")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-poppins text-4xl font-bold text-foreground mb-2">
                Content Snapshots
              </h1>
              <p className="text-muted-foreground font-lato">
                Speichern Sie den aktuellen Zustand der Website und stellen Sie ihn bei Bedarf wieder her
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
              <Save className="w-5 h-5 mr-2" />
              Neuer Snapshot
            </Button>
          </div>
        </div>

        {snapshots && snapshots.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-poppins text-xl font-semibold mb-2">
              Keine Snapshots vorhanden
            </h3>
            <p className="text-muted-foreground mb-6">
              Erstellen Sie Ihren ersten Content-Snapshot
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Save className="w-4 h-4 mr-2" />
              Snapshot erstellen
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {snapshots?.map((snapshot) => {
              return (
                <Card key={snapshot.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-poppins text-2xl font-bold text-foreground">
                          {snapshot.name}
                        </h3>
                      </div>
                      {snapshot.description && (
                        <p className="text-muted-foreground mb-4 font-lato">
                          {snapshot.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Gespeichert: {format(new Date(snapshot.createdAt), "dd.MM.yyyy HH:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (confirm("Website zu diesem Snapshot zurücksetzen? Alle aktuellen Änderungen gehen verloren.")) {
                            restoreMutation.mutate(snapshot.id);
                          }
                        }}
                        disabled={restoreMutation.isPending}
                        variant="default"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Wiederherstellen
                      </Button>
                      <Button
                        onClick={() => {
                          if (confirm("Snapshot wirklich löschen?")) {
                            deleteMutation.mutate(snapshot.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuer Snapshot</DialogTitle>
              <DialogDescription>
                Speichern Sie den aktuellen Zustand Ihrer Website (Menü, Kategorien, Galerie)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="z.B. Sommer-Menü 2025"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  placeholder="Optional: Beschreibung dieser Version"
                  value={newSnapshotDescription}
                  onChange={(e) => setNewSnapshotDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button 
                onClick={handleCreateSnapshot}
                disabled={createMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Speichern..." : "Snapshot erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
