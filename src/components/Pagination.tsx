'use client';

import PaginationWindow from '@/lib/PaginationWindow';
import { Button } from '@/components/ui/button';
import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageNumberPaginationMeta } from 'prisma-extension-pagination';

export default function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PageNumberPaginationMeta<true>;
  onPageChange: (page: number) => void;
}) {
  const window = new PaginationWindow(pagination);
  const pages = window.make();

  return (
    <>
      <div className="hidden md:block">
        <PaginationWrapper>
          <PaginationContent>
            <PaginationItem>
              {pagination.previousPage ? (
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.previousPage) {
                      onPageChange(pagination.previousPage);
                    }
                  }}
                />
              ) : (
                <Button variant="link" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </PaginationItem>
            {pages.map((page, index) => {
              if (page === PaginationWindow.SPACER) {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              {pagination.nextPage ? (
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.nextPage) {
                      onPageChange(pagination.nextPage);
                    }
                  }}
                />
              ) : (
                <Button variant="link" disabled>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </PaginationItem>
          </PaginationContent>
        </PaginationWrapper>
      </div>

      <div className="md:hidden flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (pagination.previousPage) {
              onPageChange(pagination.previousPage);
            }
          }}
          disabled={!pagination.previousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          Page {pagination.currentPage} of {pagination.pageCount}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (pagination.nextPage) {
              onPageChange(pagination.nextPage);
            }
          }}
          disabled={!pagination.nextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
