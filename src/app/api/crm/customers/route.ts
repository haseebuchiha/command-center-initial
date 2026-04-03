import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { customerCreateValidator } from '@/validators/crm/customerCreateValidator';

export async function GET(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { userId: user.id };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: { tickets: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('CRM customers GET error:', error);
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
    const parsed = customerCreateValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const result = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        userId: user.id,
      },
    });

    return NextResponse.json({ id: result.id, name: result.name });
  } catch (error) {
    console.error('CRM customers POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
