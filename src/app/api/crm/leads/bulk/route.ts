import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { leadCreateValidator } from '@/validators/crm/leadCreateValidator';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const bulkLeadValidator = z.object({
  leads: z.array(leadCreateValidator).min(1).max(500),
});

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = bulkLeadValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const records = parsed.data.leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      serviceType: lead.serviceType,
      source: lead.source,
      stage: lead.stage,
      estimatedValue: lead.estimatedValue,
      followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : undefined,
      followUpNotes: lead.followUpNotes,
      notes: lead.notes,
      customerId: lead.customerId,
      createdBy: lead.createdBy ?? 'agent',
      userId: user.id,
    }));

    const result = await prisma.lead.createMany({ data: records });

    revalidatePath('/leads');
    return NextResponse.json({
      created: result.count,
      total: records.length,
    });
  } catch (error) {
    console.error('CRM leads bulk POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
