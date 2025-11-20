import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, ImageIcon, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  type: string;
  createdAt: string;
}

export function AdminGallery() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [galleryType, setGalleryType] = useState<"header" | "main">("main");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: allImages = [], isLoading, isError, error } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const headerImages = allImages.filter(img => img.type === "header");
  const mainImages = allImages.filter(img => img.type === "main");
  const images = galleryType === "header" ? headerImages : mainImages;

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", galleryType);

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: "Erfolgreich",
        description: "Bild hochgeladen",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Erfolgreich",
        description: "Bild gelöscht",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Bild konnte nicht gelöscht werden",
        variant: "destructive",
      });
    },
  });

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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
        <h1 className="text-3xl font-bold mb-2">Galerie</h1>
        <p className="text-gray-600">Verwaltung der Galeriebilder</p>
      </div>

      <Card className="mb-8 border-2">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-2xl font-poppins">Bild hochladen</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Galerie-Typ:</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="galleryType"
                    value="main"
                    checked={galleryType === "main"}
                    onChange={(e) => setGalleryType(e.target.value as "main")}
                    className="mr-2"
                  />
                  <span className="text-sm">🖼️ Hauptgalerie (unten)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="galleryType"
                    value="header"
                    checked={galleryType === "header"}
                    onChange={(e) => setGalleryType(e.target.value as "header")}
                    className="mr-2"
                  />
                  <span className="text-sm">📸 Header-Galerie (oben)</span>
                </label>
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            
            {selectedFile && previewUrl ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-xl overflow-hidden bg-gray-50 p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
                <p className="text-center text-sm text-gray-600 font-medium">
                  Datei ausgewählt: {selectedFile.name}
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    size="lg"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {uploadMutation.isPending ? "Hochladen..." : "Hochladen"}
                  </Button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-ocean hover:bg-ocean/5 transition-all"
              >
                <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Datei auswählen
                </p>
                <p className="text-sm text-gray-500">
                  Klicken Sie, um ein Bild auszuwählen
                </p>
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {galleryType === "header" ? "📸 Header-Galerie" : "🖼️ Hauptgalerie"} ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Lädt...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">Fehler beim Laden der Galerie</p>
              <p className="text-sm mt-2">
                {error instanceof Error ? error.message : "Versuchen Sie, die Seite zu aktualisieren"}
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Keine Bilder in der Galerie</p>
              <p className="text-sm mt-2">Laden Sie das erste Bild oben hoch</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteMutation.mutate(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Löschen
                    </Button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(image.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
