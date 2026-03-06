'use client';

import { useState, useCallback, useEffect } from 'react';
import Display from './Display';
import CalculatorButton from './CalculatorButton';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
  onToast: (message: string) => void;
}

type ButtonConfig = {
  label: string;
  type: 'number' | 'operator' | 'equals' | 'clear' | 'backspace' | 'decimal';
  action: string;
  span?: number;
};

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', type: 'clear', action: 'clear' },
  { label: '⌫', type: 'backspace', action: 'backspace' },
  { label: '%', type: 'operator', action: '%' },
  { label: '÷', type: 'operator', action: '/' },

  { label: '7', type: 'number', action: '7' },
  { label: '8', type: 'number', action: '8' },
  { label: '9', type: 'number', action: '9' },
  { label: '×', type: 'operator', action: '*' },

  { label: '4', type: 'number', action: '4' },
  { label: '5', type: 'number', action: '5' },
  { label: '6', type: 'number', action: '6' },
  { label: '−', type: 'operator', action: '-' },

  { label: '1', type: 'number', action: '1' },
  { label: '2', type: 'number', action: '2' },
  { label: '3', type: 'number', action: '3' },
  { label: '+', type: 'operator', action: '+' },

  { label: '0', type: 'number', action: '0' },
  { label: '.', type: 'decimal', action: '.' },
  { label: '=', type: 'equals', action: '=', span: 2 },
];

export default function Calculator({ onCalculate, onToast }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setOperator('');
    setPrevValue('');
    setWaitingForOperand(false);
    setJustCalculated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (justCalculated) {
      handleClear();
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, justCalculated, handleClear]);

  const handleNumber = useCallback(
    (num: string) => {
      if (waitingForOperand || justCalculated) {
        setDisplay(num);
        setWaitingForOperand(false);
        setJustCalculated(false);
      } else {
        if (display === '0' && num !== '.') {
          setDisplay(num);
        } else {
          if (display.length < 15) {
            setDisplay(display + num);
          }
        }
      }
    },
    [display, waitingForOperand, justCalculated]
  );

  const handleDecimal = useCallback(() => {
    if (waitingForOperand || justCalculated) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setJustCalculated(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand, justCalculated]);

  const handleOperator = useCallback(
    (op: string) => {
      const current = parseFloat(display);

      if (op === '%') {
        const percentVal = current / 100;
        const resultStr = String(percentVal);
        setDisplay(resultStr);
        setExpression(display + '%');
        setJustCalculated(true);
        return;
      }

      if (prevValue !== '' && !waitingForOperand) {
        const prev = parseFloat(prevValue);
        let result: number;
        switch (operator) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '*':
            result = prev * current;
            break;
          case '/':
            result = current !== 0 ? prev / current : NaN;
            break;
          default:
            result = current;
        }
        const resultStr = formatResult(result);
        setDisplay(resultStr);
        setPrevValue(resultStr);
        setExpression(resultStr + ' ' + getOpSymbol(op));
      } else {
        setPrevValue(display);
        setExpression(display + ' ' + getOpSymbol(op));
      }

      setOperator(op);
      setWaitingForOperand(true);
      setJustCalculated(false);
    },
    [display, prevValue, operator, waitingForOperand]
  );

  const handleEquals = useCallback(() => {
    if (!operator || !prevValue) return;

    const prev = parseFloat(prevValue);
    const current = parseFloat(display);
    let result: number;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = current !== 0 ? prev / current : NaN;
        break;
      default:
        return;
    }

    const fullExpression = `${prevValue} ${getOpSymbol(operator)} ${display}`;
    const resultStr = isNaN(result) ? 'Error' : formatResult(result);

    setDisplay(resultStr);
    setExpression(fullExpression + ' =');
    setPrevValue('');
    setOperator('');
    setWaitingForOperand(false);
    setJustCalculated(true);

    if (!isNaN(result)) {
      onCalculate(fullExpression, resultStr);
    }
  }, [display, prevValue, operator, onCalculate]);

  const handleButton = useCallback(
    (action: string) => {
      switch (action) {
        case 'clear':
          handleClear();
          break;
        case 'backspace':
          handleBackspace();
          break;
        case '.':
          handleDecimal();
          break;
        case '=':
          handleEquals();
          break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
          handleOperator(action);
          break;
        default:
          handleNumber(action);
      }
    },
    [handleClear, handleBackspace, handleDecimal, handleEquals, handleOperator, handleNumber]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleButton(e.key);
      else if (e.key === '+') handleButton('+');
      else if (e.key === '-') handleButton('-');
      else if (e.key === '*') handleButton('*');
      else if (e.key === '/') { e.preventDefault(); handleButton('/'); }
      else if (e.key === '%') handleButton('%');
      else if (e.key === 'Enter' || e.key === '=') handleButton('=');
      else if (e.key === 'Backspace') handleButton('backspace');
      else if (e.key === 'Escape') handleButton('clear');
      else if (e.key === '.') handleButton('.');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton]);

  return (
    <div>
      <Display value={display} expression={expression} />
      <div className="buttons-grid">
        {BUTTONS.map((btn, i) => (
          <CalculatorButton
            key={i}
            label={btn.label}
            type={btn.type}
            span={btn.span}
            onClick={() => handleButton(btn.action)}
          />
        ))}
      </div>
    </div>
  );
}

function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return 'Error';
  const str = String(num);
  if (str.length > 12) {
    return parseFloat(num.toPrecision(10)).toString();
  }
  return str;
}

function getOpSymbol(op: string): string {
  switch (op) {
    case '+': return '+';
    case '-': return '−';
    case '*': return '×';
    case '/': return '÷';
    default: return op;
  }
}
