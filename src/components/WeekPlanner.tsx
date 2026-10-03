import React, { useState } from 'react';
import {
  Receta,
  PlanSemanal,
  DiaSemana,
  MomentoComida,
  DIAS_SEMANA,
  MOMENTOS_COMIDA,
} from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { Coffee, Utensils, Moon, Trash2, X, Plus, Calendar, AlertCircle } from 'lucide-react';

interface WeekPlannerProps {
  recipes: Receta[];
  plan: PlanSemanal;
  onAssignMeal: (dia: DiaSemana, momento: MomentoComida, recetaId: string | null) => void;
  onClearWeek: () => void;
  onNavigateToRecipes: () => void;
}

export const WeekPlanner: React.FC<WeekPlannerProps> = ({
  recipes,
  plan,
  onAssignMeal,
  onClearWeek,
  onNavigateToRecipes,
}) => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [activeMobileDay, setActiveMobileDay] = useState<DiaSemana>('lunes');

  // Count planned meals
  const totalPlannedMeals = Object.values(plan).reduce((acc, day) => {
    return acc + Object.values(day).filter((id) => id !== null).length;
  }, 0);

  const getMomentIcon = (momento: MomentoComida) => {
    switch (momento) {
      case 'desayuno':
        return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
      case 'almuerzo':
        return <Utensils className="w-3.5 h-3.5 text-emerald-600" />;
      case 'cena':
        return <Moon className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const getRecipe = (id: string | null) => {
    if (!id) return null;
    return recipes.find((r) => r.id === id) || null;
  };

  const handleSelectChange = (
    dia: DiaSemana,
    momento: MomentoComida,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value;
    onAssignMeal(dia, momento, val === '' ? null : val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Planificador Semanal</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Organiza tus desayunos, almuerzos y cenas de lunes a domingo.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
          <div className="text-xs text-neutral-600 bg-white border border-neutral-200 px-3.5 py-2 rounded-xl shadow-2xs font-medium tabular-nums min-h-[44px] flex items-center">
            <span><strong className="text-emerald-700 font-semibold">{totalPlannedMeals}</strong> / 21 planificadas</span>
          </div>

          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            disabled={totalPlannedMeals === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 disabled:opacity-40 disabled:pointer-events-none transition-colors min-h-[44px]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar semana</span>
          </button>
        </div>
      </div>

      {recipes.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Aún no tienes recetas creadas para asignar a la semana.</span>
          </div>
          <button
            type="button"
            onClick={onNavigateToRecipes}
            className="font-semibold text-emerald-700 hover:text-emerald-800 underline shrink-0 min-h-[44px] flex items-center"
          >
            Ir a crear recetas
          </button>
        </div>
      )}

      {/* 1. MÓVIL (<640px): Vista por día con selector de día arriba */}
      <div className="block sm:hidden">
        {/* Day selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 no-scrollbar">
          {DIAS_SEMANA.map((dia) => {
            const dayMealsCount = Object.values(plan[dia.key]).filter((id) => id !== null).length;
            const isActive = activeMobileDay === dia.key;
            return (
              <button
                key={dia.key}
                type="button"
                onClick={() => setActiveMobileDay(dia.key)}
                className={`flex-1 min-w-[58px] min-h-[48px] py-2 px-2 rounded-xl text-xs font-medium transition-all text-center border flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="font-semibold">{dia.shortLabel}</div>
                <div
                  className={`text-[10px] mt-0.5 tabular-nums ${
                    isActive ? 'text-neutral-300' : 'text-neutral-400'
                  }`}
                >
                  {dayMealsCount}/3
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Day Card: 3 meal slots */}
        <div className="mt-4 bg-white border border-neutral-200 rounded-2xl p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-900 capitalize">
              {DIAS_SEMANA.find((d) => d.key === activeMobileDay)?.label}
            </h3>
            <span className="text-xs text-neutral-500 tabular-nums">
              {Object.values(plan[activeMobileDay]).filter((id) => id !== null).length} de 3 comidas
            </span>
          </div>

          <div className="space-y-3.5">
            {MOMENTOS_COMIDA.map((momento) => {
              const assignedRecipeId = plan[activeMobileDay]?.[momento.key] || null;
              const recipe = getRecipe(assignedRecipeId);

              return (
                <div
                  key={momento.key}
                  className="p-3.5 bg-neutral-50/80 rounded-xl border border-neutral-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                      {getMomentIcon(momento.key)}
                      <span>{momento.label}</span>
                    </div>

                    {recipe && (
                      <button
                        type="button"
                        onClick={() => onAssignMeal(activeMobileDay, momento.key, null)}
                        aria-label={`Quitar receta de ${momento.label}`}
                        className="min-h-[44px] px-2 text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    )}
                  </div>

                  {recipe && (
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                      <p className="text-xs font-semibold text-neutral-900">{recipe.nombre}</p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        {recipe.porciones} porciones · {recipe.ingredientes.length} ingredientes
                      </p>
                    </div>
                  )}

                  {/* Dropdown selector with min 44px tap height */}
                  <div>
                    <select
                      value={assignedRecipeId || ''}
                      onChange={(e) => handleSelectChange(activeMobileDay, momento.key, e)}
                      className="w-full min-h-[44px] px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
                    >
                      <option value="">
                        {recipe ? 'Cambiar receta...' : '+ Asignar receta...'}
                      </option>
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre} ({r.porciones} porc.)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TABLET (640-1024px) & ESCRITORIO (>1024px):
          Tablet: scroll horizontal suave dentro de su contenedor sin romper la página
          Escritorio: cuadrícula de 7 columnas amplia
      */}
      <div className="hidden sm:block rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        {/* Tablet scroll indicator cue */}
        <div className="sm:flex lg:hidden items-center justify-between px-4 py-2 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-500 font-medium">
          <span>Vista semanal completa</span>
          <span className="text-neutral-400">Desliza horizontalmente →</span>
        </div>

        <div className="overflow-x-auto scroll-smooth">
          <table className="w-full min-w-[780px] lg:min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80">
                <th className="p-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28 shrink-0">
                  Franja
                </th>
                {DIAS_SEMANA.map((dia) => (
                  <th
                    key={dia.key}
                    className="p-3.5 text-xs font-semibold text-neutral-800 text-center border-l border-neutral-200"
                  >
                    <div>{dia.label}</div>
                    <div className="text-[11px] font-normal text-neutral-400 tabular-nums">
                      {Object.values(plan[dia.key]).filter((id) => id !== null).length}/3 comidas
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {MOMENTOS_COMIDA.map((momento) => (
                <tr key={momento.key} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="p-3.5 bg-neutral-50/50 align-top">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                      {getMomentIcon(momento.key)}
                      <span>{momento.label}</span>
                    </div>
                  </td>

                  {DIAS_SEMANA.map((dia) => {
                    const assignedRecipeId = plan[dia.key]?.[momento.key] || null;
                    const recipe = getRecipe(assignedRecipeId);

                    return (
                      <td
                        key={dia.key}
                        className="p-2.5 align-top border-l border-neutral-200 min-w-[130px] lg:min-w-[145px]"
                      >
                        <div className="space-y-2">
                          {recipe ? (
                            <div className="group relative bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 transition-all">
                              <div className="flex items-start justify-between gap-1">
                                <p className="text-xs font-semibold text-emerald-950 line-clamp-2 leading-snug">
                                  {recipe.nombre}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => onAssignMeal(dia.key, momento.key, null)}
                                  title="Quitar receta"
                                  aria-label={`Quitar ${recipe.nombre} de ${dia.label} ${momento.label}`}
                                  className="p-1 -mr-1 -mt-1 text-emerald-700/60 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-800/80 font-medium">
                                <span>{recipe.porciones} porc.</span>
                                <span aria-hidden="true">·</span>
                                <span>{recipe.ingredientes.length} ingr.</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-10 flex items-center justify-center border border-dashed border-neutral-200 rounded-xl text-[11px] text-neutral-400">
                              Sin asignar
                            </div>
                          )}

                          {/* Dropdown selector */}
                          <div className="relative">
                            <select
                              value={assignedRecipeId || ''}
                              onChange={(e) => handleSelectChange(dia.key, momento.key, e)}
                              className="w-full text-[11px] py-1.5 px-2 bg-neutral-50 hover:bg-white border border-neutral-200 rounded-lg text-neutral-700 truncate cursor-pointer focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                            >
                              <option value="">{recipe ? 'Cambiar...' : '+ Elegir receta'}</option>
                              {recipes.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Clearing the Week */}
      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => {
          onClearWeek();
          setIsClearModalOpen(false);
        }}
        title="Limpiar planificador semanal"
        message="¿Estás seguro de que deseas limpiar la semana completa? Todas las comidas asignadas serán removidas del plan."
        confirmText="Sí, limpiar semana"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
};
