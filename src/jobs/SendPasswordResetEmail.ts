import { Job } from '@/services/jobs/Job';
import { sendPasswordResetEmail } from '@/mail/sendPasswordResetEmail';
import { prisma } from '@/lib/prisma';
import { baseUrl } from '@/lib/url';
import { route } from '@/lib/route';

type Payload = {
  passwordResetId: string;
};

export class SendPasswordResetEmail extends Job<Payload> {
  jobName = 'SendPasswordResetEmail';

  constructor(payload: Payload) {
    super(payload);
  }

  async process() {
    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        id: this.payload.passwordResetId,
      },
      include: {
        user: true,
      },
    });

    if (!passwordReset || !passwordReset.user) {
      return;
    }

    const resetUrl = baseUrl(route('password.reset', passwordReset.token));

    await sendPasswordResetEmail({
      to: passwordReset.user.email,
      name: passwordReset.user.name,
      resetUrl,
    });
  }
}
