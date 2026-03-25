import { prisma } from '@/lib/prisma';

export async function findOrCreateAgent({
  name,
  emoji,
  userId,
  role,
  status,
  task,
}: {
  name: string;
  emoji: string;
  userId: string;
  role?: string;
  status?: string;
  task?: string;
}) {
  return prisma.agent.upsert({
    where: { userId_name: { userId, name } },
    create: {
      name,
      emoji,
      role: role || name,
      status: status || 'idle',
      task: task || null,
      progress: 0,
      userId,
    },
    update: {
      emoji,
      ...(status && { status }),
      ...(task !== undefined && { task }),
    },
  });
}
