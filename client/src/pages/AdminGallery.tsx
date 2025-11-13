import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, ImageIcon, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface GalleryImage {
  id: number;
  url: string;
  filename: string;
  createdAt: string;
}

export function AdminGallery() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: images = [], isLoading, isError, error } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

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
        title: "Успешно",
        description: "Изображение загружено",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
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
        title: "Успешно",
        description: "Изображение удалено",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображение",
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
        <h1 className="text-3xl font-bold mb-2">Галерея</h1>
        <p className="text-gray-600">Управление изображениями галереи</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Загрузить изображение</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Выбран файл: {selectedFile.name}
                  </p>
                  {previewUrl && (
                    <div className="border rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Загрузка..." : "Загрузить"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Изображения ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Загрузка...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">Ошибка загрузки галереи</p>
              <p className="text-sm mt-2">
                {error instanceof Error ? error.message : "Попробуйте обновить страницу"}
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Нет изображений в галерее</p>
              <p className="text-sm mt-2">Загрузите первое изображение выше</p>
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
                      Удалить
                    </Button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(image.createdAt).toLocaleDateString('ru-RU')}
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
