export type CategoriaIngrediente =
  | 'Lácteos'
  | 'Verduras y frutas'
  | 'Proteínas'
  | 'Carbohidratos'
  | 'Otros';

export type UnidadMedida =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'unidad'
  | 'taza'
  | 'cucharada';

export interface Ingrediente {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: UnidadMedida;
  categoria: CategoriaIngrediente;
}

export interface Receta {
  id: string;
  nombre: string;
  porciones: number;
  ingredientes: Ingrediente[];
}

export type DiaSemana =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

export type MomentoComida = 'desayuno' | 'almuerzo' | 'cena';

export type PlanSemanal = Record<DiaSemana, Record<MomentoComida, string | null>>;

export interface ItemAgrupadoCompra {
  key: string;
  nombre: string;
  cantidad: number;
  unidad: UnidadMedida;
  categoria: CategoriaIngrediente;
  recetasOrigen: {
    recetaId: string;
    recetaNombre: string;
    cantidad: number;
  }[];
}

export const CATEGORIAS_INGREDIENTES: CategoriaIngrediente[] = [
  'Lácteos',
  'Verduras y frutas',
  'Proteínas',
  'Carbohidratos',
  'Otros',
];

export const UNIDADES_MEDIDA: UnidadMedida[] = [
  'g',
  'kg',
  'ml',
  'l',
  'unidad',
  'taza',
  'cucharada',
];

export const DIAS_SEMANA: { key: DiaSemana; label: string; shortLabel: string }[] = [
  { key: 'lunes', label: 'Lunes', shortLabel: 'Lun' },
  { key: 'martes', label: 'Martes', shortLabel: 'Mar' },
  { key: 'miercoles', label: 'Miércoles', shortLabel: 'Mié' },
  { key: 'jueves', label: 'Jueves', shortLabel: 'Jue' },
  { key: 'viernes', label: 'Viernes', shortLabel: 'Vie' },
  { key: 'sabado', label: 'Sábado', shortLabel: 'Sáb' },
  { key: 'domingo', label: 'Domingo', shortLabel: 'Dom' },
];

export const MOMENTOS_COMIDA: { key: MomentoComida; label: string; iconName: string }[] = [
  { key: 'desayuno', label: 'Desayuno', iconName: 'Coffee' },
  { key: 'almuerzo', label: 'Almuerzo', iconName: 'Utensils' },
  { key: 'cena', label: 'Cena', iconName: 'Moon' },
];
