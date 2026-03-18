'use client';

import { PageNumberPaginationMeta } from 'prisma-extension-pagination';
import { useCreateQueryString } from '@/lib/useCreateQueryString';
import { useRouter } from '@bprogress/next/app';
import Pagination from './Pagination';

export default function PaginationToQuery({
  pagination,
}: {
  pagination: PageNumberPaginationMeta<true>;
}) {
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  return (
    <Pagination
      pagination={pagination}
      onPageChange={(page) => {
        router.push(createQueryString({ page: String(page) }));
      }}
    />
  );
}
