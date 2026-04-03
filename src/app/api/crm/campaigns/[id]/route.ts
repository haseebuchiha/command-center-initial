import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { campaignUpdateValidator } from '@/validators/crm/campaignUpdateValidator';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { id } = await params;

    const body = await request.json();
    const parsed = campaignUpdateValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Verify ownership before updating
    const existing = await prisma.campaign.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const result = await prisma.campaign.update({
      where: { id },
      data,
    });

    revalidatePath('/campaigns');
    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('CRM campaign PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
