import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A custom hook that wraps useState and syncs the state with the browser's History API.
 * This allows the browser's Back and Forward buttons to navigate between React states.
 * 
 * @param initialValue The initial state value.
 * @param key A unique key for this state in the history.state object.
 * @returns [state, setHistoryState, goBack]
 */
export function useHistoryState<T>(initialValue: T, key: string): [T, (val: T) => void, () => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined' && window.history.state && window.history.state[key] !== undefined) {
      return window.history.state[key];
    }
    return initialValue;
  });

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state[key] !== undefined) {
        setState(event.state[key]);
      } else {
        setState(initialValue);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, initialValue]);

  const setHistoryState = useCallback(
    (newValue: T) => {
      setState(newValue);

      const currentState = window.history.state || {};
      const newState = { ...currentState, [key]: newValue };
      window.history.pushState(newState, '', '');
    },
    [key]
  );

  const goBack = useCallback(() => {
    // Navigate back in the browser history
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  return [state, setHistoryState, goBack];
}
