import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserAuth } from '@/services/UserAuth';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { baseUrl } from '@/lib/url';

type SlackOAuthResponse = {
  ok: boolean;
  error?: string;
  access_token: string;
  token_type: string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: { id: string; name: string };
  authed_user: { id: string };
  enterprise: { id: string; name: string } | null;
  is_enterprise_install: boolean;
};

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const user = await UserAuth.getUser();
    if (!user) {
      return NextResponse.redirect(baseUrl('/login'));
    }

    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
      cookieStore.delete('slack_oauth_state');
      return NextResponse.redirect(
        baseUrl('/integrations?oauth=error&reason=denied')
      );
    }

    if (!code || !state) {
      cookieStore.delete('slack_oauth_state');
      return NextResponse.redirect(
        baseUrl('/integrations?oauth=error&reason=missing_params')
      );
    }

    const storedState = cookieStore.get('slack_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      cookieStore.delete('slack_oauth_state');
      return NextResponse.redirect(
        baseUrl('/integrations?oauth=error&reason=invalid_state')
      );
    }

    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.SLACK_REDIRECT_URI!,
      }),
    });

    const tokenData: SlackOAuthResponse = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error('Slack token exchange failed:', tokenData.error);
      cookieStore.delete('slack_oauth_state');
      return NextResponse.redirect(
        baseUrl('/integrations?oauth=error&reason=token_exchange_failed')
      );
    }

    const integration = await prisma.integration.findUnique({
      where: { slug: 'slack' },
    });

    if (!integration) {
      throw new Error('Slack integration not found in database');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(async (tx: any) => {
      const userIntegration = await tx.userIntegration.upsert({
        where: {
          userId_integrationId: {
            userId: user.id,
            integrationId: integration.id,
          },
        },
        create: {
          userId: user.id,
          integrationId: integration.id,
        },
        update: {},
      });

      await tx.slackInstallation.upsert({
        where: { userIntegrationId: userIntegration.id },
        create: {
          userIntegrationId: userIntegration.id,
          botToken: encrypt(tokenData.access_token),
          botUserId: tokenData.bot_user_id,
          teamId: tokenData.team.id,
          teamName: tokenData.team.name,
          appId: tokenData.app_id,
          installerUserId: tokenData.authed_user.id,
          scopes: tokenData.scope,
          tokenType: tokenData.token_type,
          isEnterprise: tokenData.is_enterprise_install,
          enterpriseId: tokenData.enterprise?.id ?? null,
          enterpriseName: tokenData.enterprise?.name ?? null,
        },
        update: {
          botToken: encrypt(tokenData.access_token),
          botUserId: tokenData.bot_user_id,
          teamId: tokenData.team.id,
          teamName: tokenData.team.name,
          appId: tokenData.app_id,
          installerUserId: tokenData.authed_user.id,
          scopes: tokenData.scope,
          tokenType: tokenData.token_type,
          isEnterprise: tokenData.is_enterprise_install,
          enterpriseId: tokenData.enterprise?.id ?? null,
          enterpriseName: tokenData.enterprise?.name ?? null,
        },
      });
    });

    cookieStore.delete('slack_oauth_state');
    return NextResponse.redirect(baseUrl('/integrations?oauth=success'));
  } catch (err) {
    console.error('Slack OAuth callback error:', err);
    cookieStore.delete('slack_oauth_state');
    return NextResponse.redirect(
      baseUrl('/integrations?oauth=error&reason=server_error')
    );
  }
}
