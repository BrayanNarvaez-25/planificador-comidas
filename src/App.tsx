/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Receta, PlanSemanal, DiaSemana, MomentoComida } from './types';
import { RECETAS_EJEMPLO, PLAN_SEMANAL_INICIAL, PLAN_SEMANAL_VACIO } from './data/sampleRecipes';
import { Navbar, ActiveTab } from './components/Navbar';
import { SideDrawer } from './components/SideDrawer';
import { RecipeList } from './components/RecipeList';
import { WeekPlanner } from './components/WeekPlanner';
import { ShoppingList } from './components/ShoppingList';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('planificador');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persistent state in localStorage
  const [recipes, setRecipes] = useLocalStorage<Receta[]>('planificador_recetas', RECETAS_EJEMPLO);
  const [plan, setPlan] = useLocalStorage<PlanSemanal>('planificador_semana', PLAN_SEMANAL_INICIAL);
  const [comprados, setComprados] = useLocalStorage<string[]>('planificador_comprados', []);

  // Handlers for recipes
  const handleAddRecipe = (newRecipeData: Omit<Receta, 'id'>) => {
    const newRecipe: Receta = {
      ...newRecipeData,
      id: `receta-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  };

  const handleUpdateRecipe = (updatedRecipe: Receta) => {
    setRecipes((prev) =>
      prev.map((rec) => (rec.id === updatedRecipe.id ? updatedRecipe : rec))
    );
  };

  const handleDeleteRecipe = (recipeId: string) => {
    // 1. Remove recipe from recipes list
    setRecipes((prev) => prev.filter((rec) => rec.id !== recipeId));

    // 2. Remove recipe from all planner slots if assigned
    setPlan((prevPlan) => {
      const nextPlan = { ...prevPlan };
      (Object.keys(nextPlan) as DiaSemana[]).forEach((day) => {
        nextPlan[day] = { ...nextPlan[day] };
        (Object.keys(nextPlan[day]) as MomentoComida[]).forEach((meal) => {
          if (nextPlan[day][meal] === recipeId) {
            nextPlan[day][meal] = null;
          }
        });
      });
      return nextPlan;
    });
  };

  const handleRestoreDefaults = () => {
    setRecipes(RECETAS_EJEMPLO);
    setPlan(PLAN_SEMANAL_INICIAL);
  };

  // Handlers for planner
  const handleAssignMeal = (dia: DiaSemana, momento: MomentoComida, recetaId: string | null) => {
    setPlan((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [momento]: recetaId,
      },
    }));
  };

  const handleClearWeek = () => {
    setPlan(PLAN_SEMANAL_VACIO);
    setComprados([]);
  };

  // Handlers for shopping list
  const handleToggleComprado = (itemKey: string) => {
    setComprados((prev) =>
      prev.includes(itemKey) ? prev.filter((k) => k !== itemKey) : [...prev, itemKey]
    );
  };

  const handleClearComprados = () => {
    setComprados([]);
  };

  // Calculated totals
  const totalPlannedMeals = useMemo(() => {
    return Object.values(plan).reduce((acc, day) => {
      return acc + Object.values(day).filter((id) => id !== null).length;
    }, 0);
  }, [plan]);

  // Count unique shopping items
  const shoppingItemsCount = useMemo(() => {
    const keys = new Set<string>();
    const recipeMap = new Map<string, Receta>();
    recipes.forEach((r) => recipeMap.set(r.id, r));

    Object.values(plan).forEach((daySlots) => {
      Object.values(daySlots).forEach((recipeId) => {
        if (!recipeId) return;
        const recipe = recipeMap.get(recipeId);
        if (!recipe) return;
        recipe.ingredientes.forEach((ing) => {
          const cat = ing.categoria || 'Otros';
          const normalized = ing.nombre.trim().toLowerCase();
          keys.add(`${cat}___${normalized}___${ing.unidad}`);
        });
      });
    });

    return keys.size;
  }, [recipes, plan]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Side Drawer with hover, keyboard Esc, and mobile toggle support */}
      <SideDrawer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        recipesCount={recipes.length}
        plannedMealsCount={totalPlannedMeals}
        shoppingItemsCount={shoppingItemsCount}
        externalIsOpen={isDrawerOpen}
        onToggleExternal={setIsDrawerOpen}
      />

      {/* Top Navbar: Section title + hamburger toggle */}
      <Navbar
        activeTab={activeTab}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
      />

      {/* Main Content Area: Does NOT shift or resize when drawer toggles */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
        {activeTab === 'recetas' && (
          <RecipeList
            recipes={recipes}
            plan={plan}
            onAddRecipe={handleAddRecipe}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onRestoreDefaults={handleRestoreDefaults}
          />
        )}

        {activeTab === 'planificador' && (
          <WeekPlanner
            recipes={recipes}
            plan={plan}
            onAssignMeal={handleAssignMeal}
            onClearWeek={handleClearWeek}
            onNavigateToRecipes={() => setActiveTab('recetas')}
          />
        )}

        {activeTab === 'compras' && (
          <ShoppingList
            recipes={recipes}
            plan={plan}
            comprados={comprados}
            onToggleComprado={handleToggleComprado}
            onClearComprados={handleClearComprados}
            onNavigateToPlanner={() => setActiveTab('planificador')}
          />
        )}
      </main>

      {/* Footer matching same responsive width and padding */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-10 sm:mt-12">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-neutral-500">
          <p>Planificador de Comidas · Todos los datos se guardan de forma local en tu navegador.</p>
        </div>
      </footer>
    </div>
  );
}
