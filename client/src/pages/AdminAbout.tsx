import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export function AdminAbout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/static-content", "about", { locale: "de" }],
    queryFn: async () => {
      const response = await fetch("/api/static-content/about?locale=de", {
        credentials: "include",
      });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; subtitle: string; content: string; image: string }) => {
      return await apiRequest("PUT", "/api/static-content/about", {
        locale: "de",
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        image: data.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-content"] });
      setSelectedImage(null);
      setImagePreview(null);
      toast({ title: "✅ Изменения сохранены" });
    },
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = content?.image || "/images/vitamins-bowl.png";

    // Upload image if selected
    if (selectedImage) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedImage);

        const response = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        imageUrl = result.url;
      } catch (error) {
        toast({ 
          title: "❌ Ошибка загрузки изображения", 
          variant: "destructive" 
        });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    saveMutation.mutate({
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || "",
      content: formData.get("content") as string,
      image: imageUrl,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/admin/dashboard")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Button>

        <h1 className="font-poppins text-4xl font-bold text-foreground mb-2">
          Про нас (About)
        </h1>
        <p className="text-muted-foreground font-lato mb-8">
          Редактирование страницы "О нас"
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        ) : (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-2xl font-poppins">Контент страницы</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold mb-2 block">
                    Заголовок
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={content?.title || "Über Uns"}
                    className="text-lg h-14 bg-white"
                    placeholder="Über Uns"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="text-lg font-semibold mb-2 block">
                    Подзаголовок
                  </Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    defaultValue={content?.subtitle || "Unsere Geschichte und Leidenschaft"}
                    className="text-base h-12 bg-white"
                    placeholder="Unsere Geschichte und Leidenschaft"
                  />
                </div>

                <div>
                  <Label htmlFor="image" className="text-lg font-semibold mb-2 block">
                    Фото
                  </Label>
                  
                  {/* Image Preview */}
                  <div className="mb-4">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : content?.image ? (
                      <div>
                        <img 
                          src={content.image} 
                          alt="Current" 
                          className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200 mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          Текущее фото
                        </p>
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-400">Нет изображения</p>
                      </div>
                    )}
                  </div>

                  {/* File Input */}
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {selectedImage ? "Изменить фото" : "Загрузить фото"}
                    </Label>
                    {selectedImage && (
                      <span className="text-sm text-muted-foreground">
                        {selectedImage.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="content" className="text-lg font-semibold mb-2 block">
                    Текст страницы
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={15}
                    defaultValue={content?.content || `Bei PokePao bringen wir die authentische hawaiianische Poke Bowl-Kultur nach Hamburg. Unsere Reise begann mit der Leidenschaft für frische, gesunde und unglaublich leckere Bowls.

Jede Bowl wird mit Liebe und Sorgfalt zubereitet. Wir verwenden nur die frischesten Zutaten und folgen traditionellen Rezepten, die wir mit modernen Geschmacksnoten verfeinern.

Heute sind wir stolz darauf, als eine der besten Poke Bowl Restaurants in Deutschland anerkannt zu sein. Aber für uns zählt vor allem eins: dass jeder Gast mit einem Lächeln unser Restaurant verlässt.`}
                    className="text-base leading-relaxed bg-white font-lato resize-none"
                    placeholder="Текст страницы..."
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Введите текст обычным текстом, каждый абзац с новой строки
                  </p>
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={saveMutation.isPending || isUploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg h-14"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isUploading ? "Загрузка фото..." : saveMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
