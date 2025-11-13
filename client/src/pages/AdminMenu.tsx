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
import { Trash2, Edit, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Category {
  id: number;
  name: string;
  nameDE: string | null;
  icon: string | null;
  order: number;
}

interface MenuItem {
  id: number;
  name: string;
  nameDE: string | null;
  description: string | null;
  descriptionDE: string | null;
  price: string;
  categoryId: number;
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
      toast({ title: "Категория создана" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Category> }) => {
      return await apiRequest("PUT", `/api/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setShowCategoryDialog(false);
      setEditingCategory(null);
      toast({ title: "Категория обновлена" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/categories/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Категория удалена" });
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
      toast({ title: "Блюдо создано" });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MenuItem> }) => {
      return await apiRequest("PUT", `/api/menu-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setShowMenuItemDialog(false);
      setEditingMenuItem(null);
      toast({ title: "Блюдо обновлено" });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/menu-items/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Блюдо удалено" });
    },
  });

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      nameDE: formData.get("nameDE") as string || null,
      icon: formData.get("icon") as string || null,
      order: parseInt(formData.get("order") as string) || 0,
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleSaveMenuItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      nameDE: formData.get("nameDE") as string || null,
      description: formData.get("description") as string || null,
      descriptionDE: formData.get("descriptionDE") as string || null,
      price: formData.get("price") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      available: formData.get("available") === "on" ? 1 : 0,
      popular: formData.get("popular") === "on" ? 1 : 0,
      image: formData.get("image") as string || null,
    };

    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem.id, data });
    } else {
      createMenuItemMutation.mutate(data);
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
        <h1 className="text-3xl font-bold mb-2">Меню</h1>
        <p className="text-gray-600">Управление категориями и блюдами</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="items">Блюда</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Категории ({categories.length})</CardTitle>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCategory(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить категорию
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Редактировать категорию" : "Новая категория"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название (RU)</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCategory?.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameDE">Название (DE)</Label>
                      <Input
                        id="nameDE"
                        name="nameDE"
                        defaultValue={editingCategory?.nameDE || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="icon">Иконка</Label>
                      <Input
                        id="icon"
                        name="icon"
                        placeholder="🍜"
                        defaultValue={editingCategory?.icon || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Порядок</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={editingCategory?.order || 0}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Сохранить
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
                        <p className="font-medium">{category.name}</p>
                        {category.nameDE && (
                          <p className="text-sm text-gray-500">{category.nameDE}</p>
                        )}
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
              <CardTitle>Блюда ({menuItems.length})</CardTitle>
              <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingMenuItem(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить блюдо
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMenuItem ? "Редактировать блюдо" : "Новое блюдо"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveMenuItem} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="item-name">Название (RU)</Label>
                        <Input
                          id="item-name"
                          name="name"
                          defaultValue={editingMenuItem?.name}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="item-nameDE">Название (DE)</Label>
                        <Input
                          id="item-nameDE"
                          name="nameDE"
                          defaultValue={editingMenuItem?.nameDE || ""}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Описание (RU)</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingMenuItem?.description || ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="descriptionDE">Описание (DE)</Label>
                      <Textarea
                        id="descriptionDE"
                        name="descriptionDE"
                        defaultValue={editingMenuItem?.descriptionDE || ""}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Цена</Label>
                        <Input
                          id="price"
                          name="price"
                          defaultValue={editingMenuItem?.price}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryId">Категория</Label>
                        <Select
                          name="categoryId"
                          defaultValue={editingMenuItem?.categoryId.toString()}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.icon} {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image">URL изображения</Label>
                      <Input
                        id="image"
                        name="image"
                        defaultValue={editingMenuItem?.image || ""}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="available"
                          name="available"
                          defaultChecked={editingMenuItem?.available === 1}
                        />
                        <Label htmlFor="available">Доступно</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="popular"
                          name="popular"
                          defaultChecked={editingMenuItem?.popular === 1}
                        />
                        <Label htmlFor="popular">Популярное</Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Сохранить
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
                                Популярное
                              </span>
                            )}
                            {item.available === 0 && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Недоступно
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
