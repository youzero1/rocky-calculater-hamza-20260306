'use client';

interface CalculatorButtonProps {
  label: string;
  type: 'number' | 'operator' | 'equals' | 'clear' | 'backspace' | 'decimal';
  onClick: () => void;
  span?: number;
}

export default function CalculatorButton({
  label,
  type,
  onClick,
  span,
}: CalculatorButtonProps) {
  const classMap: Record<string, string> = {
    number: 'calc-btn btn-number',
    operator: 'calc-btn btn-operator',
    equals: 'calc-btn btn-equals',
    clear: 'calc-btn btn-clear',
    backspace: 'calc-btn btn-backspace',
    decimal: 'calc-btn btn-decimal',
  };

  const style: React.CSSProperties = {};
  if (span && span > 1) {
    style.gridColumn = `span ${span}`;
    style.aspectRatio = 'auto';
    style.paddingTop = '1rem';
    style.paddingBottom = '1rem';
  }

  return (
    <button
      className={classMap[type] || 'calc-btn btn-number'}
      onClick={onClick}
      style={style}
      aria-label={label}
    >
      {label}
    </button>
  );
}
