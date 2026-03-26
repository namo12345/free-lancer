"use client";

interface BarChartProps {
  data: { label: string; value: number }[];
  maxValue?: number;
  color?: string;
  height?: number;
}

export function BarChart({ data, maxValue, color = "bg-brand-500", height = 200 }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, idx) => {
          const barHeight = max > 0 ? (item.value / max) * 100 : 0;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{item.value.toLocaleString()}</span>
              <div className="w-full relative" style={{ height: `${barHeight}%`, minHeight: 4 }}>
                <div className={`absolute inset-0 ${color} rounded-t-md transition-all duration-500`} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center text-xs text-muted-foreground truncate">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
