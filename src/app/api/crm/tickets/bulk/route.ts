import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const bulkTicketItemValidator = z.object({
  customerName: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  createdBy: z.enum(['manual', 'agent']).default('agent'),
});

const bulkTicketValidator = z.object({
  tickets: z.array(bulkTicketItemValidator).min(1).max(500),
});

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = bulkTicketValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const items = parsed.data.tickets;
    let created = 0;
    const errors: string[] = [];

    const customerCache = new Map<string, string>();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const nameLower = item.customerName.toLowerCase();

      try {
        let customerId = customerCache.get(nameLower);

        if (!customerId) {
          const existing = await prisma.customer.findFirst({
            where: {
              userId: user.id,
              name: { equals: item.customerName, mode: 'insensitive' },
            },
            select: { id: true },
          });

          if (existing) {
            customerId = existing.id;
          } else {
            const newCustomer = await prisma.customer.create({
              data: { name: item.customerName, userId: user.id },
            });
            customerId = newCustomer.id;
          }
          customerCache.set(nameLower, customerId);
        }

        await prisma.supportTicket.create({
          data: {
            customerId,
            subject: item.subject,
            description: item.description,
            priority: item.priority,
            createdBy: item.createdBy,
            userId: user.id,
          },
        });
        created++;
      } catch (err) {
        errors.push(`Row ${i + 1} (${item.customerName}): ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    revalidatePath('/tickets');
    return NextResponse.json({
      created,
      failed: items.length - created,
      total: items.length,
      ...(errors.length > 0 && { errors: errors.slice(0, 10) }),
    });
  } catch (error) {
    console.error('CRM tickets bulk POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
