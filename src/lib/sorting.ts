type SortDirection = 'asc' | 'desc';

type NestedSort = {
  [key: string]: SortDirection | NestedSort;
};

export function parseSortBy(
  sortBy: string,
  sortDirection: SortDirection
): NestedSort {
  const parts = sortBy.split('.');

  if (parts.length === 1) {
    return { [sortBy]: sortDirection };
  }

  const result: NestedSort = {};
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = {};
    current = current[parts[i]] as NestedSort;
  }

  current[parts[parts.length - 1]] = sortDirection;

  return result;
}
