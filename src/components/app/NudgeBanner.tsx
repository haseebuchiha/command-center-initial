import { Button } from '@/components/ui/button';

export const NudgeBanner = ({
  text,
  emoji,
  actionLabel,
  onAction,
  onDismiss,
}: {
  text: string;
  emoji?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}) => (
  <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/5 px-4 py-3">
    <span className="text-[22px]">{emoji || '💡'}</span>
    <div className="min-w-[200px] flex-1">
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
    <div className="flex gap-2">
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  </div>
);
