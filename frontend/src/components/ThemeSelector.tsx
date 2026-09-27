import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../state/theme';

function ChevronIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 5 5 9-9" />
    </svg>
  );
}

export function ThemeSelector() {
  const { themeId, setThemeId, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const current = themes.find((t) => t.id === themeId) ?? themes[0];

  return (
    <div ref={containerRef} className="fixed right-4 top-4 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/8%)] px-3 py-1.5 text-xs font-medium text-[rgb(var(--ink)/85%)] backdrop-blur-xl hover:bg-[rgb(var(--ink)/14%)]"
      >
        <span>{current?.label ?? 'Theme'}</span>
        <ChevronIcon className={`h-3.5 w-3.5 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[9rem] overflow-hidden rounded-2xl border border-[rgb(var(--ink)/15%)] bg-[rgb(var(--ink)/10%)] p-1 text-sm text-[rgb(var(--ink)/90%)] shadow-lg shadow-[rgb(var(--recede)/20%)] backdrop-blur-2xl"
        >
          {themes.map((theme) => {
            const isSelected = theme.id === themeId;
            return (
              <button
                key={theme.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setThemeId(theme.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition ${
                  isSelected ? 'bg-[rgb(var(--ink)/15%)]' : 'hover:bg-[rgb(var(--ink)/10%)]'
                }`}
              >
                <span>{theme.label}</span>
                {isSelected && <CheckIcon className="h-3.5 w-3.5 text-[rgb(var(--ink)/80%)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
