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
  const expectedKey = process.env.PIPELINE_API_KEY;
  if (!expectedKey) {
    return {
      error: NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      ),
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

  const userId = process.env.PIPELINE_USER_ID;
  if (!userId) {
    return {
      error: NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 }
      ),
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
