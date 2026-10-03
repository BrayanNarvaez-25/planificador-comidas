import React from 'react';
import { Receta } from '../types';
import { Edit2, Trash2, Users, Utensils, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Receta;
  onEdit: (recipe: Receta) => void;
  onDelete: (recipe: Receta) => void;
  assignedCount?: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onEdit,
  onDelete,
  assignedCount = 0,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header: Title and action buttons */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-neutral-900 tracking-tight leading-snug line-clamp-2">
            {recipe.nombre}
          </h3>
          <div className="flex items-center gap-1 shrink-0 -mr-1.5 -mt-1.5">
            <button
              type="button"
              onClick={() => onEdit(recipe)}
              aria-label={`Editar ${recipe.nombre}`}
              title="Editar receta"
              className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(recipe)}
              aria-label={`Eliminar ${recipe.nombre}`}
              title="Eliminar receta"
              className="min-w-[40px] min-h-[40px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-rose-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Unboxed Metadata with Typographic Separator (Zero-Pill Rule) */}
        <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            <span className="tabular-nums font-medium text-neutral-700">{recipe.porciones}</span>{' '}
            {recipe.porciones === 1 ? 'porción' : 'porciones'}
          </span>
          <span aria-hidden="true" className="text-neutral-300">
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-neutral-400" />
            <span className="tabular-nums font-medium text-neutral-700">
              {recipe.ingredientes.length}
            </span>{' '}
            {recipe.ingredientes.length === 1 ? 'ingrediente' : 'ingredientes'}
          </span>
          {assignedCount > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>
              <span className="text-emerald-700 font-medium">
                En el plan ({assignedCount})
              </span>
            </>
          )}
        </div>

        {/* Ingredients Quick Preview / Accordion */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-neutral-600 hover:text-neutral-900 py-1 transition-colors"
          >
            <span>{expanded ? 'Ocultar ingredientes' : 'Ver ingredientes'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <ul className="mt-2.5 space-y-1.5 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100 max-h-48 overflow-y-auto">
              {recipe.ingredientes.map((ing) => (
                <li key={ing.id} className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 truncate">{ing.nombre}</span>
                  <span className="text-neutral-500 tabular-nums shrink-0">
                    {ing.cantidad} {ing.unidad}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
