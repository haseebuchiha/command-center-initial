'use client';

const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899'];

function generatePieces() {
  return Array.from({ length: 60 }).map(() => ({
    left: Math.random() * 100,
    width: 8 + Math.random() * 8,
    height: 8 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
    duration: 2 + Math.random() * 3,
    delay: Math.random(),
  }));
}

const pieces = generatePieces();

export const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute -top-5"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            borderRadius: p.borderRadius,
            animation: `confetti-fall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};
