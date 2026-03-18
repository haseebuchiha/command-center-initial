import { Button } from '@/components/ui/button';

export const FriendlyError = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="py-10 text-center">
    <div className="mb-4 text-5xl">😅</div>
    <h2 className="mb-2 text-[22px] font-extrabold">
      Oops! Something went wrong
    </h2>
    <p className="mx-auto mb-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
      Don&apos;t worry — your data is safe. This is just a small hiccup. Try
      tapping the button below, or chat with our helper bot in the bottom
      corner.
    </p>
    {onRetry && <Button onClick={onRetry}>Try Again</Button>}
  </div>
);
