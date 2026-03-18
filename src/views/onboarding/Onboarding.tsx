'use client';

import { useAction } from 'next-safe-action/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import { VideoTip } from '@/components/app/VideoTip';
import { MilestoneMsg } from '@/components/app/MilestoneMsg';
import { useCommandCenterStore } from '@/lib/stores/command-center-store';
import { completeStepAction } from '@/actions/onboarding/completeStepAction';
import { useRouter } from 'next/navigation';
import type { OnboardStep } from '@/generated/prisma/client';

export const Onboarding = ({
  steps,
  userName,
}: {
  steps: OnboardStep[];
  userName: string;
}) => {
  const router = useRouter();
  const triggerConfetti = useCommandCenterStore((s) => s.triggerConfetti);
  const completedSteps = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const { execute, isPending } = useAction(completeStepAction, {
    onSuccess: () => {
      if (completedSteps + 1 === totalSteps) {
        triggerConfetti();
      }
    },
  });

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="mb-8">
        <h1 className="mb-2 text-[28px] font-extrabold">
          Welcome aboard, {userName || 'there'}!
        </h1>
        <p className="text-base text-muted-foreground">
          Let&apos;s get your business set up. Follow these steps and
          you&apos;ll be ready to go in minutes.
        </p>
        <div className="mt-2">
          <VideoTip title="Quick setup walkthrough" duration="60 sec" />
        </div>
      </div>

      {completedSteps >= 3 && completedSteps < totalSteps && (
        <MilestoneMsg
          text="You're making great progress! More than halfway there."
          tip="Most people finish in about 5 minutes. You're doing awesome!"
        />
      )}
      {completedSteps >= 5 && completedSteps < totalSteps && (
        <MilestoneMsg
          text="Almost done! Just a couple more steps."
          tip="Your AI team is warming up and ready to start working for you."
        />
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-base font-bold">Setup Progress</span>
            <span
              className={`text-2xl font-extrabold ${
                progress === 100 ? 'text-success' : 'text-primary'
              }`}
            >
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="mt-2 text-[13px] text-muted-foreground">
            {completedSteps} of {totalSteps} steps complete
          </p>
        </CardContent>
      </Card>

      {steps.map((step, i) => {
        const firstIncompleteIndex = steps.findIndex((s) => !s.done);
        const isNextStep = i === firstIncompleteIndex;
        return (
          <Card
            key={step.id}
            className={`mb-3 ${step.done ? 'opacity-70' : ''}`}
          >
            <CardContent className="flex items-center gap-4 px-5 py-4">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${
                  step.done
                    ? 'bg-success'
                    : isNextStep
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                }`}
              >
                {step.done ? '\u2713' : step.sortOrder}
              </div>
              <div className="flex-1">
                <span
                  className={`text-[15px] font-semibold ${
                    step.done ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!step.done && (
                <div className="flex gap-2">
                  {step.skippable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => execute({ stepId: step.id })}
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={() => execute({ stepId: step.id })}
                  >
                    {isNextStep ? 'Do This Now' : 'Complete'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {progress === 100 && (
        <Card className="mt-6 border-2 border-success">
          <CardContent className="p-8 text-center">
            <div className="mb-3 text-5xl">{'🎉'}</div>
            <h2 className="mb-2 text-2xl font-extrabold text-success">
              You&apos;re All Set!
            </h2>
            <p className="mb-5 text-muted-foreground">
              Your AI team is ready to work. Head to the Command Center to see
              what they&apos;re doing!
            </p>
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              Go to Command Center <ChevronRight className="ml-1 size-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
