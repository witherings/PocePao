import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Category {
  id: string;
  name: string;
  nameDE: string | null;
  icon: string | null;
  order: number;
}

interface MenuItem {
  id: string;
  name: string;
  nameDE: string | null;
  description: string | null;
  descriptionDE: string | null;
  price: string;
  categoryId: string;
  available: number;
  popular: number;
  image: string | null;
}

export function AdminMenu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      return await apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryDialog(false);
      setEditingCategory(null);
      toast({ title: "Kategorie erstellt" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      return await apiRequest("PUT", `/api/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryDialog(false);
      setEditingCategory(null);
      toast({ title: "Kategorie aktualisiert" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Kategorie konnte nicht aktualisiert werden",
        variant: "destructive" 
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/categories/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Kategorie gelöscht" });
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      return await apiRequest("POST", "/api/menu-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setShowMenuItemDialog(false);
      setEditingMenuItem(null);
      setSelectedImage(null);
      setImagePreview(null);
      toast({ title: "Gericht erstellt" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Gericht konnte nicht erstellt werden",
        variant: "destructive" 
      });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MenuItem> }) => {
      return await apiRequest("PUT", `/api/menu-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setShowMenuItemDialog(false);
      setEditingMenuItem(null);
      setSelectedImage(null);
      setImagePreview(null);
      toast({ title: "Gericht aktualisiert" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Gericht konnte nicht aktualisiert werden",
        variant: "destructive" 
      });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/menu-items/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Gericht gelöscht" });
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

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const data = {
      name: name,
      nameDE: name,
      icon: formData.get("icon") as string || null,
      order: parseInt(formData.get("order") as string) || 0,
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleSaveMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingMenuItem?.image || null;

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
          title: "❌ Fehler beim Hochladen des Bildes", 
          variant: "destructive" 
        });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string || "";
    
    const data = {
      name: name,
      nameDE: name,
      description: description,
      descriptionDE: description,
      price: formData.get("price") as string,
      categoryId: formData.get("categoryId") as string,
      available: formData.get("available") === "on" ? 1 : 0,
      popular: formData.get("popular") === "on" ? 1 : 0,
      image: imageUrl,
    };

    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem.id, data });
    } else {
      createMenuItemMutation.mutate(data);
    }
    
    setSelectedImage(null);
    setImagePreview(null);
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
        <h1 className="text-3xl font-bold mb-2">Menü</h1>
        <p className="text-gray-600">Verwaltung von Kategorien und Gerichten</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Kategorien</TabsTrigger>
          <TabsTrigger value="items">Gerichte</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kategorien ({categories.length})</CardTitle>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCategory(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Kategorie hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Kategorie bearbeiten" : "Neue Kategorie"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCategory?.nameDE || editingCategory?.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        name="icon"
                        placeholder="🍜"
                        defaultValue={editingCategory?.icon || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Reihenfolge</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={editingCategory?.order || 0}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Speichern
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <p className="font-medium">{category.nameDE || category.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerichte ({menuItems.length})</CardTitle>
              <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingMenuItem(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Gericht hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMenuItem ? "Gericht bearbeiten" : "Neues Gericht"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveMenuItem} className="space-y-6">
                    <div>
                      <Label htmlFor="item-name">Name</Label>
                      <Input
                        id="item-name"
                        name="name"
                        defaultValue={editingMenuItem?.nameDE || editingMenuItem?.name}
                        required
                        className="text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={editingMenuItem?.descriptionDE || editingMenuItem?.description || ""}
                        className="text-base"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Preis (€)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          defaultValue={editingMenuItem?.price}
                          required
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryId">Kategorie</Label>
                        <Select
                          name="categoryId"
                          defaultValue={editingMenuItem?.categoryId}
                          required
                        >
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Kategorie wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.icon} {cat.nameDE || cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Foto des Gerichts</Label>
                      
                      {/* Image Preview */}
                      <div className="mb-4">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200"
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
                        ) : editingMenuItem?.image ? (
                          <div>
                            <img 
                              src={editingMenuItem.image} 
                              alt="Current" 
                              className="w-64 h-48 object-cover rounded-lg border-2 border-gray-200 mb-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Aktuelles Foto
                            </p>
                          </div>
                        ) : (
                          <div className="w-64 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <p className="text-gray-400">Kein Bild</p>
                          </div>
                        )}
                      </div>

                      {/* File Input */}
                      <div className="flex items-center gap-4">
                        <Input
                          id="item-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Label
                          htmlFor="item-image"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          {selectedImage ? "Foto ändern" : "Foto hochladen"}
                        </Label>
                        {selectedImage && (
                          <span className="text-sm text-muted-foreground">
                            {selectedImage.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="available"
                          name="available"
                          defaultChecked={editingMenuItem?.available === 1}
                        />
                        <Label htmlFor="available">Verfügbar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="popular"
                          name="popular"
                          defaultChecked={editingMenuItem?.popular === 1}
                        />
                        <Label htmlFor="popular">Beliebt</Label>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isUploading}
                    >
                      {isUploading ? "Foto wird hochgeladen..." : "Speichern"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const category = categories.find((c) => c.id === item.categoryId);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.name}</p>
                            {item.popular === 1 && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Beliebt
                              </span>
                            )}
                            {item.available === 0 && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Nicht verfügbar
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {category?.name} • {item.price}€
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingMenuItem(item);
                            setSelectedImage(null);
                            setImagePreview(null);
                            setShowMenuItemDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMenuItemMutation.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
