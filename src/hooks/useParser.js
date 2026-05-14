import { useState, useCallback } from 'react';
import { parseRawInput } from '../utils/dataParser';
import { validateDataCount } from '../utils/validators';
import toast from 'react-hot-toast';

/**
 * Hook that wraps dataParser + validators for raw input mode.
 * Returns parsed data, invalid tokens, warnings, errors, and validity state.
 */
export function useParser() {
  const [parsedData, setParsedData] = useState([]);
  const [invalidTokens, setInvalidTokens] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(false);

  const parseInput = useCallback((text) => {
    const { values, invalidTokens: invalid } = parseRawInput(text);
    setParsedData(values);
    setInvalidTokens(invalid);

    const newWarnings = [];
    const newErrors = [];

    if (!text || text.trim().length === 0) {
      setWarnings([]);
      setErrors([]);
      setIsValid(false);
      return { values, invalidTokens: invalid, isValid: false };
    }

    if (invalid.length > 0) {
      newWarnings.push(`${invalid.length} token diabaikan karena tidak valid.`);
    }

    const validation = validateDataCount(values.length);
    if (!validation.valid) {
      newErrors.push(validation.error);
      setIsValid(false);
    } else {
      setIsValid(true);
      if (validation.warning) {
        newWarnings.push(validation.warning);
        toast(validation.warning, { icon: '⚠️' });
      }
    }

    setWarnings(newWarnings);
    setErrors(newErrors);

    return { values, invalidTokens: invalid, isValid: validation.valid };
  }, []);

  const reset = useCallback(() => {
    setParsedData([]);
    setInvalidTokens([]);
    setWarnings([]);
    setErrors([]);
    setIsValid(false);
  }, []);

  return {
    parsedData,
    invalidTokens,
    warnings,
    errors,
    isValid,
    parseInput,
    reset,
  };
}
