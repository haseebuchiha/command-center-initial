import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserAuth } from '@/services/UserAuth';
import { PipelineHistory } from '@/views/pipeline/PipelineHistory';

const PipelineController = async () => {
  const user = await UserAuth.getUser();
  if (!user) redirect('/login');

  const runs = await prisma.pipelineRun.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: 'desc' },
    take: 50,
  });

  const runIds = runs.map((r) => r.id);

  const activities = await prisma.activityEvent.findMany({
    where: { pipelineRunId: { in: runIds } },
    orderBy: { createdAt: 'asc' },
  });

  const builds = await prisma.build.findMany({
    where: { pipelineRunId: { in: runIds } },
  });

  // Group activities by pipelineRunId
  const activitiesByRun: Record<string, typeof activities> = {};
  for (const a of activities) {
    if (a.pipelineRunId) {
      if (!activitiesByRun[a.pipelineRunId]) {
        activitiesByRun[a.pipelineRunId] = [];
      }
      activitiesByRun[a.pipelineRunId].push(a);
    }
  }

  // Index builds by pipelineRunId
  const buildsByRun: Record<string, (typeof builds)[number]> = {};
  for (const b of builds) {
    buildsByRun[b.pipelineRunId] = b;
  }

  return (
    <PipelineHistory
      runs={JSON.parse(JSON.stringify(runs))}
      activitiesByRun={JSON.parse(JSON.stringify(activitiesByRun))}
      buildsByRun={JSON.parse(JSON.stringify(buildsByRun))}
    />
  );
};

export default PipelineController;
