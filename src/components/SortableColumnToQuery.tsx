'use client';

import { useCreateQueryString } from '@/lib/useCreateQueryString';
import { useRouter } from '@bprogress/next/app';
import { ReactNode } from 'react';
import SortableColumn from './SortableColumn';

export default function SortableColumnToQuery({
  name,
  label,
  sortBy,
  sortDirection,
}: {
  name: string;
  label: string | ReactNode;
  sortBy: string;
  sortDirection: string;
}) {
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  const updateSort = (sortBy: string, sortDirection: string) => {
    router.push(
      createQueryString({
        sortBy,
        sortDirection,
        page: '',
      }),
      {
        scroll: false,
      }
    );
  };

  return (
    <SortableColumn
      name={name}
      label={label}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={updateSort}
    />
  );
}
