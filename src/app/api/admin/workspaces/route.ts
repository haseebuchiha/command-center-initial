import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiRequest } from '@/lib/apiAuth';

export async function GET(request: Request) {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  try {
    const integrations = await prisma.userIntegration.findMany({
      where: { userId: user.id },
      include: {
        slackInstallation: {
          select: {
            teamId: true,
            teamName: true,
            pipelineApiKey: true,
            createdAt: true,
          },
        },
      },
    });

    const workspaces = integrations
      .filter((ui) => ui.slackInstallation)
      .map((ui) => ({
        teamId: ui.slackInstallation!.teamId,
        teamName: ui.slackInstallation!.teamName,
        pipelineApiKey: ui.slackInstallation!.pipelineApiKey,
        createdAt: ui.slackInstallation!.createdAt,
      }));

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error('Admin workspaces GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
