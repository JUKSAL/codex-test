import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const BUTTON_LAYOUT = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

const OPERATORS = ['÷', '×', '−', '+'];

const isOperator = (value) => OPERATORS.includes(value);

export default function App() {
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

      const numericValue = Number(current);
      if (Number.isNaN(numericValue)) {
        return current;
      }

      const result = numericValue / 100;
      return String(result);
    });
  };

  const handleButtonPress = (value) => {
    switch (value) {
      case 'C':
        handleClear();
        break;
      case '±':
        handleToggleSign();
        break;
      case '%':
        handlePercent();
        break;
      case '=':
        handleEqualsPress();
        break;
      default:
        if (isOperator(value)) {
          handleOperatorPress(value);
        } else {
          handleNumberPress(value);
        }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.displayContainer}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.displayText}>
            {formattedDisplay}
          </Text>
          {pendingOperator && (
            <Text style={styles.operatorIndicator}>{pendingOperator}</Text>
          )}
        </View>
        <View style={styles.buttonGrid}>
          {BUTTON_LAYOUT.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.buttonRow}>
              {row.map((value) => {
                const isZero = value === '0';
                const buttonStyles = [
                  styles.button,
                  isOperator(value) && styles.operatorButton,
                  value === 'C' && styles.accentButton,
                  value === '=' && styles.equalsButton,
                  isZero && styles.wideButton,
                ];
                const textStyles = [
                  styles.buttonText,
                  (isOperator(value) || value === '=') && styles.buttonTextOperator,
                ];

                return (
                  <Pressable
                    key={value}
                    style={({ pressed }) => [
                      ...buttonStyles,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={() => handleButtonPress(value)}
                    android_ripple={{ color: '#ffffff20' }}
                  >
                    <Text style={textStyles}>{value}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  displayContainer: {
    minHeight: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  displayText: {
    fontSize: 64,
    color: '#f5f5f5',
    fontWeight: '200',
  },
  operatorIndicator: {
    fontSize: 24,
    color: '#f09a36',
    marginTop: 8,
    fontWeight: '600',
  },
  buttonGrid: {
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 24,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  operatorButton: {
    backgroundColor: '#f09a36',
  },
  equalsButton: {
    backgroundColor: '#f57f17',
  },
  accentButton: {
    backgroundColor: '#a6a6a6',
  },
  wideButton: {
    flex: 2,
    alignItems: 'flex-start',
    paddingLeft: 32,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#f5f5f5',
    fontSize: 28,
    fontWeight: '500',
  },
  buttonTextOperator: {
    color: '#fff',
  },
});
