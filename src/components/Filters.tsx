'use client';

import MobileFilters from './MobileFilters';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup, SelectLabel } from '@/components/ui/select';
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
  Search,
  X,
  Filter,
} from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import {
  parseAsInteger,
  parseAsString,
  Parser,
  useQueryState,
  useQueryStates,
} from 'nuqs';

type FilterBase = {
  key: string;
  label: string;
  defaultActive?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRemoveValue?: any;
};

export type Filter =
  | (FilterBase & { type: 'input' | 'checkbox' })
  | (FilterBase & {
      type: 'select' | 'combobox';
      items: { value: string; label: string }[];
    })
  | (FilterBase & {
      type: 'dateRange';
      dateType?: 'floating' | 'timestamp'; // Default is 'timestamp' for backward compatibility
      datePickerShortcuts?: { label: string; value: [Date, Date] }[];
    });

export type FilterOptions = {
  filters: Filter[];
  sortOptions: { key: string; name: string }[];
  showSearch?: boolean;
};

export const Filters = ({
  options,
  values,
}: {
  options: FilterOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any;
}) => {
  const showSearch =
    options.showSearch !== undefined ? options.showSearch : true;

  const [opens, setOpens] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    shallow: false,
    throttleMs: 300,
  });
  const [, setPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({
      shallow: false,
      throttleMs: 300,
    })
  );
  const [activeFilterKeys, setActiveFilterKeys] = useState<string[]>([]);

  const getQueryFields = () => {
    const result: Record<string, Parser<string>> = {};

    for (const filter of options.filters) {
      if (filter.type === 'dateRange') {
        result[filter.key + 'From'] = parseAsString;
        result[filter.key + 'To'] = parseAsString;
      } else {
        result[filter.key] = parseAsString;
      }
    }

    return result;
  };

  const [queryValues, setValues] = useQueryStates(getQueryFields(), {
    shallow: false,
    throttleMs: 300,
  });

  const activeFilters = options.filters.filter((filter) => {
    if (activeFilterKeys.includes(filter.key)) {
      return true;
    }

    if (filter.type === 'dateRange') {
      if (queryValues[filter.key + 'From'] || queryValues[filter.key + 'To']) {
        return true;
      }
    }

    if (queryValues[filter.key]) {
      return true;
    }

    if (filter.defaultActive) {
      return true;
    }

    return false;
  });

  const handleChange = (value: Record<string, string | null>) => {
    setValues({
      ...queryValues,
      ...value,
    });
    setPage(null);
  };

  const removeFilter = (filter: Filter) => {
    if (filter.type === 'dateRange') {
      setValues({
        ...queryValues,
        [filter.key + 'From']: null,
        [filter.key + 'To']: null,
      });
    } else {
      setValues({
        ...queryValues,
        [filter.key]: null,
      });
    }
    setPage(null);
    setActiveFilterKeys(activeFilterKeys.filter((k) => k !== filter.key));
  };

  const addFilter = (filter: Filter) => {
    setActiveFilterKeys([...activeFilterKeys, filter.key]);
  };

  return (
    <div className="flex gap-4 items-center min-w-0">
      {/* Padding + negative margin so input ring on focus is not cut off */}
      <div className="flex flex-1 gap-4 items-center overflow-y-auto p-1 -ml-1">
        {showSearch && (
          <div className="flex-1">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(null);
              }}
              placeholder="Search"
              startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
              endIcon={
                search ? (
                  <X
                    className="h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => {
                      setSearch('');
                      setPage(null);
                    }}
                  />
                ) : undefined
              }
              className="sm:min-w-80"
            />
          </div>
        )}

        {activeFilters.map((filter) => {
          return (
            <div key={filter.key} className="hidden sm:block">
              <div className=" flex gap-2 items-center">
                {filter.type === 'input' && (
                  <Input
                    value={queryValues[filter.key] || ''}
                    onChange={(e) =>
                      handleChange({ [filter.key]: e.target.value })
                    }
                    placeholder={filter.label}
                    endIcon={
                      values[filter.key] ? (
                        <X
                          className="h-4 w-4 text-muted-foreground cursor-pointer"
                          onClick={() => {
                            handleChange({ [filter.key]: null });
                            removeFilter(filter);
                          }}
                        />
                      ) : undefined
                    }
                  />
                )}

                {filter.type === 'select' && (
                  <Select
                    defaultValue={values[filter.key] ? values[filter.key] : ''}
                    value={values[filter.key] ? values[filter.key] : ''}
                    onValueChange={(value) =>
                      handleChange({ [filter.key]: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.label}>
                        {values[filter.key]
                          ? filter.items.find(
                              (item) => item.value === values[filter.key]
                            )?.label
                          : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{filter.label}</SelectLabel>

                        {filter.items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}

                {filter.type === 'combobox' && (
                  <Popover
                    open={opens[filter.key] || false}
                    onOpenChange={(value) => {
                      setOpens({ ...opens, [filter.key]: value });
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className=" justify-between">
                        {values[filter.key]
                          ? (filter.items.find(
                              (i) => i.value === values[filter.key]
                            )?.label ?? filter.label)
                          : filter.label}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className=" p-0" align="start">
                      <Command>
                        <CommandInput placeholder={`Search...`} />
                        <CommandList>
                          <CommandEmpty>No items found.</CommandEmpty>
                          <CommandGroup>
                            {filter.items.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                keywords={[item.label]}
                                onSelect={() => {
                                  handleChange({ [filter.key]: item.value });
                                  setOpens({ ...opens, [filter.key]: false });
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    values[filter.key] === item.value
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
                )}

                {filter.type === 'dateRange' && (
                  <Popover
                    open={opens[filter.key] || false}
                    onOpenChange={(value) =>
                      setOpens({ ...opens, [filter.key]: value })
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !values[filter.key + 'From'] &&
                            !values[filter.key + 'To'] &&
                            'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {values[filter.key + 'From'] ? (
                          values[filter.key + 'To'] ? (
                            <>
                              {formatFilterDateDisplay(
                                values[filter.key + 'From'],
                                filter.dateType,
                                'LLL d, y'
                              )}{' '}
                              -{' '}
                              {formatFilterDateDisplay(
                                values[filter.key + 'To'],
                                filter.dateType,
                                'LLL d, y'
                              )}
                            </>
                          ) : (
                            formatFilterDateDisplay(
                              values[filter.key + 'From'],
                              filter.dateType,
                              'LLL d, y'
                            )
                          )
                        ) : (
                          <span>{filter.label}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {filter.datePickerShortcuts &&
                        filter.datePickerShortcuts.length > 0 && (
                          <div className="p-2 flex flex-col gap-2">
                            {filter.datePickerShortcuts.map((shortcut) => (
                              <Button
                                key={shortcut.label}
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  handleChange({
                                    [filter.key + 'From']:
                                      filter.dateType === 'floating'
                                        ? toFloatingDateString(
                                            shortcut.value[0]
                                          )
                                        : toStartOfDayTimestamp(
                                            shortcut.value[0]
                                          ),
                                    [filter.key + 'To']:
                                      filter.dateType === 'floating'
                                        ? toFloatingDateString(
                                            shortcut.value[1]
                                          )
                                        : toEndOfDayTimestamp(
                                            shortcut.value[1]
                                          ),
                                  });

                                  setOpens({ ...opens, [filter.key]: false });
                                }}
                              >
                                {shortcut.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      <Calendar
                        autoFocus
                        mode="range"
                        defaultMonth={normalizeFilterDate(
                          values[filter.key + 'From'],
                          filter.dateType
                        )}
                        selected={{
                          from: normalizeFilterDate(
                            values[filter.key + 'From'],
                            filter.dateType
                          ),
                          to: normalizeFilterDate(
                            values[filter.key + 'To'],
                            filter.dateType
                          ),
                        }}
                        onSelect={(value) =>
                          handleChange({
                            [filter.key + 'From']: value?.from
                              ? filter.dateType === 'floating'
                                ? toFloatingDateString(value.from)
                                : toStartOfDayTimestamp(value.from)
                              : '',
                            [filter.key + 'To']: value?.to
                              ? filter.dateType === 'floating'
                                ? toFloatingDateString(value.to)
                                : toEndOfDayTimestamp(value.to)
                              : '',
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {filter.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${filter.key}`}
                      checked={!!values[filter.key]}
                      onCheckedChange={(value) => {
                        handleChange({
                          [filter.key]: value ? 'true' : null,
                        });
                      }}
                    />
                    <label
                      htmlFor={`checkbox-${filter.key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {filter.label}
                    </label>
                  </div>
                )}

                <X
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => {
                    if (filter.type === 'dateRange') {
                      handleChange({
                        [filter.key + 'From']: null,
                        [filter.key + 'To']: null,
                      });
                    } else {
                      handleChange({
                        [filter.key]: filter.onRemoveValue
                          ? filter.onRemoveValue
                          : null,
                      });
                    }

                    removeFilter(filter);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {options.filters.length > 0 && (
        <div className="hidden sm:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                {options.filters.map((filter) => (
                  <DropdownMenuItem
                    disabled={
                      !!activeFilters.find(
                        (activeFilter) => activeFilter.key === filter.key
                      )
                    }
                    key={filter.key}
                    onClick={() => addFilter(filter)}
                  >
                    <span>{filter.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {(options.filters.length > 0 || options.sortOptions.length > 0) && (
        <div className="sm:hidden">
          <MobileFilters options={options} values={values} />
        </div>
      )}
    </div>
  );
};
