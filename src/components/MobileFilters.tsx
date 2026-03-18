'use client';

import { Filter, FilterOptions } from './Filters';
import { Calendar } from './ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { useCreateQueryString } from '@/lib/useCreateQueryString';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  toFloatingDateString,
  toStartOfDayTimestamp,
  toEndOfDayTimestamp,
  normalizeFilterDate,
  formatFilterDateDisplay,
} from '@/lib/dates';
import {
  CalendarIcon,
  Check,
  ChevronDown,
  Filter as FilterIcon,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@bprogress/next/app';
import { Checkbox } from './ui/checkbox';

export default function MobileFilters({
  options,
  values,
}: {
  options: FilterOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
}) {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const createQueryString = useCreateQueryString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDefaultValues = (filters: Filter[], values: any) => {
    const result = filters.reduce((acc, filter) => {
      if (filter.type === 'dateRange') {
        const fromValue = values[filter.key + 'From'];
        const toValue = values[filter.key + 'To'];
        acc[filter.key] = {
          from: normalizeFilterDate(fromValue, filter.dateType),
          to: normalizeFilterDate(toValue, filter.dateType),
        };
      } else if (filter.type === 'checkbox') {
        acc[filter.key] = values[filter.key] || undefined;
      } else {
        acc[filter.key] = values[filter.key] || '';
      }

      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);

    result.sort = values.sortBy
      ? `${values.sortBy},${values.sortDirection}`
      : '';

    return result;
  };

  const form = useForm({
    defaultValues: getDefaultValues(options.filters, values),
  });

  useEffect(() => {
    form.reset(getDefaultValues(options.filters, values));
  }, [options.filters, values, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any) => {
    const queryString = options.filters.reduce((acc, filter) => {
      if (filter.type === 'dateRange') {
        acc[filter.key + 'From'] = data[filter.key]?.from
          ? filter.dateType === 'floating'
            ? toFloatingDateString(data[filter.key].from)
            : toStartOfDayTimestamp(data[filter.key].from)
          : '';
        acc[filter.key + 'To'] = data[filter.key]?.to
          ? filter.dateType === 'floating'
            ? toFloatingDateString(data[filter.key].to)
            : toEndOfDayTimestamp(data[filter.key].to)
          : '';
      } else if (filter.type === 'checkbox') {
        acc[filter.key] = data[filter.key] || undefined;
      } else {
        if (data[filter.key]) {
          acc[filter.key] = data[filter.key];
        }
      }

      return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);

    queryString.sortBy = data.sort.split(',')[0];
    queryString.sortDirection = data.sort.split(',')[1];

    queryString.page = undefined;

    router.push(createQueryString(queryString));
    setOpen(false);
  };

  const reset = () => {
    form.reset(getDefaultValues(options.filters, values));
  };

  const openModal = () => {
    reset();
    setOpen(true);
  };

  const resetFilters = () => {
    router.push('?');

    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => openModal()}>
        <FilterIcon className="h-4 w-4" />
      </Button>

      <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle className="text-left">Filter</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-3">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                {options.sortOptions.length > 0 && (
                  <FormField
                    control={form.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.sortOptions.map((sortOption) => (
                              <SelectItem
                                key={sortOption.key}
                                value={sortOption.key}
                              >
                                {sortOption.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}

                {options.filters.map((filter) => (
                  <div key={filter.key}>
                    {filter.type === 'input' && (
                      <FormField
                        control={form.control}
                        name={filter.key}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{filter.label}</FormLabel>
                            <Input
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder={filter.label}
                              endIcon={
                                field.value ? (
                                  <X
                                    className="h-4 w-4 text-muted-foreground cursor-pointer"
                                    onClick={() => {
                                      field.onChange('');
                                      form.setValue(filter.key, '');
                                    }}
                                  />
                                ) : undefined
                              }
                            />
                          </FormItem>
                        )}
                      />
                    )}

                    {filter.type === 'select' && (
                      <FormField
                        control={form.control}
                        name={filter.key}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{filter.label}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={filter.label}>
                                    {field.value
                                      ? filter.items.find(
                                          (item) => item.value === field.value
                                        )?.label
                                      : ''}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>{filter.label}</SelectLabel>

                                  {filter.items.map((item) => (
                                    <SelectItem
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}

                    {filter.type === 'combobox' && (
                      <FormField
                        control={form.control}
                        name={filter.key}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{filter.label}</FormLabel>
                            <Popover
                              open={opens[filter.key]}
                              onOpenChange={(value) => {
                                setOpens({ ...opens, [filter.key]: value });
                              }}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      'w-full justify-between',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value
                                      ? filter.items.find(
                                          (i) => i.value === field.value
                                        )?.label
                                      : filter.label}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search..." />
                                  <CommandList>
                                    <CommandEmpty>No items found.</CommandEmpty>
                                    <CommandGroup>
                                      {filter.items.map((item) => (
                                        <CommandItem
                                          value={item.value}
                                          key={item.value}
                                          keywords={[item.label]}
                                          onSelect={() => {
                                            field.onChange(item.value);
                                            setOpens({
                                              ...opens,
                                              [filter.key]: false,
                                            });
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              item.value === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {item.label}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    )}

                    {filter.type === 'dateRange' && (
                      <FormField
                        control={form.control}
                        name={filter.key}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{filter.label}</FormLabel>
                            <Popover
                              open={opens[filter.key]}
                              onOpenChange={(value) =>
                                setOpens({ ...opens, [filter.key]: value })
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'justify-start text-left font-normal',
                                    !field.value.from &&
                                      !field.value.to &&
                                      'text-muted-foreground'
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value.from ? (
                                    field.value.to ? (
                                      <>
                                        {formatFilterDateDisplay(
                                          field.value.from,
                                          filter.dateType,
                                          'LLL dd, y'
                                        )}{' '}
                                        -{' '}
                                        {formatFilterDateDisplay(
                                          field.value.to,
                                          filter.dateType,
                                          'LLL dd, y'
                                        )}
                                      </>
                                    ) : (
                                      formatFilterDateDisplay(
                                        field.value.from,
                                        filter.dateType,
                                        'LLL dd, y'
                                      )
                                    )
                                  ) : (
                                    <span>{filter.label}</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                {filter.datePickerShortcuts &&
                                  filter.datePickerShortcuts.length > 0 && (
                                    <div className="p-2 flex flex-col gap-2">
                                      {filter.datePickerShortcuts.map(
                                        (shortcut) => (
                                          <Button
                                            key={shortcut.label}
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                              field.onChange({
                                                from: shortcut.value[0],
                                                to: shortcut.value[1],
                                              });
                                              setOpens({
                                                ...opens,
                                                [filter.key]: false,
                                              });
                                            }}
                                          >
                                            {shortcut.label}
                                          </Button>
                                        )
                                      )}
                                    </div>
                                  )}

                                <Calendar
                                  autoFocus
                                  mode="range"
                                  defaultMonth={field.value.from ?? undefined}
                                  selected={{
                                    from: field.value.from ?? undefined,
                                    to: field.value.to ?? undefined,
                                  }}
                                  onSelect={field.onChange}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    )}

                    {filter.type === 'checkbox' && (
                      <FormField
                        control={form.control}
                        name={filter.key}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(value) => {
                                  field.onChange(value ? true : false);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{filter.label}</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                  <Button>Apply</Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
