import { UserAuth } from '@/services/UserAuth';
import { prisma } from '@/lib/prisma';
import { Onboarding } from '@/views/onboarding/Onboarding';

export const OnboardingController = async () => {
  const user = await UserAuth.getUser();
  if (!user) return null;

  // Create default steps if none exist
  const existingSteps = await prisma.onboardStep.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: 'asc' },
  });

  if (existingSteps.length === 0) {
    const defaultSteps = [
      {
        label: 'Confirm your email (magic link sent!)',
        sortOrder: 1,
        done: true,
        skippable: false,
      },
      {
        label: 'Your website is being built...',
        sortOrder: 2,
        done: true,
        skippable: false,
      },
      {
        label: 'Meet your AI team',
        sortOrder: 3,
        done: false,
        skippable: false,
      },
      {
        label: 'Connect a chat app (Discord, Slack, or Telegram)',
        sortOrder: 4,
        done: false,
        skippable: false,
      },
      {
        label: 'Connect your first business tool',
        sortOrder: 5,
        done: false,
        skippable: true,
      },
      {
        label: 'Join the LaunchBased community',
        sortOrder: 6,
        done: false,
        skippable: true,
      },
      {
        label: 'Get your first win — approve your first piece of content!',
        sortOrder: 7,
        done: false,
        skippable: true,
      },
    ];

    for (const step of defaultSteps) {
      await prisma.onboardStep.create({
        data: { ...step, userId: user.id },
      });
    }

    const steps = await prisma.onboardStep.findMany({
      where: { userId: user.id },
      orderBy: { sortOrder: 'asc' },
    });
    return <Onboarding steps={steps} userName={user.name} />;
  }

  return <Onboarding steps={existingSteps} userName={user.name} />;
};
