import { useEffect, useRef } from 'react';
import { IMask } from 'react-imask';

export function useInputMask(value: string, options: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<IMask.InputMask<any>>();

  useEffect(() => {
    if (inputRef.current && !maskRef.current) {
      maskRef.current = IMask(inputRef.current, options);
    }

    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
      }
    };
  }, [options]);

  useEffect(() => {
    if (maskRef.current && value !== maskRef.current.value) {
      maskRef.current.value = value;
    }
  }, [value]);

  return inputRef;
}