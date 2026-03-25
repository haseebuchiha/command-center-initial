import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';
import { approvalRequestValidator } from '@/validators/pipeline/approvalRequestValidator';
import { findOrCreateAgent } from '@/lib/findOrCreateAgent';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const parsed = approvalRequestValidator.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const agent = await findOrCreateAgent({
      name: data.agentName,
      emoji: '\u{1F916}',
      userId: user.id,
    });

    const result = await prisma.approval.create({
      data: {
        agentId: agent.id,
        type: data.type,
        title: data.title,
        preview: data.preview,
        status: 'pending',
        pipelineRunId: data.pipelineRunId,
        userId: user.id,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/approvals');
    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error('Pipeline approvals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
