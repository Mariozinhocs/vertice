import React from 'react';

interface SegmentedDonutChartProps {
  total: number;
  completed: number;
  size?: number;
  strokeWidth?: number;
}

export const SegmentedDonutChart: React.FC<SegmentedDonutChartProps> = ({
  total = 5,
  completed = 0,
  size = 46,
  strokeWidth = 6,
}) => {
  const safeTotal = Math.max(1, total);
  const safeCompleted = Math.min(safeTotal, Math.max(0, completed));
  const percentage = Math.round((safeCompleted / safeTotal) * 100);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const segmentAngle = 360 / safeTotal;
  const gapDegrees = safeTotal > 1 ? 4 : 0;
  const drawAngle = segmentAngle - gapDegrees;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0 cursor-help"
      style={{ width: size, height: size }}
      title={`${safeCompleted} de ${safeTotal} fotos obtidas (${percentage}%)`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: safeTotal }).map((_, i) => {
          const startAngle = i * segmentAngle + gapDegrees / 2;
          const endAngle = startAngle + drawAngle;
          const isDone = i < safeCompleted;
          const d = describeArc(center, center, radius, startAngle, endAngle);

          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={isDone ? '#10b981' : '#334155'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] font-extrabold text-slate-100 tracking-tighter">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
