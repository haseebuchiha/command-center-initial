import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const { teamId } = await params;

    const installation = await prisma.slackInstallation.findFirst({
      where: {
        teamId,
        userIntegration: { userId: user.id },
      },
      include: {
        userIntegration: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!installation) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      teamId: installation.teamId,
      teamName: installation.teamName,
      pipelineApiKey: installation.pipelineApiKey,
      botToken: installation.botToken,
      botUserId: installation.botUserId,
      appId: installation.appId,
      scopes: installation.scopes,
      tokenType: installation.tokenType,
      isEnterprise: installation.isEnterprise,
      userId: installation.userIntegration.user.id,
      userName: installation.userIntegration.user.name,
    });
  } catch (error) {
    console.error('Admin workspace GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
