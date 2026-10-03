import React, { useState, useMemo } from 'react';
import { Receta, PlanSemanal } from '../types';
import { RecipeCard } from './RecipeCard';
import { Modal } from './Modal';
import { RecipeForm } from './RecipeForm';
import { ConfirmationModal } from './ConfirmationModal';
import { Plus, Search, BookOpen, RotateCcw } from 'lucide-react';
import { RECETAS_EJEMPLO } from '../data/sampleRecipes';

interface RecipeListProps {
  recipes: Receta[];
  plan: PlanSemanal;
  onAddRecipe: (recipe: Omit<Receta, 'id'>) => void;
  onUpdateRecipe: (recipe: Receta) => void;
  onDeleteRecipe: (recipeId: string) => void;
  onRestoreDefaults: () => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  plan,
  onAddRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
  onRestoreDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Receta | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Receta | null>(null);

  // Filter recipes by name or ingredient
  const filteredRecipes = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return recipes;
    return recipes.filter(
      (r) =>
        r.nombre.toLowerCase().includes(query) ||
        r.ingredientes.some((ing) => ing.nombre.toLowerCase().includes(query))
    );
  }, [recipes, searchTerm]);

  // Count how many times a recipe is used in the weekly plan
  const getRecipePlanCount = (recipeId: string): number => {
    let count = 0;
    Object.values(plan).forEach((daySlots) => {
      Object.values(daySlots).forEach((assignedId) => {
        if (assignedId === recipeId) count++;
      });
    });
    return count;
  };

  const handleSaveRecipe = (recipeData: Omit<Receta, 'id'> & { id?: string }) => {
    if (recipeData.id) {
      onUpdateRecipe(recipeData as Receta);
      setEditingRecipe(null);
    } else {
      onAddRecipe(recipeData);
      setIsCreateModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (recipeToDelete) {
      onDeleteRecipe(recipeToDelete.id);
      setRecipeToDelete(null);
    }
  };

  const assignedCountForDelete = recipeToDelete ? getRecipePlanCount(recipeToDelete.id) : 0;

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Recetario</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Gestiona tus recetas y sus ingredientes para armar tu menú semanal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {recipes.length === 0 && (
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cargar ejemplos</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva receta</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {recipes.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por receta o ingrediente..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>
      )}

      {/* Recipe Cards Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              assignedCount={getRecipePlanCount(recipe.id)}
              onEdit={(r) => setEditingRecipe(r)}
              onDelete={(r) => setRecipeToDelete(r)}
            />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">No tienes recetas guardadas</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-5">
            Crea tu primera receta casera o restaura las recetas de ejemplo para empezar a planificar.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Cargar recetas de ejemplo
            </button>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              Crear receta
            </button>
          </div>
        </div>
      ) : (
        /* No search results */
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center max-w-md mx-auto">
          <p className="text-sm text-neutral-700 font-medium">No se encontraron recetas</p>
          <p className="text-xs text-neutral-500 mt-1">
            Ninguna receta coincide con "{searchTerm}". Intenta buscar con otro término.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Modal: Crear Receta */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva receta"
        hideFooter={true}
        maxWidth="2xl"
      >
        <RecipeForm
          onSave={handleSaveRecipe}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal: Editar Receta */}
      <Modal
        isOpen={editingRecipe !== null}
        onClose={() => setEditingRecipe(null)}
        title={`Editar: ${editingRecipe?.nombre || ''}`}
        hideFooter={true}
        maxWidth="2xl"
      >
        {editingRecipe && (
          <RecipeForm
            initialData={editingRecipe}
            onSave={handleSaveRecipe}
            onCancel={() => setEditingRecipe(null)}
          />
        )}
      </Modal>

      {/* Modal: Confirmación de Eliminación */}
      <ConfirmationModal
        isOpen={recipeToDelete !== null}
        onClose={() => setRecipeToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar receta"
        message={`¿Estás seguro de que deseas eliminar "${recipeToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        warningNote={
          assignedCountForDelete > 0
            ? `Atención: Esta receta está actualmente asignada en el planificador semanal para ${assignedCountForDelete} comida(s). Al eliminarla, se removerá automáticamente del plan.`
            : null
        }
        confirmText="Sí, eliminar receta"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
};
