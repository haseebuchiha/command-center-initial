import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { leadCreateValidator } from '@/validators/crm/leadCreateValidator';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const name = searchParams.get('name');
    const stage = searchParams.get('stage');
    const source = searchParams.get('source');
    const serviceType = searchParams.get('serviceType');

    const where: Record<string, unknown> = { userId: user.id };

    if (stage) {
      where.stage = stage;
    }

    if (source) {
      where.source = source;
    }

    if (serviceType) {
      where.serviceType = { contains: serviceType, mode: 'insensitive' };
    }

    if (name) {
      where.name = { equals: name, mode: 'insensitive' };
    } else if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { serviceType: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('CRM leads GET error:', error);
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
    const parsed = leadCreateValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const result = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        serviceType: data.serviceType,
        source: data.source,
        stage: data.stage,
        estimatedValue: data.estimatedValue,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : undefined,
        followUpNotes: data.followUpNotes,
        notes: data.notes,
        customerId: data.customerId,
        createdBy: data.createdBy,
        userId: user.id,
      },
    });

    revalidatePath('/leads');
    return NextResponse.json({ id: result.id, name: result.name, stage: result.stage });
  } catch (error) {
    console.error('CRM leads POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
