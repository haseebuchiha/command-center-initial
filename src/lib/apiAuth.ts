import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { User } from '@/generated/prisma/client';
import { timingSafeEqual } from 'crypto';

type AuthResult = { user: User } | { error: NextResponse };

export async function authenticateApiRequest(
  request: Request
): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.slice(7);

  // Strategy 1: Per-workspace API key lookup in database
  const installation = await prisma.slackInstallation.findUnique({
    where: { pipelineApiKey: token },
    include: {
      userIntegration: {
        include: { user: true },
      },
    },
  });

  if (installation?.userIntegration?.user) {
    return { user: installation.userIntegration.user };
  }

  // Strategy 2: Fallback to env var (backward compat / local dev)
  const expectedKey = process.env.PIPELINE_API_KEY;
  const userId = process.env.PIPELINE_USER_ID;

  if (!expectedKey || !userId) {
    return {
      error: NextResponse.json({ error: 'Invalid API key' }, { status: 401 }),
    };
  }

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedKey);
  if (
    tokenBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(tokenBuffer, expectedBuffer)
  ) {
    return {
      error: NextResponse.json({ error: 'Invalid API key' }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return {
      error: NextResponse.json({ error: 'User not found' }, { status: 401 }),
    };
  }

  return { user };
}
