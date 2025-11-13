import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface StaticContent {
  id: string;
  page: string;
  locale: string;
  title: string | null;
  subtitle: string | null;
  content: string;
  updatedAt: string;
}

export function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedPage, setSelectedPage] = useState<"about" | "contact">("about");
  const [selectedLocale, setSelectedLocale] = useState<"de" | "ru">("de");

  const { data: content, isLoading } = useQuery<StaticContent>({
    queryKey: ["/api/static-content", selectedPage, { locale: selectedLocale }],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/static-content/${selectedPage}?locale=${selectedLocale}`, {
          credentials: "include",
        });
        if (response.status === 404) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        return response.json();
      } catch (error) {
        return null;
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; subtitle: string; content: string }) => {
      return await apiRequest("PUT", `/api/static-content/${selectedPage}`, {
        locale: selectedLocale,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-content"] });
      toast({ title: "Inhalt gespeichert" });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Inhalt konnte nicht gespeichert werden",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveMutation.mutate({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || "",
      content: formData.get("content") as string,
    });
  };

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
        <h1 className="text-3xl font-bold mb-2">Statische Seiten</h1>
        <p className="text-gray-600">Bearbeitung der About- und Contact-Seiten</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content-Editor</CardTitle>
            <div className="flex gap-4">
              <Select value={selectedPage} onValueChange={(v) => setSelectedPage(v as "about" | "contact")}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="about">Über Uns</SelectItem>
                  <SelectItem value="contact">Kontakt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocale} onValueChange={(v) => setSelectedLocale(v as "de" | "ru")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">DE (Deutsch)</SelectItem>
                  <SelectItem value="ru">RU (Russisch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Lädt...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={content?.title || ""}
                  placeholder={`Titel für ${selectedPage} Seite`}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Untertitel</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={content?.subtitle || ""}
                  placeholder="Untertitel (optional)"
                />
              </div>

              <div>
                <Label htmlFor="content">Inhalt (JSON)</Label>
                <Textarea
                  id="content"
                  name="content"
                  rows={15}
                  defaultValue={content?.content || JSON.stringify({
                    hero: {
                      title: "",
                      description: ""
                    },
                    sections: []
                  }, null, 2)}
                  placeholder='{"hero": {"title": "", "description": ""}, "sections": []}'
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  JSON структура: hero (title, description), sections (array of heading, body, mediaUrl, layout)
                </p>
              </div>

              {content?.updatedAt && (
                <div className="text-sm text-gray-500">
                  Zuletzt aktualisiert: {new Date(content.updatedAt).toLocaleString('de-DE')}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveMutation.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
