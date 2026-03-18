import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startButton?: React.ReactNode;
  endButton?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startIcon, endIcon, startButton, endButton, ...props },
    ref
  ) => {
    return (
      <div className={cn('relative', className)}>
        {startButton && (
          <span className="absolute inset-y-0 left-0 flex items-center select-none">
            {startButton}
          </span>
        )}
        {startIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 select-none">
            {startIcon}
          </span>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            startIcon ? (typeof startIcon === 'string' ? 'pl-7' : 'pl-10') : '',
            endIcon ? (typeof endIcon === 'string' ? 'pr-7' : 'pr-10') : '',
            startButton ? 'pl-10' : '',
            endButton ? 'pr-10' : ''
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 select-none">
            {endIcon}
          </span>
        )}
        {endButton && (
          <span className="absolute inset-y-0 right-0 flex items-center select-none">
            {endButton}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
