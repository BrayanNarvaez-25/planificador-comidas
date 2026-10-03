import React from 'react';
import { Menu } from 'lucide-react';

export type ActiveTab = 'recetas' | 'planificador' | 'compras';

interface NavbarProps {
  activeTab: ActiveTab;
  onToggleDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onToggleDrawer }) => {
  const getSectionTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'recetas':
        return 'Recetario';
      case 'planificador':
        return 'Planificador Semanal';
      case 'compras':
        return 'Lista de Compras';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left zone: Hamburger button + Current Section Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleDrawer}
              aria-label="Abrir menú de navegación"
              title="Abrir menú"
              className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                {getSectionTitle(activeTab)}
              </span>
              <span className="hidden sm:inline-block text-xs text-neutral-400 font-normal">
                · Planificador de Comidas
              </span>
            </div>
          </div>

          {/* Right zone: Subtle helper hint for desktop hover */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
            <span>Desliza al borde izquierdo para abrir el menú</span>
          </div>
        </div>
      </div>
    </header>
  );
};
