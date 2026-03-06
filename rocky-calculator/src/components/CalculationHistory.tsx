'use client';

import { ICalculation } from '@/entities/Calculation';

interface CalculationHistoryProps {
  history: ICalculation[];
  onClear: () => void;
  onToast: (message: string) => void;
}

export default function CalculationHistory({
  history,
  onClear,
  onToast,
}: CalculationHistoryProps) {
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  const handleShare = async (item: ICalculation) => {
    const text = `${item.expression} = ${item.result}`;
    try {
      await navigator.clipboard.writeText(text);
      onToast('📋 Copied to clipboard!');
    } catch {
      onToast('📋 ' + text);
    }
  };

  return (
    <>
      <div className="history-header">
        <div className="history-title">
          📊 History
          {history.length > 0 && (
            <span className="history-badge">{history.length}</span>
          )}
        </div>
        {history.length > 0 && (
          <button className="history-clear-btn" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">🔢</div>
            <div>No calculations yet</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              Start calculating to see your history here
            </div>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => handleShare(item)}
              title="Click to copy"
            >
              <div className="history-expression">{item.expression}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="history-result">= {item.result}</div>
                <button
                  className="share-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item);
                  }}
                >
                  Share
                </button>
              </div>
              <div className="history-time">{formatTime(item.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
