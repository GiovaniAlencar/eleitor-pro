import { Filter, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FilterOption {
  label: string;
  value: string;
  group?: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  onFilter: (selected: string[]) => void;
}

export default function FilterButton({ options, onFilter }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    setSelected(newSelected);
    onFilter(newSelected);
  };

  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'Outros';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          selected.length > 0
            ? 'bg-cyan-50 text-cyan-600 border-cyan-200'
            : 'text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm">Filtrar</span>
        {selected.length > 0 && (
          <span className="bg-cyan-100 text-cyan-600 text-xs px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 right-0"
        >
          <div className="p-2">
            {selected.length > 0 && (
              <button
                onClick={() => {
                  setSelected([]);
                  onFilter([]);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                Limpar filtros
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group} className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
                    {group}
                  </div>
                  {groupOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        onChange={() => toggleOption(option.value)}
                        className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
