export function Sparkline({ tone }: { tone: string }) {
  return (
    <div className={`sparkline spark-${tone}`} aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => (
        <i key={index} />
      ))}
    </div>
  );
}
