import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { campaignCreateValidator } from '@/validators/crm/campaignCreateValidator';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const bulkCampaignValidator = z.object({
  campaigns: z.array(campaignCreateValidator).min(1).max(500),
});

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = bulkCampaignValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const records = parsed.data.campaigns.map((c) => ({
      name: c.name,
      description: c.description,
      type: c.type,
      channels: c.channels,
      messaging: c.messaging,
      targetArea: c.targetArea,
      startDate: c.startDate ? new Date(c.startDate) : undefined,
      endDate: c.endDate ? new Date(c.endDate) : undefined,
      createdBy: c.createdBy ?? 'agent',
      userId: user.id,
    }));

    const result = await prisma.campaign.createMany({ data: records });

    revalidatePath('/campaigns');
    return NextResponse.json({
      created: result.count,
      total: records.length,
    });
  } catch (error) {
    console.error('CRM campaigns bulk POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
