import React, { useState } from 'react';
import {
  Receta,
  Ingrediente,
  CATEGORIAS_INGREDIENTES,
  UNIDADES_MEDIDA,
  CategoriaIngrediente,
  UnidadMedida,
} from '../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface RecipeFormProps {
  initialData?: Receta | null;
  onSave: (recipe: Omit<Receta, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [porciones, setPorciones] = useState<number>(initialData?.porciones || 4);
  const [ingredientes, setIngredientes] = useState<
    { id: string; nombre: string; cantidad: number | string; unidad: UnidadMedida; categoria: CategoriaIngrediente }[]
  >(() => {
    if (initialData && initialData.ingredientes.length > 0) {
      return initialData.ingredientes.map((ing) => ({ ...ing }));
    }
    return [
      {
        id: `ing-${Date.now()}-1`,
        nombre: '',
        cantidad: 100,
        unidad: 'g',
        categoria: 'Verduras y frutas',
      },
    ];
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleAddIngredient = () => {
    setIngredientes((prev) => [
      ...prev,
      {
        id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        nombre: '',
        cantidad: 100,
        unidad: 'g',
        categoria: 'Verduras y frutas',
      },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredientes.length <= 1) {
      setErrors(['La receta debe tener al menos 1 ingrediente.']);
      return;
    }
    setIngredientes((prev) => prev.filter((_, i) => i !== index));
    setErrors([]);
  };

  const handleIngredientChange = (
    index: number,
    field: 'nombre' | 'cantidad' | 'unidad' | 'categoria',
    value: any
  ) => {
    setIngredientes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!nombre.trim()) {
      newErrors.push('El nombre de la receta es obligatorio.');
    }

    if (!porciones || porciones < 1) {
      newErrors.push('Las porciones deben ser al menos 1.');
    }

    if (ingredientes.length === 0) {
      newErrors.push('Debes agregar al menos 1 ingrediente.');
    }

    ingredientes.forEach((ing, index) => {
      const rowNum = index + 1;
      if (!ing.nombre.trim()) {
        newErrors.push(`El ingrediente #${rowNum} no tiene nombre.`);
      }
      const qty = Number(ing.cantidad);
      if (isNaN(qty) || qty <= 0) {
        newErrors.push(`El ingrediente #${rowNum} debe tener una cantidad mayor a 0.`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const formattedIngredients: Ingrediente[] = ingredientes.map((ing) => ({
      id: ing.id,
      nombre: ing.nombre.trim(),
      cantidad: Number(ing.cantidad),
      unidad: ing.unidad,
      categoria: ing.categoria,
    }));

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      nombre: nombre.trim(),
      porciones: Number(porciones),
      ingredientes: formattedIngredients,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General validation alert */}
      {errors.length > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="space-y-1">
            <p className="font-semibold">Revisa los siguientes campos:</p>
            <ul className="list-disc list-inside space-y-0.5 text-rose-700">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Basic recipe details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">
            Nombre de la receta <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Tortilla de patatas, Pollo al curry..."
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">
            Porciones <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            required
            value={porciones}
            onChange={(e) => setPorciones(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 tabular-nums transition-colors"
          />
        </div>
      </div>

      {/* Dynamic ingredients section */}
      <div className="space-y-3 pt-2 border-t border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide">
              Ingredientes ({ingredientes.length})
            </label>
            <p className="text-xs text-neutral-500">Agrega o elimina ingredientes según sea necesario.</p>
          </div>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-lg hover:bg-emerald-100 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar ingrediente</span>
          </button>
        </div>

        {/* Dynamic Ingredient Rows */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {ingredientes.map((ing, index) => (
            <div
              key={ing.id}
              className="p-3 bg-neutral-50/80 border border-neutral-200 rounded-xl space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2 shadow-2xs"
            >
              {/* Mobile top: name + delete button */}
              <div className="flex items-center gap-2 sm:flex-1">
                <input
                  type="text"
                  placeholder="Ej. Tomate, Leche..."
                  value={ing.nombre}
                  onChange={(e) => handleIngredientChange(index, 'nombre', e.target.value)}
                  className="flex-1 min-h-[40px] px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />

                {/* Delete button (visible on mobile next to name) */}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredientes.length <= 1}
                  aria-label={`Eliminar ingrediente ${index + 1}`}
                  className="sm:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity, Unit and Category */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2">
                {/* Quantity */}
                <div className="col-span-1 sm:w-20">
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="Cant."
                    value={ing.cantidad}
                    onChange={(e) => handleIngredientChange(index, 'cantidad', e.target.value)}
                    className="w-full min-h-[40px] px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 tabular-nums focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Unit */}
                <div className="col-span-1 sm:w-24">
                  <select
                    value={ing.unidad}
                    onChange={(e) => handleIngredientChange(index, 'unidad', e.target.value as UnidadMedida)}
                    className="w-full min-h-[40px] px-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    {UNIDADES_MEDIDA.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="col-span-1 sm:w-32">
                  <select
                    value={ing.categoria}
                    onChange={(e) =>
                      handleIngredientChange(index, 'categoria', e.target.value as CategoriaIngrediente)
                    }
                    className="w-full min-h-[40px] px-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 truncate"
                  >
                    {CATEGORIAS_INGREDIENTES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delete row button (desktop) */}
              <div className="hidden sm:flex shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredientes.length <= 1}
                  aria-label={`Eliminar ingrediente ${index + 1}`}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Actions: Fixed sticky footer with min 44px touch targets */}
      <div className="sticky bottom-0 z-10 -mx-4 sm:-mx-6 -mb-4 sm:-mb-5 px-4 sm:px-6 py-3 sm:py-4 bg-white sm:bg-neutral-50/95 border-t border-neutral-100 flex items-center justify-end gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900 flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex items-center justify-center"
        >
          Confirmar
        </button>
      </div>
    </form>
  );
};
