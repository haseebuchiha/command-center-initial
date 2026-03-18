'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

export default function SortableColumn({
  name,
  label,
  sortBy,
  sortDirection,
  onSortChange,
}: {
  name: string;
  label: string | ReactNode;
  sortBy: string;
  sortDirection: string;
  onSortChange: (sortBy: string, sortDirection: string) => void;
}) {
  const updateSort = () => {
    const newSortDirection =
      sortBy === name ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    onSortChange(name, newSortDirection);
  };

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 !px-0 font-medium hover:bg-transparent justify-start cursor-pointer"
      onClick={updateSort}
    >
      <span className="flex items-center gap-1">
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-all duration-200 ${
            sortBy === name
              ? `opacity-100 ${sortDirection === 'desc' ? 'rotate-0' : 'rotate-180'}`
              : 'opacity-0 group-hover:opacity-50'
          }`}
        />
      </span>
    </Button>
  );
}
