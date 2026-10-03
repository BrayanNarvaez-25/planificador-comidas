import { PlanSemanal, Receta } from '../types';

export const RECETAS_EJEMPLO: Receta[] = [
  {
    id: 'receta-1',
    nombre: 'Tortilla de patatas española',
    porciones: 4,
    ingredientes: [
      { id: 'ing-1-1', nombre: 'Patatas', cantidad: 600, unidad: 'g', categoria: 'Verduras y frutas' },
      { id: 'ing-1-2', nombre: 'Huevos frescos', cantidad: 6, unidad: 'unidad', categoria: 'Proteínas' },
      { id: 'ing-1-3', nombre: 'Cebolla dulce', cantidad: 1, unidad: 'unidad', categoria: 'Verduras y frutas' },
      { id: 'ing-1-4', nombre: 'Aceite de oliva virgen', cantidad: 100, unidad: 'ml', categoria: 'Otros' },
      { id: 'ing-1-5', nombre: 'Sal fina', cantidad: 1, unidad: 'cucharada', categoria: 'Otros' },
    ],
  },
  {
    id: 'receta-2',
    nombre: 'Ensalada mediterránea con pollo',
    porciones: 2,
    ingredientes: [
      { id: 'ing-2-1', nombre: 'Pechuga de pollo', cantidad: 400, unidad: 'g', categoria: 'Proteínas' },
      { id: 'ing-2-2', nombre: 'Lechuga romana', cantidad: 1, unidad: 'unidad', categoria: 'Verduras y frutas' },
      { id: 'ing-2-3', nombre: 'Tomates cherry', cantidad: 200, unidad: 'g', categoria: 'Verduras y frutas' },
      { id: 'ing-2-4', nombre: 'Queso feta', cantidad: 150, unidad: 'g', categoria: 'Lácteos' },
      { id: 'ing-2-5', nombre: 'Aceite de oliva virgen', cantidad: 2, unidad: 'cucharada', categoria: 'Otros' },
    ],
  },
  {
    id: 'receta-3',
    nombre: 'Pasta rigatoni con tomate y albahaca',
    porciones: 3,
    ingredientes: [
      { id: 'ing-3-1', nombre: 'Pasta rigatoni', cantidad: 350, unidad: 'g', categoria: 'Carbohidratos' },
      { id: 'ing-3-2', nombre: 'Salsa de tomate casera', cantidad: 400, unidad: 'g', categoria: 'Verduras y frutas' },
      { id: 'ing-3-3', nombre: 'Queso parmesano rallado', cantidad: 60, unidad: 'g', categoria: 'Lácteos' },
      { id: 'ing-3-4', nombre: 'Dientes de ajo', cantidad: 2, unidad: 'unidad', categoria: 'Verduras y frutas' },
      { id: 'ing-3-5', nombre: 'Albahaca fresca', cantidad: 1, unidad: 'taza', categoria: 'Verduras y frutas' },
    ],
  },
];

export const PLAN_SEMANAL_VACIO: PlanSemanal = {
  lunes: { desayuno: null, almuerzo: null, cena: null },
  martes: { desayuno: null, almuerzo: null, cena: null },
  miercoles: { desayuno: null, almuerzo: null, cena: null },
  jueves: { desayuno: null, almuerzo: null, cena: null },
  viernes: { desayuno: null, almuerzo: null, cena: null },
  sabado: { desayuno: null, almuerzo: null, cena: null },
  domingo: { desayuno: null, almuerzo: null, cena: null },
};

// Initial plan with a few recipes so the user sees immediate value in the planner & shopping list
export const PLAN_SEMANAL_INICIAL: PlanSemanal = {
  lunes: { desayuno: null, almuerzo: 'receta-1', cena: 'receta-2' },
  martes: { desayuno: null, almuerzo: 'receta-3', cena: null },
  miercoles: { desayuno: null, almuerzo: 'receta-2', cena: 'receta-1' },
  jueves: { desayuno: null, almuerzo: null, cena: null },
  viernes: { desayuno: null, almuerzo: 'receta-3', cena: null },
  sabado: { desayuno: null, almuerzo: null, cena: null },
  domingo: { desayuno: null, almuerzo: null, cena: null },
};
