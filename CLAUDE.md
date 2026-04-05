# Next.js Project Development Guide

## Table of Contents

- [Principles](#principles)
  - [Code Standards](#code-standards)
- [Development Guidelines](#development-guidelines)
- [Project Structure](#project-structure)
  - [Directory Structure](#directory-structure)
  - [Import Conventions](#import-conventions)
- [Architecture](#architecture)
  - [Routes](#routes)
  - [Controllers](#controllers)
  - [Views](#views)
  - [Components](#components)
- [Data Layer](#data-layer)
  - [Database (Prisma)](#database-prisma)
  - [Models](#models)
  - [Type-safe Props](#type-safe-props)
- [Business Logic](#business-logic)
  - [Services](#services)
  - [Server Actions](#server-actions)
  - [Commands](#commands)
- [Validation](#validation)
  - [Validation Pattern](#validation-pattern)
  - [Common Validators](#common-validators)
- [User Interface](#user-interface)
  - [Forms](#forms)
  - [Filters](#filters)
  - [Table Sorting](#table-sorting)
  - [Pagination](#pagination)
- [Date Handling](#date-handling)
  - [Overview](#overview)
  - [Floating Dates vs Timestamps](#floating-dates-vs-timestamps)
  - [Implementation](#implementation)
  - [Helper Functions](#helper-functions)
- [Additional Features](#additional-features)
  - [Authentication](#authentication)
  - [Email](#email)
  - [Queued Jobs](#queued-jobs)
  - [File Storage](#file-storage)
- [Libraries](#libraries)

---

## Principles

- **Seek simplicity and readability.** Write code that's easy to understand without extensive comments.
- **Don't assume - look at what's actually there.** Don't assume what functions or code look like. Actually examine the existing codebase to understand the current patterns and implementations before making changes.
- **Use conventions over configuration.** Stick with sensible defaults.
- **Follow the Boy Scout Rule.** Always leave code cleaner than you found it. If you touch a file, improve it.
- **Don't be afraid to delete code.** Ruthlessly simplify and eliminate anything unnecessary.
- **Remove dead code immediately.** When changes make code obsolete (hardcoded values, unused functions, props that aren't used), delete it without being asked.
- **Think through implications.** When removing features or relationships, proactively clean up all related code, UI elements, and type definitions that become unnecessary.
- **Refactor holistically.** Don't just fix errors - consider what can be simplified given the new requirements.
- **Clean up after yourself.** Remove unused imports, addressed TODOs, debugging code, and simplify logic that can be simplified.
- **UI/UX** For UI/UX think about how a modern / popular app would handle it.

### Code Standards

- Use types for everything. Avoid using `any`.
- Don't use types for function returns - rely on TypeScript's inference unless there's a specific reason.
- Use types instead of interfaces when defining types.
- Write self-documenting code. Only add comments when absolutely necessary for complex logic.

## Development Guidelines

### File Search and Navigation

When searching for files or listing directories, **always exclude the `src/generated/` folder** unless you explicitly need to reference generated code (e.g., Prisma types). This folder contains auto-generated code that adds noise to search results.

- When using search tools (grep, glob, etc.), exclude `src/generated/`
- When listing files with LS, ignore the generated folder
- Only include `src/generated/` when you specifically need to import from `@/generated/prisma/client`

## Project Structure

### Directory Structure

This project uses a **layered MVC architecture** adapted for Next.js with clear separation of concerns.

```
src/
├── actions/        # Server actions
├── app/            # Routes
├── controllers/    # Controllers (Server Components)
├── commands/       # Commands
├── components/     # Shared Components
├── components/ui/  # Shadcn Components
├── errors/         # Errors
├── hooks/          # Common hooks reused throughout application
├── jobs/           # Queued jobs
├── lib/            # Various functions, helpers that are used throughout the application
├── mail/           # Functions to send emails
├── validators/     # Input Validation (Form and Server validators)
├── services/       # Business Logic Layer
├── types/          # Generic types used throughout application
├── views/          # Views (React Components)
└── views/emails/   # Views for emails (React Components)
```

Files should be broken down by domain, entity, action. For example:

- Route: `src/app/admin/pages/[id]/edit/page.tsx`
- Controller: `src/controllers/admin/pages/PagesEditController.tsx`
- View: `src/views/admin/pages/Edit.tsx`
- Action: `src/actions/admin/pages/updatePage.ts`
- Form Validator: `src/validators/admin/pages/updatePageFormValidator.ts`
- Server Validator: `src/validators/admin/pages/updatePageValidator.ts`

### Import Conventions

Standard import patterns used throughout the application:

```tsx
// Prisma imports
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

// Type-safe Prisma payloads
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

// Component imports
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

// Validator imports
import { storePageFormValidator } from '@/validators/admin/pages/storePageFormValidator';
import { storePageValidator } from '@/validators/admin/pages/storePageValidator';

// Library imports
import { DateTime } from 'luxon';
import { z } from 'zod';
```

---

## Architecture

### Routes

The `src/app/` directory should strictly be used as a router, offloading everything to the controller.

```tsx
// src/app/admin/pages/[id]/edit/page.tsx
import {
  PagesEditController,
  generateMetadata,
} from '@/controllers/admin/pages/PagesEditController';

export { generateMetadata };
export default PagesEditController;
```

#### Route Helpers

Use the `route` helper for type-safe route generation:

```tsx
// src/lib/routes.ts
export const routes = {
  index: '/',
  'admin.pages.index': '/admin/pages',
  'admin.pages.create': '/admin/pages/create',
  'admin.pages.show': '/admin/pages/:id',
  'admin.pages.edit': '/admin/pages/:id/edit',
  'projects.tasks.show': '/projects/:projectId/tasks/:taskId',
};

// Usage
import { route } from '@/lib/route';

// Single parameter
route('admin.pages.edit', page.id);

// Multiple parameters
route('projects.tasks.show', projectId, taskId);
```

### Controllers

Controllers are responsible for pulling in the data needed to render a page. Default to pulling all necessary data in the controller and passing it to the view.

```tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Edit } from '@/views/admin/pages/Edit';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: page ? `${page.name} | Admin Portal` : 'Edit Page | Admin Portal',
  };
}

export const PagesEditController = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  return <Edit page={page} />;
};
```

For complex operations, defer to service classes or create a separate function at the bottom of the controller file if it's only used once.

### Views

Views are React components that render the page. They accept parameters from the controller.

```tsx
'use client';

import { Page } from '@/generated/prisma/client';
import { useForm } from 'react-hook-form';

export const Edit = ({ page }: { page: Page }) => {
  const form = useForm();

  return <>{/* Render your page content here */}</>;
};
```

Components are server components by default. Use `'use client'` directive when state or effects are needed.

### Components

- Use Shadcn for UI components: `npx shadcn@latest add [component-name]`
- Store shared components in `src/components/`
- Shadcn components live in `src/components/ui/`

---

## Data Layer

### Database (Prisma)

- Use Prisma as the ORM
- Import from `@/lib/prisma`
- Use default database naming (avoid `@@map`)
- Always include `createdAt` and `updatedAt` fields unless unnecessary

### Models

Use Prisma-generated models from `@/generated/prisma/client`.

### Type-safe Props

Use the model type directly when no relations are included:

```tsx
import { User, Franchise, Page } from '@/generated/prisma/client';

// Use model types directly for simple queries
export const UserList = ({ users }: { users: User[] }) => {
  // ...
};

export const FranchiseDetails = ({ franchise }: { franchise: Franchise }) => {
  // ...
};
```

When including relations, use `Prisma.[Model]GetPayload` for type safety:

```tsx
import { Prisma } from '@/generated/prisma/client';

// Only use GetPayload when relations are included
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

export const UserProfile = ({ user }: { user: UserWithPosts }) => {
  // Full type safety for user and user.posts
};
```

Never manually construct types like `User & { posts: Post[] }`.

---

## Business Logic

### Services

Create service classes for complex business logic that's used in multiple places or is too complex for a controller.

### Server Actions

Server actions allow the frontend to make type-safe calls to the backend server.

**Important:** When client components need to fetch data dynamically, create server actions instead of API routes. This maintains type safety and consistency with the rest of the application.

```tsx
'use server';

import { adminAuthActionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { storePageFormValidator } from '@/validators/admin/pages/storePageFormValidator';
import { storePageValidator } from '@/validators/admin/pages/storePageValidator';
import { validateWithErrors } from '@/lib/validateWithErrors';
import { revalidatePath } from 'next/cache';

export const storePage = adminAuthActionClient
  .inputSchema(storePageFormValidator)
  .action(async ({ parsedInput }) => {
    // Run async validation and transformations
    const validated = await validateWithErrors(
      storePageValidator,
      parsedInput,
      storePageFormValidator // Used for error field mapping
    );

    const result = await prisma.page.create({
      data: validated,
    });

    revalidatePath('/');
    return result;
  });
```

**Key Points:**

- Include `'use server'` at the top
- Use appropriate action client (actionClient, authClient, adminAuthClient)
- Use the form validator for `.inputSchema()`
- Use `validateWithErrors` for server validation with async checks
- Clear cache with `revalidatePath`
- Use server actions for dynamic data fetching in client components (don't create API routes)

#### Example: Fetching Data in Client Components

```tsx
// src/actions/products/getCategories.ts
'use server';

import { actionClient } from '@/lib/actionClient';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const getCategories = actionClient
  .inputSchema(z.object({ storeId: z.string() }))
  .action(async ({ parsedInput }) => {
    const categories = await prisma.category.findMany({
      where: { storeId: parsedInput.storeId },
      orderBy: { name: 'asc' },
    });
    return { categories };
  });
```

```tsx
// src/components/ProductForm.tsx
'use client';

import { getCategories } from '@/actions/products/getCategories';
import { useAction } from 'next-safe-action/hooks';
import { useState, useEffect } from 'react';
import { Category } from '@/generated/prisma/client';
import { toast } from 'sonner';

export const ProductForm = ({ storeId }: { storeId: string }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const { execute: fetchCategories, isExecuting: loadingCategories } =
    useAction(getCategories, {
      onSuccess: ({ data }) => {
        if (data?.categories) {
          setCategories(data.categories);
        }
      },
      onError: () => {
        toast.error('Failed to load categories');
        setCategories([]);
      },
    });

  useEffect(() => {
    if (storeId) {
      fetchCategories({ storeId });
    }
  }, [storeId, fetchCategories]);

  return (
    <Select disabled={loadingCategories}>
      <SelectTrigger>
        <SelectValue
          placeholder={loadingCategories ? 'Loading...' : 'Select category'}
        />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

### Commands

Store command patterns in `src/commands/` for complex operations that might be called from multiple places.

---

## Validation

### Validation Pattern

The application uses a two-validator pattern for forms that require transformations or server-side validation:

#### 1. Form Validator (`*FormValidator.ts`)

- Client-side validation only
- No server imports (Prisma, etc.)
- Used by the form component

```tsx
// src/validators/admin/pages/storePageFormValidator.ts
import { z } from 'zod';

export const storePageFormValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  publishDate: z.string().min(1, 'Date is required'), // ISO string
});
```

#### 2. Server Validator (`*Validator.ts`)

- Transforms data types (string → number, string → Date, etc.)
- Can include server-only validations (uniqueness checks, database lookups)
- Can import server dependencies
- Used inside server actions
- **Important:** Use user-friendly error messages as these will be displayed to users if validation fails

```tsx
// src/validators/admin/pages/storePageValidator.ts
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const storePageValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.string().transform((val) => parseFloat(val)),
  publishDate: z.string().transform((val) => new Date(val)),
  slug: z.string().refine(
    async (slug) => {
      const exists = await prisma.page.findUnique({ where: { slug } });
      return !exists;
    },
    {
      message:
        'This URL slug is already in use. Please choose a different one.',
    }
  ),
});
```

### Common Validators

Create reusable validators in `src/validators/`:

```tsx
// src/validators/validatePhone.ts
import { z } from 'zod';

export const validatePhone = z
  .string()
  .trim()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 10, 'Please enter a valid phone number');

export const validatePhoneOptional = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((val) => (val ? val.replace(/\D/g, '') : null))
  .refine(
    (val) => (val ? val.length === 10 : true),
    'Please enter a valid phone number'
  );
```

### Formatting Functions

When formatting data (phone numbers, currency, dates, etc.):

1. **Check if it exists** - Always check for existing formatters in `src/lib/` first
2. **Create if reusable** - If the formatter will be used in multiple places, create it in the appropriate `src/lib/` file
3. **Keep local if unique** - If you're certain it's only used in one place, it's fine to keep it localized

---

## User Interface

### Forms

Forms use React Hook Form with the next-safe-action adapter.

#### Input Formatting

Use Maskito for real-time input formatting (phone numbers, credit cards, etc.):

```tsx
import { useMaskito } from '@maskito/react';
import { phoneInputMask } from '@/lib/masks';

// In component
const phoneMask = useMaskito({ options: phoneInputMask });

// In form field
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Phone</FormLabel>
      <FormControl>
        <Input
          {...field}
          ref={(el) => {
            phoneMask(el);
            field.ref(el);
          }}
          placeholder="(555) 555-5555"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

Define masks in `src/lib/masks.ts` for reusability across the application.

#### Form Example

```tsx
'use client';

import { login } from '@/actions/admin/auth/login';
import { loginFormValidator } from '@/validators/admin/auth/loginFormValidator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

export const Login = () => {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    login,
    zodResolver(loginFormValidator),
    {
      formProps: {
        defaultValues: {
          email: '',
          password: '',
        },
      },
      actionProps: {
        onSuccess: () => {
          router.refresh();
        },
      },
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={action.isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
};
```

**Button States:**

- Use `disabled={action.isPending}` for form submit buttons

### Filters

The application includes a comprehensive filtering system that syncs with URL query parameters using `nuqs`.

#### Filter Validator

```tsx
// src/validators/appointmentFilters.ts
import { z } from 'zod';
import { validateIsoDateOptional } from '@/validators/validateIsoDate';

export const appointmentFilters = z.object({
  // Sorting
  sortBy: z
    .enum(['createdAt', 'name', 'status'])
    .default('createdAt')
    .catch('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc').catch('desc'),

  // Pagination
  page: z.coerce
    .number()
    .refine((v) => v > 0)
    .default(1)
    .catch(1),

  // Filters
  search: z.string().optional().catch(''),
  status: z.string().optional().catch(undefined),

  // Timestamp date filters (point-in-time)
  createdAtFrom: validateIsoDateOptional,
  createdAtTo: validateIsoDateOptional,

  // Floating date filters (calendar dates)
  serviceDateFrom: validateIsoDateOptional,
  serviceDateTo: validateIsoDateOptional,
});
```

#### Controller Implementation

```tsx
import { parseSortBy } from '@/lib/sorting';

export const AppointmentsIndexController = async ({ searchParams }) => {
  const params = await searchParams;
  const filters = appointmentFilters.parse(params);

  // Build WHERE conditions as an array for cleaner, more maintainable code
  const whereConditions: Prisma.AppointmentWhereInput[] = [];

  if (filters.search) {
    whereConditions.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ],
    });
  }

  if (filters.status) {
    whereConditions.push({ status: filters.status });
  }

  // Combine conditions
  const where: Prisma.AppointmentWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [appointments, pagination] = await prisma.appointment
    .paginate({
      where,
      orderBy: [
        parseSortBy(filters.sortBy, filters.sortDirection), // Handles nested relations
        { id: 'asc' }, // Secondary sort for consistency
      ],
    })
    .withPages({ page: filters.page });

  return (
    <AppointmentsIndex
      appointments={appointments}
      pagination={pagination}
      filters={filters}
    />
  );
};
```

#### View Implementation

```tsx
'use client';

import { Filters } from '@/components/Filters';

export const AppointmentsIndex = ({
  appointments,
  pagination,
  filters,
  users,
}) => {
  return (
    <>
      <Filters
        options={{
          filters: [
            {
              key: 'user',
              label: 'User',
              type: 'combobox',
              items: users.map((user) => ({
                label: user.name,
                value: user.id,
              })),
            },
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              items: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ],
            },
            {
              key: 'createdAt',
              label: 'Created Date',
              type: 'dateRange',
            },
            {
              key: 'serviceDate',
              label: 'Service Date',
              type: 'dateRange',
              dateType: 'floating',
            },
          ],
          sortOptions: [
            { key: 'createdAt,desc', name: 'Newest First' },
            { key: 'createdAt,asc', name: 'Oldest First' },
          ],
          showSearch: true,
        }}
        values={filters}
      />

      {/* Table content */}
    </>
  );
};
```

**Supported Filter Types:**

- `input` - Text input field
- `select` - Dropdown select
- `combobox` - Searchable dropdown
- `dateRange` - Date range picker (supports `dateType: 'floating' | 'timestamp'`, defaults to 'timestamp')
- `checkbox` - Boolean checkbox

### Table Sorting

Use `SortableColumnToQuery` for sortable table headers. Supports dot notation for relationship fields:

```tsx
import SortableColumnToQuery from '@/components/SortableColumnToQuery';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Index = ({ users, filters }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortableColumnToQuery
              name="firstName"
              label="First Name"
              sortBy={filters.sortBy}
              sortDirection={filters.sortDirection}
            />
          </TableHead>
          <TableHead>
            <SortableColumnToQuery
              name="department.name" // Dot notation for relationships
              label="Department"
              sortBy={filters.sortBy}
              sortDirection={filters.sortDirection}
            />
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
    </Table>
  );
};
```

**Note:** Use `parseSortBy` from `@/lib/sorting` in controllers to handle relationship sorting automatically.

### Pagination

The application uses `prisma-extension-pagination` for database queries and provides UI components for pagination.

#### Controller Usage

```tsx
import { prisma } from '@/lib/prisma';
import { parseSortBy } from '@/lib/sorting';

export const UsersIndexController = async ({ searchParams }) => {
  const params = await searchParams;
  const filters = userFilters.parse(params);

  const [users, pagination] = await prisma.user
    .paginate({
      where: {
        /* filters */
      },
      orderBy: [
        parseSortBy(filters.sortBy, filters.sortDirection),
        { id: 'asc' }, // Secondary sort for consistency
      ],
    })
    .withPages({
      page: filters.page,
      limit: 20,
    });

  // pagination object contains:
  // - isFirstPage, isLastPage, currentPage, previousPage, nextPage
  // - pageCount (total pages), totalCount (total items)

  return <UsersIndex users={users} pagination={pagination} />;
};
```

#### View Implementation

```tsx
'use client';

import PaginationToQuery from '@/components/PaginationToQuery';
import type { PageNumberPaginationMeta } from 'prisma-extension-pagination';

type UsersIndexProps = {
  users: User[];
  pagination: PageNumberPaginationMeta<true>;
};

export const UsersIndex = ({ users, pagination }: UsersIndexProps) => {
  return (
    <div>
      <table>{/* table content */}</table>

      {/* Automatically handles URL updates */}
      <PaginationToQuery pagination={pagination} />
    </div>
  );
};
```

**Best Practices:**

- Always include a secondary sort for deterministic ordering
- Handle empty results appropriately
- Use `PaginationToQuery` for standard list views
- Use base `Pagination` component for custom behavior

---

## Date Handling

### Overview

ALL date inputs in forms use ISO strings as their form state. This provides consistency across the application.

### Floating Dates vs Timestamps

#### Timestamps (Point in Time)

For dates representing specific moments (created dates, log entries):

- Use standard `Date` type in database
- Parse directly with `new Date(field.value)`
- Display with timezone consideration

#### Floating Dates (Calendar Days)

For dates that should remain constant across timezones (birthdays, service dates):

- Use `@db.Date` type in Prisma schema
- Use conversion helpers for parsing/formatting
- Display the same regardless of user timezone

### Implementation

#### 1. Form Validator (Always use strings)

```tsx
// src/validators/eventFormValidator.ts
export const eventFormValidator = z.object({
  startDateTime: z.string().min(1, 'Start date is required'), // Timestamp
  serviceDate: z.string().optional(), // Floating date
});
```

#### 2. Server Validator (Transform to Date)

```tsx
// src/validators/eventValidator.ts
import {
  validateIsoDate,
  validateIsoDateOptional,
} from '@/validators/validateIsoDate';

export const eventValidator = z.object({
  startDateTime: validateIsoDate, // Works for both timestamps and floating dates
  serviceDate: validateIsoDateOptional,
});
```

#### 3. Component Implementation

**For Timestamps:**

```tsx
<FormField
  control={form.control}
  name="startDateTime"
  render={({ field }) => {
    const selectedDate = field.value ? new Date(field.value) : undefined;

    return (
      <Calendar
        selected={selectedDate}
        onSelect={(date) => {
          field.onChange(date ? date.toISOString() : '');
        }}
      />
    );
  }}
/>
```

**For Floating Dates:**

```tsx
import { toFloatingDateString, fromFloatingDateString, formatFloatingDate } from '@/lib/dates';

<FormField
  control={form.control}
  name="serviceDate"
  render={({ field }) => {
    const selectedDate = field.value
      ? fromFloatingDateString(field.value)
      : undefined;

    return (
      <Calendar
        selected={selectedDate}
        onSelect={(date) => {
          field.onChange(date ? toFloatingDateString(date) : '');
        }}
      />
    );
  }}
/>

// Display
<div>Service Date: {formatFloatingDate(order.serviceDate, 'MMM dd, yyyy')}</div>
```

### Helper Functions

Available in `src/lib/dates.ts`:

- `toFloatingDateString(date)` - Convert Date to ISO string preserving local time
- `fromFloatingDate(date)` - Convert Date object treating UTC values as local time
- `fromFloatingDateString(isoString)` - Convert ISO string to Date for local display
- `formatFloatingDate(date, format)` - Format floating date for display
- `toStartOfDayTimestamp(date)` - Convert to start of day for inclusive timestamp ranges
- `toEndOfDayTimestamp(date)` - Convert to end of day for inclusive timestamp ranges
- `normalizeFilterDate(value, dateType)` - Normalize filter date for display in components
- `formatFilterDateDisplay(value, dateType, format)` - Format filter date for display

Validators in `src/validators/validateIsoDate.ts`:

- `validateIsoDate` - Validates and transforms ISO string to Date
- `validateIsoDateOptional` - Optional version

---

## Additional Features

### Authentication

The application includes user authentication with:

- Registration
- Login
- Password reset via email with unique tokens
- Support for multiple user types (admin, regular users)

Use different service classes and cookie names for different auth types.

### Email

#### Sending Email

```tsx
// src/mail/sendTestEmail.tsx
import { mailer } from '@/lib/mailer';
import TestEmail from '@/views/emails/TestEmail';
import { render } from '@react-email/render';

export const sendTestEmail = async (to: string) => {
  const email = await render(<TestEmail />);

  return await mailer.send({
    to,
    subject: 'Test Email',
    html: email,
  });
};
```

#### Email Views

Store email templates in `src/views/emails/` using React Email components.

#### Queueing

Queue emails by default. Create a mail function and a wrapper job:

```tsx
// src/jobs/SendTestEmail.ts
import { Job } from '@/services/jobs/Job';
import { sendTestEmail } from '@/mail/sendTestEmail';

export class SendTestEmail extends Job<{ to: string }> {
  jobName = 'SendTestEmail';

  async process() {
    await sendTestEmail(this.payload.to);
  }
}
```

### Queued Jobs

#### Creating a Job

```tsx
import { Job } from '@/services/jobs/Job';

type Payload = { paymentId: string };

export class SendPaymentFailedEmail extends Job<Payload> {
  jobName = 'SendPaymentFailedEmail';

  constructor(payload: Payload) {
    super(payload);
  }

  async process() {
    // Job logic here
  }
}
```

#### Registering Jobs

Register in `src/services/jobs/JobRegistry.ts`:

```tsx
jobRegistry.register('SendPaymentFailedEmail', SendPaymentFailedEmail);
```

#### Dispatching Jobs

```tsx
import { dispatch, dispatchBatch } from '@/services/jobs/dispatch';

// Single job
await dispatch(new SendTestEmail({ to: 'test@example.com' }));

// Multiple jobs
await dispatchBatch(emails.map((email) => new SendTestEmail({ to: email })));
```

#### Scheduled Jobs

Configure in `RunScheduledJobs`:

```tsx
private getJobs() {
  return [
    {
      job: new ChargeInvoices(),
      cron: '0 6 * * *', // 6 AM daily
    }
  ];
}
```

### File Storage

Use Vercel's blob storage for file uploads. See `src/components/FileUploadField.tsx` for implementation example.

---

## Libraries

- **Luxon** - Date/time manipulation
- **Zod** - Schema validation
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Prisma** - Database ORM
- **Shadcn** - UI components
- **React Email** - Email templates

---

## Pipeline API (CrewAI Integration)

The dashboard receives real-time data from the CrewAI pipeline (`launchbased-app`) via REST API endpoints. The pipeline POSTs lifecycle events as agents work.

### Architecture

```
CrewAI Pipeline (VPS) --POST--> /api/pipeline/* or /api/crm/* (Vercel) --> apiAuth.ts (per-workspace key lookup) --> Prisma/Neon DB
```

### API Endpoints

All endpoints require `Authorization: Bearer <API_KEY>` header. Auth logic is in `src/lib/apiAuth.ts` using a two-strategy approach:

1. **Per-workspace key** (production): Looks up the Bearer token in `SlackInstallation.pipelineApiKey` → resolves to the correct user via `SlackInstallation → UserIntegration → User`
2. **Env var fallback** (local dev / backward compat): Compares against `PIPELINE_API_KEY` env var, resolves to `PIPELINE_USER_ID`

Strategy 1 takes precedence. This enables multi-tenant data isolation — each Slack workspace's API key routes to the correct Command Center user.

| Endpoint | Purpose |
|----------|---------|
| `POST /api/pipeline/runs` | Create/update pipeline runs (research or build phase) |
| `POST /api/pipeline/activity` | Log agent activity events (also auto-creates Agent rows) |
| `POST /api/pipeline/usage` | Log token consumption per agent |
| `POST /api/pipeline/builds` | Log build/deploy results (URL, errors, duration) |
| `POST /api/pipeline/approvals` | Create approval requests for human sign-off |

Route handlers: `src/app/api/pipeline/*/route.ts`
Validators: `src/validators/pipeline/*.ts`
Agent upsert helper: `src/lib/findOrCreateAgent.ts`

### Pipeline-Specific Models

| Model | Purpose |
|-------|---------|
| `PipelineRun` | Tracks a single research or build invocation |
| `ActivityEvent` | Agent activity feed events (replaces mock data on dashboard) |
| `Build` | Deployment results (live URL, error logs, duration) |

### Dashboard Data Flow

Controllers fetch real data from DB and pass as props to views. Views fall back to hardcoded mock data (in `src/lib/data/`) when no real data exists. The dashboard polls via `router.refresh()` every 5 seconds for near-real-time updates.

Token usage aggregation helper: `src/lib/buildTokenUsageSummary.ts`

### Environment Variables

```
PIPELINE_API_KEY=<64-char-hex>   # Fallback API key (local dev only — production uses per-workspace keys)
PIPELINE_USER_ID=<cuid>          # Fallback user ID (local dev only — production resolves from API key)
```

### Multi-Tenancy

Each Slack workspace gets a unique `pipelineApiKey` (64-char hex) auto-generated during OAuth and stored in `SlackInstallation`. This key determines which user owns all data created through the pipeline.

**How it works:**
- Pipeline/CRM API calls include `Authorization: Bearer <workspace-key>`
- `apiAuth.ts` looks up the key in `SlackInstallation.pipelineApiKey` (unique index)
- Resolves to the correct user via `SlackInstallation → UserIntegration → User`
- All Prisma queries scope data to `where: { userId: user.id }` — isolation is automatic

**Key management:**
- Keys are visible on the Integrations page (reveal/copy/regenerate)
- Re-authorizing a workspace preserves the existing key
- Regenerating a key immediately invalidates the old one

**OpenClaw setup per workspace:**
- One OpenClaw agent per client workspace
- Binding: `{ match: { channel: "slack", teamId: "T_CLIENT_X" }, agentId: "client-x" }`
- Per-agent env: `DASHBOARD_API_KEY=<workspace-specific-key>`

### CRM Endpoints

The business agents (Support, Sales, Marketing, Customer Success) read and write CRM data via these endpoints. Same auth as pipeline endpoints.

| Endpoint | Purpose |
|----------|---------|
| `GET/POST /api/crm/customers` | Customer search + creation |
| `GET/POST /api/crm/tickets` | Support ticket search/filter + creation |
| `PATCH /api/crm/tickets/[id]` | Update ticket status/priority |
| `GET/POST /api/crm/leads` | Sales lead search/filter + creation |
| `PATCH /api/crm/leads/[id]` | Update lead stage/value |
| `GET/POST /api/crm/campaigns` | Campaign search/filter + creation |
| `PATCH /api/crm/campaigns/[id]` | Update campaign status |

Route handlers: `src/app/api/crm/*/route.ts`
Validators: `src/validators/crm/*.ts`

### Admin Endpoints

Used by the `onboard` CLI to fetch workspace details during client setup.

| Endpoint | Purpose |
|----------|---------|
| `GET /api/admin/workspaces` | List all Slack workspaces for the authenticated user |
| `GET /api/admin/workspace/{teamId}` | Get full workspace details (teamId, teamName, pipelineApiKey, encrypted botToken) |

Route handlers: `src/app/api/admin/*/route.ts`

### Important: No root `app/` directory

**Never create an `app/` directory at the project root.** Next.js 16 will use it as the App Router directory instead of `src/app/`, causing all routes to 404. All app routes must live in `src/app/`.

---

## Deployment

- **Platform**: Vercel (auto-deploys from `haseebuchiha/launchbased-command-center` GitHub repo)
- **Database**: Neon PostgreSQL
- **Build command**: `prisma generate && prisma migrate deploy && next build`
- **Migrations run automatically** on every Vercel deploy
- **Two git remotes**:
  - `origin`: `git@github.com:LaunchBased-Now/launchbased-command-center.git`
  - `vercel`: `git@github.com:haseebuchiha/launchbased-command-center.git` (connected to Vercel)
- **Push to both** when deploying: `git push origin main && git push vercel main`
- **Production URL**: https://command-center-initial.vercel.app

---

Remember to think through your implementation carefully before writing any code. Consider the trade-offs between different approaches and choose the one that best aligns with the project's principles and conventions.
