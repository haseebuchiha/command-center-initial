import { Play } from 'lucide-react';

export const VideoTip = ({
  title,
  duration,
  onPlay,
}: {
  title: string;
  duration: string;
  onPlay?: () => void;
}) => (
  <button
    onClick={onPlay}
    className="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-1.5 transition-colors hover:bg-accent/20"
  >
    <div className="flex size-6 items-center justify-center rounded-full bg-accent">
      <Play className="size-2.5 fill-white text-white" />
    </div>
    <span className="text-xs font-semibold text-accent">{title}</span>
    <span className="text-[11px] text-muted-foreground">{duration}</span>
  </button>
);
