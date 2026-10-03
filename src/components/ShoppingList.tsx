import React, { useMemo, useState } from 'react';
import {
  Receta,
  PlanSemanal,
  CategoriaIngrediente,
  CATEGORIAS_INGREDIENTES,
  ItemAgrupadoCompra,
} from '../types';
import {
  CheckSquare,
  Square,
  ShoppingCart,
  Copy,
  Check,
  RotateCcw,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface ShoppingListProps {
  recipes: Receta[];
  plan: PlanSemanal;
  comprados: string[];
  onToggleComprado: (itemKey: string) => void;
  onClearComprados: () => void;
  onNavigateToPlanner: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  recipes,
  plan,
  comprados,
  onToggleComprado,
  onClearComprados,
  onNavigateToPlanner,
}) => {
  const [copied, setCopied] = useState(false);

  // Derived state: aggregate all ingredients from assigned recipes in the planner
  const aggregatedItemsByCategory = useMemo(() => {
    // Map recipe by ID for fast lookup
    const recipeMap = new Map<string, Receta>();
    recipes.forEach((r) => recipeMap.set(r.id, r));

    // Map: category -> Map<key, ItemAgrupadoCompra>
    const groupedMap = new Map<CategoriaIngrediente, Map<string, ItemAgrupadoCompra>>();
    CATEGORIAS_INGREDIENTES.forEach((cat) => {
      groupedMap.set(cat, new Map<string, ItemAgrupadoCompra>());
    });

    // Traverse all assigned meals
    Object.values(plan).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((recipeId) => {
        if (!recipeId) return;
        const recipe = recipeMap.get(recipeId);
        if (!recipe) return;

        recipe.ingredientes.forEach((ing) => {
          const cat = ing.categoria || 'Otros';
          const targetCatMap = groupedMap.get(cat) || groupedMap.get('Otros')!;
          const normalizedName = ing.nombre.trim().toLowerCase();
          const itemKey = `${cat}___${normalizedName}___${ing.unidad}`;

          if (targetCatMap.has(itemKey)) {
            const existing = targetCatMap.get(itemKey)!;
            // Round to 2 decimal places to avoid floating point precision artifacts (e.g. 0.300000000004)
            existing.cantidad = Math.round((existing.cantidad + ing.cantidad) * 100) / 100;
            existing.recetasOrigen.push({
              recetaId: recipe.id,
              recetaNombre: recipe.nombre,
              cantidad: ing.cantidad,
            });
          } else {
            // Capitalize first letter of ingredient for clean display
            const displayName =
              ing.nombre.trim().charAt(0).toUpperCase() + ing.nombre.trim().slice(1);

            targetCatMap.set(itemKey, {
              key: itemKey,
              nombre: displayName,
              cantidad: Math.round(ing.cantidad * 100) / 100,
              unidad: ing.unidad,
              categoria: cat,
              recetasOrigen: [
                {
                  recetaId: recipe.id,
                  recetaNombre: recipe.nombre,
                  cantidad: ing.cantidad,
                },
              ],
            });
          }
        });
      });
    });

    // Convert map to sorted categories with unbought items first, then bought items at the end
    const result: {
      categoria: CategoriaIngrediente;
      items: ItemAgrupadoCompra[];
    }[] = [];

    CATEGORIAS_INGREDIENTES.forEach((cat) => {
      const catMap = groupedMap.get(cat);
      if (catMap && catMap.size > 0) {
        const rawItems = Array.from(catMap.values());

        // Sort: unpurchased first, purchased at the end
        const sortedItems = [...rawItems].sort((a, b) => {
          const aPurchased = comprados.includes(a.key);
          const bPurchased = comprados.includes(b.key);
          if (aPurchased === bPurchased) {
            return a.nombre.localeCompare(b.nombre, 'es');
          }
          return aPurchased ? 1 : -1;
        });

        result.push({
          categoria: cat,
          items: sortedItems,
        });
      }
    });

    return result;
  }, [recipes, plan, comprados]);

  // Overall counters
  const totalItems = useMemo(() => {
    return aggregatedItemsByCategory.reduce((sum, group) => sum + group.items.length, 0);
  }, [aggregatedItemsByCategory]);

  const boughtCount = useMemo(() => {
    let count = 0;
    aggregatedItemsByCategory.forEach((group) => {
      group.items.forEach((item) => {
        if (comprados.includes(item.key)) count++;
      });
    });
    return count;
  }, [aggregatedItemsByCategory, comprados]);

  const progressPercentage = totalItems > 0 ? Math.round((boughtCount / totalItems) * 100) : 0;

  // Copy plain text list for mobile messaging / WhatsApp
  const handleCopyText = () => {
    if (totalItems === 0) return;

    let text = '🛒 Lista de Compras - Planificador Semanal\n\n';
    aggregatedItemsByCategory.forEach((catGroup) => {
      text += `📂 ${catGroup.categoria.toUpperCase()}\n`;
      catGroup.items.forEach((item) => {
        const isBought = comprados.includes(item.key);
        const checkMark = isBought ? '✓' : '□';
        text += `  ${checkMark} ${item.nombre}: ${item.cantidad} ${item.unidad}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Lista de Compras</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Ingredientes calculados automáticamente a partir de tu menú semanal.
          </p>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar lista'}</span>
            </button>

            {boughtCount > 0 && (
              <button
                type="button"
                onClick={onClearComprados}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl transition-colors min-h-[44px]"
                title="Desmarcar todos los ítems comprados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Desmarcar todo</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Counter & Bar */}
      {totalItems > 0 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <span>Progreso de compra</span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold text-emerald-700 tabular-nums">
                {boughtCount} de {totalItems} comprados
              </span>
            </div>
            <span className="text-neutral-500 font-mono tabular-nums text-xs">
              {progressPercentage}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Shopping Categories List:
          - Mobile & Tablet: 1 column
          - Desktop (>1024px, lg): 2 columns, >1536px (2xl): 3 columns
      */}
      {totalItems > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 items-start">
          {aggregatedItemsByCategory.map((group) => {
            const groupBoughtCount = group.items.filter((item) => comprados.includes(item.key)).length;

            return (
              <div
                key={group.categoria}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs"
              >
                {/* Category Header */}
                <div className="px-4 sm:px-5 py-3.5 bg-neutral-50/90 border-b border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wide">
                      {group.categoria}
                    </h3>
                    <span className="text-xs text-neutral-400 tabular-nums">
                      ({group.items.length})
                    </span>
                  </div>

                  <span className="text-xs text-neutral-500 tabular-nums font-medium">
                    {groupBoughtCount}/{group.items.length} listos
                  </span>
                </div>

                {/* Category Items List with min 44px touch areas */}
                <div className="divide-y divide-neutral-100">
                  {group.items.map((item) => {
                    const isBought = comprados.includes(item.key);

                    return (
                      <div
                        key={item.key}
                        onClick={() => onToggleComprado(item.key)}
                        role="checkbox"
                        aria-checked={isBought}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            onToggleComprado(item.key);
                          }
                        }}
                        className={`min-h-[52px] px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                          isBought
                            ? 'bg-neutral-50/50 hover:bg-neutral-100/60'
                            : 'hover:bg-neutral-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Dedicated touch target button >= 44px */}
                          <button
                            type="button"
                            aria-label={`Marcar ${item.nombre} como ${isBought ? 'no comprado' : 'comprado'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComprado(item.key);
                            }}
                            className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-neutral-400 hover:text-neutral-600 focus:outline-none shrink-0"
                          >
                            {isBought ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Square className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                            )}
                          </button>

                          <div className="min-w-0 pr-2">
                            <span
                              className={`text-xs sm:text-sm tracking-tight block truncate ${
                                isBought
                                  ? 'line-through text-neutral-400'
                                  : 'font-medium text-neutral-900'
                              }`}
                            >
                              {item.nombre}
                            </span>
                            {/* Recipes origin text */}
                            <span className="text-[11px] text-neutral-400 truncate block">
                              De: {item.recetasOrigen.map((r) => r.recetaNombre).join(', ')}
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Unit */}
                        <div
                          className={`text-right shrink-0 text-xs sm:text-sm tabular-nums ${
                            isBought ? 'text-neutral-400 line-through' : 'font-semibold text-neutral-800'
                          }`}
                        >
                          {item.cantidad} <span className="font-normal text-xs text-neutral-500">{item.unidad}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">
            No hay ingredientes en la lista
          </h3>
          <p className="text-xs text-neutral-500 mt-1 mb-5 leading-relaxed">
            Tu lista de compras se calcula de forma automática. Asigna recetas a tu semana en el planificador para ver aquí todos los ingredientes consolidados y ordenados por categoría.
          </p>
          <button
            type="button"
            onClick={onNavigateToPlanner}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Ir al Planificador Semanal</span>
          </button>
        </div>
      )}
    </div>
  );
};
