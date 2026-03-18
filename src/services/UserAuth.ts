import { User } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export class UserAuth {
  private static readonly COOKIE_NAME = 'userSession';
  private static readonly COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

  private static in30Days() {
    return new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
  }

  private static async storeCookie(sessionId: string) {
    (await cookies()).set(this.COOKIE_NAME, sessionId, {
      path: '/',
      sameSite: 'lax',
      maxAge: this.COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private static async getSession() {
    const sessionId = (await cookies()).get(this.COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { user: true },
    });

    if (!session || !session.user) {
      return null;
    }

    return session;
  }

  public static async login(user: User) {
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: this.in30Days(),
      },
    });

    await this.storeCookie(session.id);
  }

  public static async logout() {
    const sessionId = (await cookies()).get(this.COOKIE_NAME)?.value;

    if (sessionId) {
      await prisma.session.delete({
        where: { id: sessionId },
      });
    }

    (await cookies()).delete(this.COOKIE_NAME);
  }

  public static async getUser() {
    const session = await this.getSession();
    return session?.user ?? null;
  }

  public static async check() {
    return !!(await this.getUser());
  }

  public static async checkOrRedirect() {
    if (!(await this.getUser())) {
      redirect('/login');
    }
  }

  public static async invalidateSessions(userId: string) {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }
}
