import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, ShoppingCart, X, UtensilsCrossed } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface SideDrawerProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  recipesCount: number;
  plannedMealsCount: number;
  shoppingItemsCount: number;
  // External toggle listener or trigger
  externalIsOpen?: boolean;
  onToggleExternal?: (isOpen: boolean) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  activeTab,
  onTabChange,
  recipesCount,
  plannedMealsCount,
  shoppingItemsCount,
  externalIsOpen,
  onToggleExternal,
}) => {
  // Independent internal state as required by specification
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (externalIsOpen !== undefined && externalIsOpen !== isOpen) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Notify parent of state changes if handler provided
  const updateOpenState = (open: boolean) => {
    setIsOpen(open);
    if (onToggleExternal) {
      onToggleExternal(open);
    }
  };

  // Listen to custom global toggle events (for mobile hamburger button or keyboard triggers)
  useEffect(() => {
    const handleToggleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === 'boolean') {
        updateOpenState(customEvent.detail.open);
      } else {
        updateOpenState(!isOpen);
      }
    };

    window.addEventListener('toggle-side-drawer', handleToggleEvent);
    return () => window.removeEventListener('toggle-side-drawer', handleToggleEvent);
  }, [isOpen]);

  // Mouse hover handlers with debounced exit (200ms delay to prevent flickering)
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    updateOpenState(true);
  };

  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      updateOpenState(false);
    }, 200);
  };

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        updateOpenState(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleItemClick = (tab: ActiveTab) => {
    onTabChange(tab);
    updateOpenState(false);
  };

  return (
    <>
      {/* 1. Thin 8px activation strip along the left screen edge */}
      <div
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        tabIndex={0}
        aria-label="Zona de activación del menú lateral"
        role="button"
        title="Pasa el cursor para ver el menú"
        className="fixed top-0 bottom-0 left-0 w-2 z-50 cursor-pointer group bg-neutral-300/40 hover:bg-emerald-600 transition-colors duration-200"
      >
        {/* Subtle visual notch indicator in the vertical center */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0.5 w-1 h-10 rounded-full bg-neutral-400/60 group-hover:bg-white transition-colors" />
      </div>

      {/* 2. Backdrop for mobile/touch screens when drawer is open */}
      {isOpen && (
        <div
          onClick={() => updateOpenState(false)}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs transition-opacity duration-250 lg:bg-black/15"
          aria-hidden="true"
        />
      )}

      {/* 3. The Sliding Drawer Panel (position: fixed, z-50, does NOT shift page content) */}
      <aside
        ref={drawerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        aria-label="Menú principal de navegación"
        aria-hidden={!isOpen}
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-neutral-200 shadow-2xl flex flex-col justify-between transition-transform duration-250 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Section */}
        <div>
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 tracking-tight leading-tight">
                  Planificador de Comidas
                </h2>
                <p className="text-[11px] text-neutral-400">Menú & Lista de Compras</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateOpenState(false)}
              aria-label="Cerrar menú lateral"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {/* Recetas */}
            <button
              type="button"
              onClick={() => handleItemClick('recetas')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'recetas'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Recetas</span>
              </div>
              <span
                className={`text-xs tabular-nums px-2 py-0.5 rounded-md font-semibold ${
                  activeTab === 'recetas'
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {recipesCount}
              </span>
            </button>

            {/* Planificador semanal */}
            <button
              type="button"
              onClick={() => handleItemClick('planificador')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'planificador'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Planificador semanal</span>
              </div>
              <span
                className={`text-xs tabular-nums px-2 py-0.5 rounded-md font-semibold ${
                  activeTab === 'planificador'
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {plannedMealsCount}
              </span>
            </button>

            {/* Lista de compras */}
            <button
              type="button"
              onClick={() => handleItemClick('compras')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'compras'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Lista de compras</span>
              </div>
              <span
                className={`text-xs tabular-nums px-2 py-0.5 rounded-md font-semibold ${
                  activeTab === 'compras'
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {shoppingItemsCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/60">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-neutral-700">Almacenamiento Local</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-neutral-400 bg-white border border-neutral-200 rounded font-mono">
              Esc
            </kbd>
          </div>
        </div>
      </aside>
    </>
  );
};
