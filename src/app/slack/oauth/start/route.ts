import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { UserAuth } from '@/services/UserAuth';
import { baseUrl } from '@/lib/url';

const SLACK_SCOPES = [
  'app_mentions:read',
  'chat:write',
  'channels:history',
  'channels:read',
  'groups:history',
  'im:history',
  'im:read',
  'im:write',
  'mpim:history',
  'mpim:read',
  'mpim:write',
  'users:read',
].join(',');

export async function GET() {
  const user = await UserAuth.getUser();
  if (!user) {
    return NextResponse.redirect(baseUrl('/login'));
  }

  const state = randomBytes(32).toString('hex');

  const cookieStore = await cookies();
  cookieStore.set('slack_oauth_state', state, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: SLACK_SCOPES,
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
    state,
  });

  return NextResponse.redirect(
    `https://slack.com/oauth/v2/authorize?${params.toString()}`
  );
}
