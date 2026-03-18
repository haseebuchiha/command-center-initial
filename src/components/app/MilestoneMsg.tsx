export const MilestoneMsg = ({
  text,
  tip,
}: {
  text: string;
  tip?: string;
}) => (
  <div className="mb-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3.5">
    <div className="text-sm font-semibold text-success">{text}</div>
    {tip && (
      <div className="mt-1 text-[13px] text-muted-foreground">{tip}</div>
    )}
  </div>
);
