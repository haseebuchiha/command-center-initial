import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { customerCreateValidator } from '@/validators/crm/customerCreateValidator';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const bulkCustomerValidator = z.object({
  customers: z.array(customerCreateValidator).min(1).max(500),
});

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = bulkCustomerValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const records = parsed.data.customers.map((c) => ({
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      notes: c.notes,
      userId: user.id,
    }));

    const result = await prisma.customer.createMany({ data: records });

    revalidatePath('/customers');
    return NextResponse.json({
      created: result.count,
      total: records.length,
    });
  } catch (error) {
    console.error('CRM customers bulk POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
