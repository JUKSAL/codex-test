'use client';

import { useMemo, useState } from 'react';

const BUTTON_LAYOUT = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

const OPERATORS = ['÷', '×', '−', '+'];

const isOperator = (value) => OPERATORS.includes(value);

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [awaitingNewValue, setAwaitingNewValue] = useState(false);

  const formattedDisplay = useMemo(() => {
    if (displayValue === 'Cannot divide by 0') {
      return displayValue;
    }

    const [integerPart, decimalPart] = displayValue.split('.');
    const numericInteger = Number(integerPart);

    if (Number.isNaN(numericInteger)) {
      return displayValue;
    }

    const formattedInteger = numericInteger.toLocaleString(undefined, {
      useGrouping: Math.abs(numericInteger) >= 1000,
    });

    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  }, [displayValue]);

  const handleClear = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setPendingOperator(null);
    setAwaitingNewValue(false);
  };

  const handleNumberPress = (value) => {
    setDisplayValue((current) => {
      if (current === 'Cannot divide by 0') {
        setAwaitingNewValue(false);
        setPreviousValue(null);
        setPendingOperator(null);
        return value === '.' ? '0.' : value;
      }

      if (awaitingNewValue) {
        setAwaitingNewValue(false);
        return value === '.' ? '0.' : value;
      }

      if (value === '.') {
        return current.includes('.') ? current : `${current}.`;
      }

      if (current === '0') {
        return value;
      }

      return `${current}${value}`;
    });
  };

  const computeResult = (currentValue) => {
    if (pendingOperator === null || previousValue === null) {
      return currentValue;
    }

    const left = Number(previousValue);
    const right = Number(currentValue);

    switch (pendingOperator) {
      case '+':
        return String(left + right);
      case '−':
        return String(left - right);
      case '×':
        return String(left * right);
      case '÷':
        if (right === 0) {
          return 'Cannot divide by 0';
        }
        return String(left / right);
      default:
        return currentValue;
    }
  };

  const handleOperatorPress = (operator) => {
    if (displayValue === 'Cannot divide by 0') {
      return;
    }

    if (awaitingNewValue) {
      setPendingOperator(operator);
      return;
    }

    if (pendingOperator && !awaitingNewValue) {
      const result = computeResult(displayValue);
      setDisplayValue(result);

      if (result === 'Cannot divide by 0') {
        setPreviousValue(null);
        setPendingOperator(null);
        setAwaitingNewValue(true);
        return;
      }

      setPreviousValue(result);
      setPendingOperator(operator);
      setAwaitingNewValue(true);
      return;
    }

    setPreviousValue(displayValue);
    setPendingOperator(operator);
    setAwaitingNewValue(true);
  };

  const handleEqualsPress = () => {
    if (pendingOperator === null || previousValue === null || displayValue === 'Cannot divide by 0') {
      return;
    }

    const result = computeResult(displayValue);
    setDisplayValue(result);

    if (result === 'Cannot divide by 0') {
      setPreviousValue(null);
      setPendingOperator(null);
      setAwaitingNewValue(true);
      return;
    }

    setPreviousValue(result);
    setPendingOperator(null);
    setAwaitingNewValue(true);
  };

  const handleToggleSign = () => {
    setDisplayValue((current) => {
      if (current === '0' || current === 'Cannot divide by 0') {
        return current;
      }

      return current.startsWith('-') ? current.slice(1) : `-${current}`;
    });
  };

  const handlePercent = () => {
    setDisplayValue((current) => {
      if (current === 'Cannot divide by 0') {
        return current;
      }

      const value = Number(current);
      return String(value / 100);
    });
  };

  const handleButtonPress = (value) => {
    if (value === 'C') {
      handleClear();
      return;
    }

    if (value === '±') {
      handleToggleSign();
      return;
    }

    if (value === '%') {
      handlePercent();
      return;
    }

    if (value === '=') {
      handleEqualsPress();
      return;
    }

    if (isOperator(value)) {
      handleOperatorPress(value);
      return;
    }

    handleNumberPress(value);
  };

  return (
    <div className="calculator">
      <div className="display">
        <span className="display-value" data-error={displayValue === 'Cannot divide by 0'}>
          {formattedDisplay}
        </span>
        {pendingOperator && displayValue !== 'Cannot divide by 0' && (
          <span className="operator-indicator" aria-live="polite">
            {pendingOperator}
          </span>
        )}
      </div>

      <div className="button-grid" role="group" aria-label="Calculator keypad">
        {BUTTON_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((value) => (
              <button
                key={value}
                type="button"
                className={`button ${value === '0' ? 'button-zero' : ''} ${
                  isOperator(value) ? 'button-operator' : ''
                } ${value === '=' ? 'button-equals' : ''}`}
                onClick={() => handleButtonPress(value)}
              >
                {value}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
