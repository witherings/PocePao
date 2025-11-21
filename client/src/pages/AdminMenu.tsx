import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, ArrowLeft, Upload, X, Settings, ArrowUp, ArrowDown, List } from "lucide-react";
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
  priceSmall?: string | null;
  categoryId: string;
  available: number;
  popular: number;
  image: string | null;
  ingredients?: string[] | null;
  allergens?: string[] | null;
  protein?: string | null;
  marinade?: string | null;
  sauce?: string | null;
  toppings?: string[] | null;
  enableBaseSelection?: number;
  hasVariants?: number;
  variantType?: string | null;
  requiresVariantSelection?: number;
}

interface ProductVariant {
  id: string;
  menuItemId: string;
  name: string;
  nameDE: string;
  type: string;
  order: number;
  available: number;
}

interface Ingredient {
  id: string;
  name: string;
  nameDE: string | null;
  type: string;
  description: string | null;
  descriptionDE: string | null;
  image: string | null;
  price: string | null;
  priceSmall: string | null;
  priceStandard: string | null;
  order: number;
  available: number;
}

interface DeleteConfirmation {
  type: "category" | "menuItem" | "ingredient" | "variant" | null;
  id: string | null;
  name?: string;
}

export function AdminMenu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({ type: null, id: null });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false);
  const [showIngredientDialog, setShowIngredientDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedIngredientType, setSelectedIngredientType] = useState<string>("");
  const [ingredientFilterType, setIngredientFilterType] = useState<string | null>(null);
  const [createAsExtraCheckbox, setCreateAsExtraCheckbox] = useState(false);
  
  const [showVariantsDialog, setShowVariantsDialog] = useState(false);
  const [managingVariantsForItem, setManagingVariantsForItem] = useState<MenuItem | null>(null);
  const [variantFormData, setVariantFormData] = useState({
    hasVariants: false,
    variantType: "base" as "base" | "flavor",
    requiresVariantSelection: false,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [showVariantEditDialog, setShowVariantEditDialog] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ["/api/ingredients"],
  });

  // Helper function to check if a category is "Wunsch Bowls"
  const isWunschBowlCategory = (categoryId: string): boolean => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nameDE === "Wunsch Bowls" || category?.name === "Custom Bowls" || category?.name === "Wunsch Bowls";
  };

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

  const createIngredientMutation = useMutation({
    mutationFn: async (data: Partial<Ingredient>) => {
      return await apiRequest("POST", "/api/ingredients", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ingredients"] });
      setShowIngredientDialog(false);
      setEditingIngredient(null);
      setSelectedImage(null);
      setImagePreview(null);
      toast({ title: "Zutat erstellt" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Zutat konnte nicht erstellt werden",
        variant: "destructive" 
      });
    },
  });

  const updateIngredientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Ingredient> }) => {
      return await apiRequest("PUT", `/api/ingredients/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ingredients"] });
      setShowIngredientDialog(false);
      setEditingIngredient(null);
      setSelectedImage(null);
      setImagePreview(null);
      toast({ title: "Zutat aktualisiert" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Fehler", 
        description: error.message || "Zutat konnte nicht aktualisiert werden",
        variant: "destructive" 
      });
    },
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/ingredients/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ingredients"] });
      toast({ title: "Zutat gelöscht" });
    },
  });

  // Variant management mutations
  const createVariantMutation = useMutation({
    mutationFn: async (data: Partial<ProductVariant>) => {
      return await apiRequest("POST", "/api/product-variants", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-variants"] });
      if (managingVariantsForItem) {
        loadVariantsForItem(managingVariantsForItem.id);
      }
      toast({ title: "Variante erstellt" });
      setShowVariantEditDialog(false);
      setEditingVariant(null);
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductVariant> }) => {
      return await apiRequest("PUT", `/api/product-variants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-variants"] });
      if (managingVariantsForItem) {
        loadVariantsForItem(managingVariantsForItem.id);
      }
      toast({ title: "Variante aktualisiert" });
      setShowVariantEditDialog(false);
      setEditingVariant(null);
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/product-variants/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-variants"] });
      if (managingVariantsForItem) {
        loadVariantsForItem(managingVariantsForItem.id);
      }
      toast({ title: "Variante gelöscht" });
    },
  });

  const updateMenuItemVariantSettingsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MenuItem> }) => {
      return await apiRequest("PUT", `/api/menu-items/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Varianteneinstellungen aktualisiert" });
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
    const categoryId = formData.get("categoryId") as string;
    const priceSmall = formData.get("priceSmall") as string;
    const ingredientsStr = formData.get("ingredients") as string;
    const allergensStr = formData.get("allergens") as string;
    const toppingsStr = formData.get("toppings") as string;
    
    // For Wunsch Bowls, price is dynamic and calculated from ingredients
    const isWunschBowl = isWunschBowlCategory(categoryId);
    const price = isWunschBowl ? "0" : (formData.get("price") as string);
    
    const data: any = {
      name: name,
      nameDE: name,
      description: description,
      descriptionDE: description,
      price: price,
      priceSmall: isWunschBowl ? null : (priceSmall || null),
      hasSizeOptions: isWunschBowl ? 0 : (priceSmall ? 1 : 0),
      categoryId: formData.get("categoryId") as string,
      available: formData.get("available") === "on" ? 1 : 0,
      popular: formData.get("popular") === "on" ? 1 : 0,
      enableBaseSelection: formData.get("enableBaseSelection") === "on" ? 1 : 0,
      image: imageUrl,
      ingredients: ingredientsStr ? ingredientsStr.split(",").map(i => i.trim()).filter(Boolean) : null,
      allergens: allergensStr ? allergensStr.split(",").map(a => a.trim()).filter(Boolean) : null,
      protein: formData.get("protein") as string || null,
      marinade: formData.get("marinade") as string || null,
      sauce: formData.get("sauce") as string || null,
      toppings: toppingsStr ? toppingsStr.split(",").map(t => t.trim()).filter(Boolean) : null,
    };

    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem.id, data });
    } else {
      createMenuItemMutation.mutate(data);
    }
    
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSaveIngredient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate that type is selected
    if (!selectedIngredientType) {
      toast({ 
        title: "Fehler", 
        description: "Bitte wählen Sie einen Typ aus",
        variant: "destructive" 
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingIngredient?.image || null;

    // Upload image if selected
    if (selectedImage) {
      setIsUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("image", selectedImage);
        uploadFormData.append("type", selectedIngredientType);
        uploadFormData.append("category", "Wunsch Bowls");
        uploadFormData.append("duplicateToExtra", "true");

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
    const price = formData.get("price") as string;
    const priceSmall = formData.get("priceSmall") as string;
    const priceStandard = formData.get("priceStandard") as string;
    const ingredientType = selectedIngredientType;
    
    const data: any = {
      name: name,
      nameDE: name,
      description: description,
      descriptionDE: description,
      type: ingredientType,
      image: imageUrl,
      price: price || null,
      priceSmall: priceSmall || null,
      priceStandard: priceStandard || null,
      available: formData.get("available") === "on" ? 1 : 0,
    };

    if (editingIngredient) {
      updateIngredientMutation.mutate({ id: editingIngredient.id, data }, {
        onSuccess: () => {
          if (createAsExtraCheckbox && ingredientType !== "extra_protein" && ingredientType !== "extra_fresh" && ingredientType !== "extra_sauce" && ingredientType !== "extra_topping") {
            // Map base types to extra types
            const extraTypeMap: Record<string, string> = {
              'protein': 'extra_protein',
              'fresh': 'extra_fresh',
              'sauce': 'extra_sauce',
              'topping': 'extra_topping'
            };
            const extraType = extraTypeMap[ingredientType] || `extra_${ingredientType}`;
            
            const extraData: any = {
              name: name,
              nameDE: name,
              description: description,
              descriptionDE: description,
              type: extraType,
              image: imageUrl,
              price: null,
              priceSmall: null,
              priceStandard: null,
              available: formData.get("available") === "on" ? 1 : 0,
            };
            const existingExtra = ingredients.find(ing => ing.type === extraType && ing.nameDE === name);
            if (!existingExtra) {
              createIngredientMutation.mutate(extraData);
            }
          }
          setCreateAsExtraCheckbox(false);
        }
      });
    } else {
      createIngredientMutation.mutate(data, {
        onSuccess: () => {
          if (createAsExtraCheckbox && ingredientType !== "extra_protein" && ingredientType !== "extra_fresh" && ingredientType !== "extra_sauce" && ingredientType !== "extra_topping") {
            // Map base types to extra types
            const extraTypeMap: Record<string, string> = {
              'protein': 'extra_protein',
              'fresh': 'extra_fresh',
              'sauce': 'extra_sauce',
              'topping': 'extra_topping'
            };
            const extraType = extraTypeMap[ingredientType] || `extra_${ingredientType}`;
            
            const extraData: any = {
              name: name,
              nameDE: name,
              description: description,
              descriptionDE: description,
              type: extraType,
              image: imageUrl,
              price: null,
              priceSmall: null,
              priceStandard: null,
              available: formData.get("available") === "on" ? 1 : 0,
            };
            createIngredientMutation.mutate(extraData);
          }
          setCreateAsExtraCheckbox(false);
        }
      });
    }
    
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Variant management handlers
  const loadVariantsForItem = async (menuItemId: string) => {
    try {
      const response = await fetch(`/api/product-variants/menu-item/${menuItemId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch variants");
      const data = await response.json();
      setVariants(data.sort((a: ProductVariant, b: ProductVariant) => a.order - b.order));
    } catch (error) {
      toast({ title: "Fehler beim Laden der Varianten", variant: "destructive" });
    }
  };

  const handleOpenVariantDialog = async (item: MenuItem) => {
    setManagingVariantsForItem(item);
    setVariantFormData({
      hasVariants: item.hasVariants === 1,
      variantType: (item.variantType as "base" | "flavor") || "base",
      requiresVariantSelection: item.requiresVariantSelection === 1,
    });
    await loadVariantsForItem(item.id);
    setShowVariantsDialog(true);
  };

  const handleSaveVariantSettings = () => {
    if (!managingVariantsForItem) return;
    
    updateMenuItemVariantSettingsMutation.mutate({
      id: managingVariantsForItem.id,
      data: {
        hasVariants: variantFormData.hasVariants ? 1 : 0,
        variantType: variantFormData.variantType,
        requiresVariantSelection: variantFormData.requiresVariantSelection ? 1 : 0,
      },
    });
  };

  const handleSaveVariant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!managingVariantsForItem) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    
    const data = {
      menuItemId: managingVariantsForItem.id,
      name: name,
      nameDE: name,
      type: variantFormData.variantType,
      available: formData.get("available") === "on" ? 1 : 0,
    };

    if (editingVariant) {
      updateVariantMutation.mutate({ id: editingVariant.id, data });
    } else {
      createVariantMutation.mutate(data);
    }
  };

  const handleMoveVariant = (variantId: string, direction: "up" | "down") => {
    const index = variants.findIndex(v => v.id === variantId);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= variants.length) return;

    // Swap orders
    const variant1 = variants[index];
    const variant2 = variants[newIndex];
    
    updateVariantMutation.mutate({ id: variant1.id, data: { order: variant2.order } });
    updateVariantMutation.mutate({ id: variant2.id, data: { order: variant1.order } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/admin/dashboard")}
            className="mb-6 -ml-2 hover:bg-ocean/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Dashboard
          </Button>
          <h1 className="font-poppins text-4xl font-bold mb-3 text-foreground">Menü</h1>
          <p className="font-lato text-lg text-muted-foreground">Verwaltung von Kategorien und Gerichten</p>
        </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-8 p-1.5 bg-white shadow-sm">
          <TabsTrigger value="categories" className="font-semibold px-6 py-2.5 data-[state=active]:bg-ocean data-[state=active]:text-white">Kategorien</TabsTrigger>
          <TabsTrigger value="items" className="font-semibold px-6 py-2.5 data-[state=active]:bg-ocean data-[state=active]:text-white">Gerichte</TabsTrigger>
          <TabsTrigger value="ingredients" className="font-semibold px-6 py-2.5 data-[state=active]:bg-ocean data-[state=active]:text-white">Zutaten</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card className="border-2 shadow-lg">
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
                  <form onSubmit={handleSaveCategory} className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold mb-2">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCategory?.nameDE || editingCategory?.name}
                        required
                        className="h-12 text-base px-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="icon" className="text-base font-semibold mb-2">Icon</Label>
                      <Input
                        id="icon"
                        name="icon"
                        placeholder="🍜"
                        defaultValue={editingCategory?.icon || ""}
                        className="h-12 text-base px-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="order" className="text-base font-semibold mb-2">Reihenfolge</Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        defaultValue={editingCategory?.order || 0}
                        className="h-12 text-base px-4"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-semibold bg-ocean hover:bg-ocean/90">
                      Speichern
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-5 border-2 rounded-xl hover:border-ocean/30 hover:bg-ocean/5 transition-all duration-200 shadow-sm"
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
                        onClick={() => setDeleteConfirm({ type: "category", id: category.id, name: category.nameDE || category.name })}
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
          <Card className="border-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerichte ({menuItems.length})</CardTitle>
              <Dialog open={showMenuItemDialog} onOpenChange={(open) => {
                setShowMenuItemDialog(open);
                if (!open) {
                  setSelectedCategoryId("");
                  setEditingMenuItem(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingMenuItem(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setSelectedCategoryId("");
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
                      <Label htmlFor="item-name" className="text-base font-semibold mb-2">Name</Label>
                      <Input
                        id="item-name"
                        name="name"
                        defaultValue={editingMenuItem?.nameDE || editingMenuItem?.name}
                        required
                        className="h-12 text-base px-4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-semibold mb-2">Beschreibung</Label>
                      <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={editingMenuItem?.descriptionDE || editingMenuItem?.description || ""}
                        className="text-base px-4 py-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="categoryId" className="text-base font-semibold mb-2">Kategorie</Label>
                        <Select
                          name="categoryId"
                          defaultValue={editingMenuItem?.categoryId}
                          required
                          onValueChange={(value) => setSelectedCategoryId(value)}
                        >
                          <SelectTrigger className="h-12 text-base px-4">
                            <SelectValue placeholder="Kategorie wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="text-base">
                                {cat.icon} {cat.nameDE || cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Hide prices for Wunsch Bowls - price is dynamic based on user selection */}
                    {!isWunschBowlCategory(selectedCategoryId || editingMenuItem?.categoryId || "") && (
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="price" className="text-base font-semibold mb-2">Preis Standard (€) *</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            defaultValue={editingMenuItem?.price}
                            required
                            placeholder="Hauptpreis (erforderlich)"
                            className="h-12 text-base px-4"
                          />
                          <p className="text-xs text-muted-foreground mt-1.5">Standardgröße oder einziger Preis</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="priceSmall" className="text-base font-semibold mb-2">Preis Klein (€) - Optional</Label>
                          <Input
                            id="priceSmall"
                            name="priceSmall"
                            type="number"
                            step="0.01"
                            defaultValue={editingMenuItem?.priceSmall || ""}
                            placeholder="Nur wenn Klein-Größe vorhanden"
                            className="h-12 text-base px-4"
                          />
                          <p className="text-xs text-muted-foreground mt-1.5">Für Pokébowls: Klein = 9.90€, Standard = 14.75€</p>
                        </div>
                      </div>
                    )}

                    {/* Wunsch Bowl Info */}
                    {isWunschBowlCategory(selectedCategoryId || editingMenuItem?.categoryId || "") && (
                      <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-lg">
                        <h3 className="font-poppins text-lg font-bold text-purple-900 mb-2">⭐ Wunsch Bowl</h3>
                        <p className="text-sm text-purple-800">
                          Für Wunsch Bowls wird die Preisgestaltung nicht hier festgelegt, da der Preis dynamisch aus den vom Kunden ausgewählten Zutaten (Protein, Base, Frische Zutaten, etc.) berechnet wird. Die Preise werden in der Zutatenverwaltung festgelegt.
                        </p>
                      </div>
                    )}

                    {/* Poke Bowl Special Fields */}
                    {(selectedCategoryId && categories.find(c => c.id === selectedCategoryId)?.name === "Poke Bowls" || 
                      (!selectedCategoryId && editingMenuItem && categories.find(c => c.id === editingMenuItem.categoryId)?.name === "Poke Bowls")) && (
                      <div className="space-y-5 p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <h3 className="font-poppins text-lg font-bold text-blue-900 mb-3">🥗 Poke Bowl Details</h3>
                        
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <Label htmlFor="protein" className="text-base font-semibold mb-2">Protein</Label>
                            <Input
                              id="protein"
                              name="protein"
                              defaultValue={editingMenuItem?.protein || ""}
                              placeholder="z.B. Lachs"
                              className="h-12 text-base px-4"
                            />
                          </div>
                          <div>
                            <Label htmlFor="marinade" className="text-base font-semibold mb-2">Marinade</Label>
                            <Input
                              id="marinade"
                              name="marinade"
                              defaultValue={editingMenuItem?.marinade || ""}
                              placeholder="z.B. Soja-Sesam"
                              className="h-12 text-base px-4"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="sauce" className="text-base font-semibold mb-2">Sauce</Label>
                          <Input
                            id="sauce"
                            name="sauce"
                            defaultValue={editingMenuItem?.sauce || ""}
                            placeholder="z.B. Spicy Mayo"
                            className="h-12 text-base px-4"
                          />
                        </div>

                        <div>
                          <Label htmlFor="ingredients" className="text-base font-semibold mb-2">Frische Zutaten (kommagetrennt)</Label>
                          <Textarea
                            id="ingredients"
                            name="ingredients"
                            rows={2}
                            defaultValue={editingMenuItem?.ingredients?.join(", ") || ""}
                            placeholder="z.B. Edamame, Gurke, Avocado, Mais"
                            className="text-base px-4 py-3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="toppings" className="text-base font-semibold mb-2">Toppings (kommagetrennt)</Label>
                          <Textarea
                            id="toppings"
                            name="toppings"
                            rows={2}
                            defaultValue={editingMenuItem?.toppings?.join(", ") || ""}
                            placeholder="z.B. Sesam, Frühlingszwiebeln, Nori"
                            className="text-base px-4 py-3"
                          />
                        </div>
                      </div>
                    )}


                    <div>
                      <Label htmlFor="allergens" className="text-base font-semibold mb-2">Allergene (kommagetrennt) - Optional</Label>
                      <Textarea
                        id="allergens"
                        name="allergens"
                        rows={2}
                        defaultValue={editingMenuItem?.allergens?.join(", ") || ""}
                        placeholder="z.B. Fisch, Soja, Sesam, Gluten"
                        className="text-base px-4 py-3"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Trennen Sie mehrere Allergene mit Kommas</p>
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

                    <div className="flex flex-col gap-3">
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
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-ocean hover:bg-ocean/90"
                      disabled={isUploading}
                    >
                      {isUploading ? "Foto wird hochgeladen..." : "Speichern"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category) => {
                    const categoryItems = menuItems.filter(
                      (item) => item.categoryId === category.id
                    );
                    
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-ocean/10 to-transparent rounded-lg border-l-4 border-ocean">
                          <span className="text-3xl">{category.icon}</span>
                          <div>
                            <h3 className="font-poppins text-xl font-bold text-ocean">
                              {category.nameDE || category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryItems.length} {categoryItems.length === 1 ? 'Gericht' : 'Gerichte'}
                            </p>
                          </div>
                        </div>
                        
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-5 border-2 rounded-xl hover:border-ocean/30 hover:bg-ocean/5 transition-all duration-200 shadow-sm ml-4"
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
                                  <p className="font-medium">{item.nameDE || item.name}</p>
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
                                {item.descriptionDE && (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {item.descriptionDE}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                title="Varianten verwalten"
                                onClick={() => handleOpenVariantDialog(item)}
                              >
                                <List className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingMenuItem(item);
                                  setSelectedImage(null);
                                  setImagePreview(null);
                                  setSelectedCategoryId(item.categoryId);
                                  setShowMenuItemDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteConfirm({ type: "menuItem", id: item.id, name: item.nameDE || item.name })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients">
          <Card className="border-2 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Zutaten ({ingredients.length})</CardTitle>
              <Dialog open={showIngredientDialog} onOpenChange={setShowIngredientDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingIngredient(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setSelectedIngredientType("");
                    setCreateAsExtraCheckbox(false);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Zutat hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingIngredient ? "Zutat bearbeiten" : "Neue Zutat"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveIngredient} className="space-y-5">
                    {/* Hidden input to ensure type is sent in FormData */}
                    <Input
                      type="hidden"
                      name="type"
                      value={selectedIngredientType || editingIngredient?.type || ""}
                    />
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="ing-name" className="text-base font-semibold mb-2">Name</Label>
                        <Input
                          id="ing-name"
                          name="name"
                          defaultValue={editingIngredient?.nameDE || editingIngredient?.name}
                          required
                          className="h-12 text-base px-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ing-type" className="text-base font-semibold mb-2">Typ *</Label>
                        <Select
                          value={selectedIngredientType || editingIngredient?.type || ""}
                          required
                          onValueChange={(value) => setSelectedIngredientType(value)}
                        >
                          <SelectTrigger className="h-12 text-base px-4">
                            <SelectValue placeholder="Typ wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="protein" className="text-base">Protein</SelectItem>
                            <SelectItem value="base" className="text-base">Base</SelectItem>
                            <SelectItem value="marinade" className="text-base">Marinade</SelectItem>
                            <SelectItem value="fresh" className="text-base">Frische Zutat</SelectItem>
                            <SelectItem value="sauce" className="text-base">Sauce</SelectItem>
                            <SelectItem value="topping" className="text-base">Topping</SelectItem>
                            <SelectItem value="extra_protein" className="text-base">Extra Protein</SelectItem>
                            <SelectItem value="extra_fresh" className="text-base">Extra Frische Zutat</SelectItem>
                            <SelectItem value="extra_sauce" className="text-base">Extra Sauce</SelectItem>
                            <SelectItem value="extra_topping" className="text-base">Extra Topping</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ing-description" className="text-base font-semibold mb-2">Beschreibung</Label>
                      <Textarea
                        id="ing-description"
                        name="description"
                        rows={3}
                        defaultValue={editingIngredient?.descriptionDE || editingIngredient?.description || ""}
                        className="text-base px-4 py-3"
                      />
                    </div>

                    {/* Conditional Price Fields based on Type */}
                    {((selectedIngredientType || editingIngredient?.type) === 'protein') && (
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="ing-price-small" className="text-base font-semibold mb-2">Preis Klein (€) *</Label>
                          <Input
                            id="ing-price-small"
                            name="priceSmall"
                            type="number"
                            step="0.01"
                            defaultValue={editingIngredient?.priceSmall || ""}
                            placeholder="z.B. 9.50"
                            className="h-12 text-base px-4"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="ing-price-standard" className="text-base font-semibold mb-2">Preis Standard (€) *</Label>
                          <Input
                            id="ing-price-standard"
                            name="priceStandard"
                            type="number"
                            step="0.01"
                            defaultValue={editingIngredient?.priceStandard || ""}
                            placeholder="z.B. 14.50"
                            className="h-12 text-base px-4"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {['extra_protein', 'extra_fresh', 'extra_sauce', 'extra_topping'].includes(selectedIngredientType || editingIngredient?.type || '') && (
                      <div>
                        <Label htmlFor="ing-price" className="text-base font-semibold mb-2">Preis (€) *</Label>
                        <Input
                          id="ing-price"
                          name="price"
                          type="number"
                          step="0.01"
                          defaultValue={editingIngredient?.price || ""}
                          placeholder="z.B. 2.00"
                          className="h-12 text-base px-4"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label className="mb-3 block">Foto der Zutat</Label>
                      
                      <div className="mb-4">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
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
                        ) : editingIngredient?.image ? (
                          <div>
                            <img 
                              src={editingIngredient.image} 
                              alt="Current" 
                              className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 mb-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Aktuelles Foto
                            </p>
                          </div>
                        ) : (
                          <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <p className="text-gray-400">Kein Bild</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <Input
                          id="ing-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Label
                          htmlFor="ing-image"
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

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ing-available"
                        name="available"
                        defaultChecked={editingIngredient?.available === 1}
                      />
                      <Label htmlFor="ing-available">Verfügbar</Label>
                    </div>

                    {(selectedIngredientType && !['extra_protein', 'extra_fresh', 'extra_sauce', 'extra_topping'].includes(selectedIngredientType)) && (
                      <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <Switch
                          id="create-as-extra"
                          checked={createAsExtraCheckbox}
                          onCheckedChange={setCreateAsExtraCheckbox}
                        />
                        <Label htmlFor="create-as-extra" className="font-semibold">
                          Auch als Extra-Zutat erstellen (ohne Preis)
                        </Label>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-ocean hover:bg-ocean/90"
                      disabled={isUploading}
                    >
                      {isUploading ? "Foto wird hochgeladen..." : "Speichern"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <Label className="text-base font-semibold mb-2 block">Nach Typ filtern:</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={ingredientFilterType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIngredientFilterType(null)}
                    className={ingredientFilterType === null ? "bg-ocean hover:bg-ocean/90 text-white" : ""}
                  >
                    Alle
                  </Button>
                  {["protein", "base", "marinade", "fresh", "sauce", "topping", "extra_protein", "extra_fresh", "extra_sauce", "extra_topping"].map((type) => (
                    <Button
                      key={type}
                      variant={ingredientFilterType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIngredientFilterType(type)}
                      className={ingredientFilterType === type ? "bg-ocean hover:bg-ocean/90 text-white" : ""}
                    >
                      {type === "protein" ? "🍗 Proteine" : 
                       type === "base" ? "🍚 Bases" :
                       type === "marinade" ? "🧂 Marinaden" :
                       type === "fresh" ? "🥬 Frische" :
                       type === "sauce" ? "🥫 Saucen" :
                       type === "topping" ? "✨ Toppings" :
                       type === "extra_protein" ? "➕ Extra Protein" :
                       type === "extra_fresh" ? "➕ Extra Frische" :
                       type === "extra_sauce" ? "➕ Extra Sauce" :
                       type === "extra_topping" ? "➕ Extra Toppings" : ""}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {["protein", "base", "marinade", "fresh", "sauce", "topping", "extra_protein", "extra_fresh", "extra_sauce", "extra_topping"].map((type) => {
                  if (ingredientFilterType !== null && ingredientFilterType !== type) return null;
                  
                  const typeIngredients = ingredients.filter(ing => ing.type === type).sort((a, b) => a.order - b.order);
                  
                  if (typeIngredients.length === 0) return null;
                  
                  const typeNames: Record<string, string> = {
                    protein: "🍗 Proteine",
                    base: "🍚 Bases",
                    marinade: "🧂 Marinaden",
                    fresh: "🥬 Frische Zutaten",
                    sauce: "🥫 Saucen",
                    topping: "✨ Toppings",
                    extra_protein: "➕ Extra Protein",
                    extra_fresh: "➕ Extra Frische Zutaten",
                    extra_sauce: "➕ Extra Saucen",
                    extra_topping: "➕ Extra Toppings"
                  };
                  
                  return (
                    <div key={type} className="space-y-3">
                      <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-sunset/10 to-transparent rounded-lg border-l-4 border-sunset">
                        <div>
                          <h3 className="font-poppins text-lg font-bold text-sunset">
                            {typeNames[type]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {typeIngredients.length} {typeIngredients.length === 1 ? 'Zutat' : 'Zutaten'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-4">
                        {typeIngredients.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="relative border-2 rounded-lg overflow-hidden hover:border-sunset/30 hover:shadow-lg transition-all"
                          >
                            <div className="aspect-square relative bg-gray-100">
                              {ingredient.image ? (
                                <img
                                  src={ingredient.image}
                                  alt={ingredient.nameDE || ingredient.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  Kein Bild
                                </div>
                              )}
                              {ingredient.available === 0 && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                  Nicht verfügbar
                                </div>
                              )}
                            </div>
                            <div className="p-3 bg-white">
                              <p className="font-poppins font-semibold text-sm truncate">
                                {ingredient.nameDE || ingredient.name}
                              </p>
                              {type === 'protein' && ingredient.priceSmall && ingredient.priceStandard ? (
                                <div className="text-xs font-bold mt-1">
                                  <p className="text-ocean">Klein: €{ingredient.priceSmall}</p>
                                  <p className="text-sunset">Standard: €{ingredient.priceStandard}</p>
                                </div>
                              ) : ingredient.price && (
                                <p className="text-xs text-sunset font-bold mt-1">
                                  €{ingredient.price}
                                </p>
                              )}
                              {ingredient.descriptionDE && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {ingredient.descriptionDE}
                                </p>
                              )}
                              <div className="flex gap-1 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => {
                                    setEditingIngredient(ingredient);
                                    setSelectedImage(null);
                                    setImagePreview(ingredient.image || null);
                                    setSelectedIngredientType(ingredient.type || "");
                                    setCreateAsExtraCheckbox(false);
                                    setShowIngredientDialog(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setDeleteConfirm({ type: "ingredient", id: ingredient.id, name: ingredient.nameDE || ingredient.name })}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.type !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm({ type: null, id: null }); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteConfirm.type === "category" && "Kategorie löschen?"}
              {deleteConfirm.type === "menuItem" && "Gericht löschen?"}
              {deleteConfirm.type === "ingredient" && "Zutat löschen?"}
              {deleteConfirm.type === "variant" && "Variante löschen?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm.type === "category" && `Kategorie "${deleteConfirm.name}" wird gelöscht. Dies kann nicht rückgängig gemacht werden.`}
              {deleteConfirm.type === "menuItem" && `Gericht "${deleteConfirm.name}" wird gelöscht. Dies kann nicht rückgängig gemacht werden.`}
              {deleteConfirm.type === "ingredient" && `Zutat "${deleteConfirm.name}" wird gelöscht. Dies kann nicht rückgängig gemacht werden.`}
              {deleteConfirm.type === "variant" && `Variante "${deleteConfirm.name}" wird gelöscht. Dies kann nicht rückgängig gemacht werden.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="font-semibold">Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm.type === "category" && deleteConfirm.id) {
                  deleteCategoryMutation.mutate(deleteConfirm.id);
                } else if (deleteConfirm.type === "menuItem" && deleteConfirm.id) {
                  deleteMenuItemMutation.mutate(deleteConfirm.id);
                } else if (deleteConfirm.type === "ingredient" && deleteConfirm.id) {
                  deleteIngredientMutation.mutate(deleteConfirm.id);
                } else if (deleteConfirm.type === "variant" && deleteConfirm.id) {
                  deleteVariantMutation.mutate(deleteConfirm.id);
                }
                setDeleteConfirm({ type: null, id: null });
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Löschen
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Variant Management Dialog */}
      <Dialog open={showVariantsDialog} onOpenChange={setShowVariantsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-poppins text-2xl">
              Varianten verwalten: {managingVariantsForItem?.nameDE || managingVariantsForItem?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Variant Settings */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Varianteneinstellungen</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={variantFormData.hasVariants}
                  onCheckedChange={(checked) => {
                    setVariantFormData({...variantFormData, hasVariants: checked});
                    if (managingVariantsForItem) {
                      updateMenuItemVariantSettingsMutation.mutate({
                        id: managingVariantsForItem.id,
                        data: { hasVariants: checked ? 1 : 0 }
                      });
                    }
                  }}
                />
                <Label>Varianten aktivieren</Label>
              </div>

              {variantFormData.hasVariants && (
                <>
                  <div className="space-y-2">
                    <Label>Variantentyp</Label>
                    <Select
                      value={variantFormData.variantType}
                      onValueChange={(value: "base" | "flavor") => {
                        setVariantFormData({...variantFormData, variantType: value});
                        if (managingVariantsForItem) {
                          updateMenuItemVariantSettingsMutation.mutate({
                            id: managingVariantsForItem.id,
                            data: { variantType: value }
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base">Base (Reis, Quinoa, etc.)</SelectItem>
                        <SelectItem value="flavor">Geschmacksrichtung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={variantFormData.requiresVariantSelection}
                      onCheckedChange={(checked) => {
                        setVariantFormData({...variantFormData, requiresVariantSelection: checked});
                        if (managingVariantsForItem) {
                          updateMenuItemVariantSettingsMutation.mutate({
                            id: managingVariantsForItem.id,
                            data: { requiresVariantSelection: checked ? 1 : 0 }
                          });
                        }
                      }}
                    />
                    <Label>Variantenauswahl erforderlich</Label>
                  </div>
                </>
              )}
            </div>

            {/* Variant List */}
            {variantFormData.hasVariants && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Varianten ({variants.length})</h3>
                  <Dialog open={showVariantEditDialog} onOpenChange={setShowVariantEditDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingVariant(null)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Variante hinzufügen
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingVariant ? "Variante bearbeiten" : "Neue Variante"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveVariant} className="space-y-4">
                        <div>
                          <Label htmlFor="variant-name">Name *</Label>
                          <Input
                            id="variant-name"
                            name="name"
                            defaultValue={editingVariant?.nameDE || ""}
                            required
                            placeholder="z.B. Reis, Quinoa, Fritz-Kola Original"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="variant-available"
                            name="available"
                            defaultChecked={editingVariant?.available === 1}
                          />
                          <Label htmlFor="variant-available">Verfügbar</Label>
                        </div>
                        <Button type="submit" className="w-full">Speichern</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {variants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Keine Varianten vorhanden. Fügen Sie eine Variante hinzu.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveVariant(variant.id, "up")}
                              disabled={index === 0}
                              className="h-5 w-5 p-0"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveVariant(variant.id, "down")}
                              disabled={index === variants.length - 1}
                              className="h-5 w-5 p-0"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <div>
                            <p className="font-medium">{variant.nameDE}</p>
                          </div>
                          {variant.available === 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Nicht verfügbar
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingVariant(variant);
                              setShowVariantEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirm({ type: "variant", id: variant.id, name: variant.nameDE })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      </div>
    </div>
  );
}
