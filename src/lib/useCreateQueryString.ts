import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCreateQueryString = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (values: Record<string, string | string[] | undefined>) => {
      const result = new URLSearchParams(searchParams);

      for (const key of Object.keys(values)) {
        const value = values[key];
        if (value !== undefined) {
          result.set(key, Array.isArray(value) ? value.join(',') : value);
        } else {
          result.delete(key);
        }
      }

      return '?' + result.toString();
    },
    [searchParams]
  );

  return createQueryString;
};
