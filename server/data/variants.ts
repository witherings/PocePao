import { type InsertProductVariant } from "@shared/schema";

// Helper to create base variants for consolidated menu items
export const createBaseVariants = (menuItemId: string): InsertProductVariant[] => [
  {
    menuItemId,
    name: "Rice",
    nameDE: "Reis",
    type: "base",
    order: 1,
    available: 1,
  },
  {
    menuItemId,
    name: "Quinoa",
    nameDE: "Quinoa",
    type: "base",
    order: 2,
    available: 1,
  },
  {
    menuItemId,
    name: "Zucchini Noodles",
    nameDE: "Zucchini-Nudeln",
    type: "base",
    order: 3,
    available: 1,
  },
  {
    menuItemId,
    name: "Couscous",
    nameDE: "Couscous",
    type: "base",
    order: 4,
    available: 1,
  },
];

// Fritz-Kola flavor variants
export const createFritzKolaVariants = (menuItemId: string): InsertProductVariant[] => [
  {
    menuItemId,
    name: "Classic Light (sugar-free)",
    nameDE: "Classic light ohne Zucker",
    type: "flavor",
    order: 1,
    available: 1,
  },
  {
    menuItemId,
    name: "Original",
    nameDE: "Original",
    type: "flavor",
    order: 2,
    available: 1,
  },
  {
    menuItemId,
    name: "Orange",
    nameDE: "Orange",
    type: "flavor",
    order: 3,
    available: 1,
  },
  {
    menuItemId,
    name: "Honeydew Melon",
    nameDE: "Honigmelone",
    type: "flavor",
    order: 4,
    available: 1,
  },
  {
    menuItemId,
    name: "Apple-Cherry-Elderflower",
    nameDE: "Apfel-Kirsch-Holunder",
    type: "flavor",
    order: 5,
    available: 1,
  },
];
