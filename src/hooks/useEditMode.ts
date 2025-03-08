
import { useState, useCallback } from 'react';

export function useEditMode(initialEditMode = false) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  return {
    isEditMode,
    toggleEditMode
  };
}
