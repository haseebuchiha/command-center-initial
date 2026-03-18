'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { TourStep } from '@/types/command-center';

export const GuidedTour = ({
  steps,
  onClose,
}: {
  steps: TourStep[];
  onClose: () => void;
}) => {
  const [step, setStep] = useState(0);

  if (!steps || steps.length === 0) return null;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9998]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[90%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-primary bg-card p-7 shadow-xl shadow-primary/20">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-bold text-primary">
            Step {step + 1} of {steps.length}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mb-3 text-[32px]">{current.emoji}</div>
        <h3 className="mb-2 text-xl font-extrabold">{current.title}</h3>
        <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
          {current.body}
        </p>
        <Progress value={((step + 1) / steps.length) * 100} className="h-1" />
        <div className="mt-4 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
          >
            {step > 0 ? 'Back' : 'Skip Tour'}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              step < steps.length - 1 ? setStep(step + 1) : onClose()
            }
          >
            {step < steps.length - 1 ? 'Next' : 'Got it!'}
          </Button>
        </div>
      </div>
    </div>
  );
};
