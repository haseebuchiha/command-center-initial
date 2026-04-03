import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { ticketCreateValidator } from '@/validators/crm/ticketCreateValidator';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { userId: user.id };

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('CRM tickets GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = ticketCreateValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const result = await prisma.supportTicket.create({
      data: {
        customerId: data.customerId,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        createdBy: data.createdBy,
        userId: user.id,
      },
    });

    revalidatePath('/tickets');
    return NextResponse.json({ id: result.id, subject: result.subject, status: result.status });
  } catch (error) {
    console.error('CRM tickets POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
