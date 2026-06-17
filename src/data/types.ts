export type FodmapStatus = 'safe' | 'moderate' | 'avoid';

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'cereal'
  | 'protein'
  | 'dairy'
  | 'condiment'
  | 'sauce'
  | 'other';

export interface Food {
  id: string;
  name: string; // en français
  category: FoodCategory;
  status: FodmapStatus;
  note?: string; // ex: "OK jusqu'à 100g", "éviter si SII sévère"
  portion?: string; // portion de référence Monash
}

export type Cuisine = 'french' | 'asian' | 'everyday';

export interface RecipeIngredient {
  foodId?: string; // référence à foods.ts si applicable
  name: string;
  quantity: string;
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: Cuisine;
  status: FodmapStatus;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[]; // ex: ['sans gluten', 'sans lactose', 'végétarien']
}

export const STATUS_LABEL: Record<FodmapStatus, string> = {
  safe: 'Autorisé',
  moderate: 'Modéré',
  avoid: 'À éviter',
};

export const CATEGORY_LABEL: Record<FoodCategory, string> = {
  fruit: 'Fruits',
  vegetable: 'Légumes',
  cereal: 'Céréales & féculents',
  protein: 'Protéines',
  dairy: 'Produits laitiers',
  condiment: 'Condiments',
  sauce: 'Sauces',
  other: 'Autre',
};

export const CUISINE_LABEL: Record<Cuisine, string> = {
  french: 'Française',
  asian: 'Asiatique',
  everyday: 'Quotidien',
};
