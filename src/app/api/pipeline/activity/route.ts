import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { activityEventValidator } from '@/validators/pipeline/activityEventValidator';
import { findOrCreateAgent } from '@/lib/findOrCreateAgent';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = activityEventValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    await findOrCreateAgent({
      name: data.agentName,
      emoji: data.agentEmoji,
      userId: user.id,
      status: 'working',
      task: data.label,
    });

    const result = await prisma.activityEvent.create({
      data: {
        agentName: data.agentName,
        agentEmoji: data.agentEmoji,
        action: data.action,
        label: data.label,
        detail: data.detail,
        color: data.color,
        pipelineRunId: data.pipelineRunId,
        userId: user.id,
      },
    });

    revalidatePath('/dashboard');
    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Pipeline activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
