import { foods } from '../data/foods';
import { recipes } from '../data/recipes';

export type ShoppingGroup = 'produce' | 'starch' | 'protein' | 'dairy' | 'sauce' | 'other';

export const SHOPPING_GROUP_LABEL: Record<ShoppingGroup, string> = {
  produce: 'Fruits & légumes',
  starch: 'Féculents',
  protein: 'Protéines',
  dairy: 'Produits laitiers',
  sauce: 'Sauces & condiments',
  other: 'Autre',
};

export const SHOPPING_GROUP_ORDER: ShoppingGroup[] = ['produce', 'starch', 'protein', 'dairy', 'sauce', 'other'];

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  group: ShoppingGroup;
  checked: boolean;
}

const foodById = new Map(foods.map((f) => [f.id, f]));
const recipeById = new Map(recipes.map((r) => [r.id, r]));

function groupForFoodId(foodId?: string): ShoppingGroup {
  if (!foodId) return 'other';
  const food = foodById.get(foodId);
  if (!food) return 'other';
  switch (food.category) {
    case 'fruit':
    case 'vegetable':
      return 'produce';
    case 'cereal':
      return 'starch';
    case 'protein':
      return 'protein';
    case 'dairy':
      return 'dairy';
    case 'condiment':
    case 'sauce':
      return 'sauce';
    default:
      return 'other';
  }
}

/** Extrait un nombre de tête (entier, décimal « 1,5 » ou fraction « 1/2 ») + l'unité restante. */
function parseQuantity(raw: string): { num: number | null; unit: string } {
  const m = raw.trim().match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return { num: null, unit: raw.trim() };
  let num: number;
  if (m[1].includes('/')) {
    const [a, b] = m[1].split('/').map(Number);
    num = b ? a / b : NaN;
  } else {
    num = parseFloat(m[1].replace(',', '.'));
  }
  return { num: Number.isFinite(num) ? num : null, unit: m[2].trim() };
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ',');
}

interface Acc {
  name: string;
  group: ShoppingGroup;
  // unité -> somme numérique
  byUnit: Map<string, number>;
  // quantités non numériques (« au goût », « 1 poignée »…)
  freeform: string[];
}

/** Agrège, déduplique et additionne les ingrédients des recettes planifiées. */
export function generateShoppingList(recipeIds: string[]): ShoppingItem[] {
  const acc = new Map<string, Acc>();

  for (const recipeId of recipeIds) {
    const recipe = recipeById.get(recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = ing.foodId ?? ing.name.toLowerCase().trim();
      if (!acc.has(key)) {
        acc.set(key, { name: ing.name, group: groupForFoodId(ing.foodId), byUnit: new Map(), freeform: [] });
      }
      const entry = acc.get(key)!;
      const { num, unit } = parseQuantity(ing.quantity);
      if (num !== null) {
        entry.byUnit.set(unit, (entry.byUnit.get(unit) ?? 0) + num);
      } else {
        entry.freeform.push(ing.quantity.trim());
      }
    }
  }

  const items: ShoppingItem[] = [];
  for (const [key, entry] of acc) {
    const parts: string[] = [];
    for (const [unit, total] of entry.byUnit) {
      parts.push(unit ? `${formatNum(total)} ${unit}` : formatNum(total));
    }
    for (const f of [...new Set(entry.freeform)]) parts.push(f);
    items.push({
      id: key,
      name: entry.name,
      quantity: parts.join(' + '),
      group: entry.group,
      checked: false,
    });
  }

  // Tri par groupe puis alphabétique.
  items.sort((a, b) => {
    const g = SHOPPING_GROUP_ORDER.indexOf(a.group) - SHOPPING_GROUP_ORDER.indexOf(b.group);
    return g !== 0 ? g : a.name.localeCompare(b.name, 'fr');
  });
  return items;
}

/** Texte brut pour le presse-papier. */
export function shoppingListToText(items: ShoppingItem[]): string {
  const lines: string[] = ['Liste de courses FodMap', ''];
  for (const group of SHOPPING_GROUP_ORDER) {
    const groupItems = items.filter((i) => i.group === group);
    if (groupItems.length === 0) continue;
    lines.push(`— ${SHOPPING_GROUP_LABEL[group]} —`);
    for (const item of groupItems) {
      lines.push(`${item.checked ? '[x]' : '[ ]'} ${item.name}${item.quantity ? ` : ${item.quantity}` : ''}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}
