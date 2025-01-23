import { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FloatingLabelInputProps {
  id: string;
  type: string;
  label: string;
  register: UseFormRegister<any>;
  error?: string;
  icon: React.ReactNode;
}

export default function FloatingLabelInput({
  id,
  type,
  label,
  register,
  error,
  icon
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 peer-focus:text-blue-500">
            {icon}
          </div>
        )}
        <input
          {...register(id)}
          type={type}
          id={id}
          className="peer w-full px-10 py-3 bg-white/5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-transparent"
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => setIsFocused(e.target.value !== '')}
        />
        <label
          htmlFor={id}
          className={`absolute left-10 transition-all duration-200 ${
            isFocused
              ? '-top-2 text-xs bg-white px-2 text-blue-500'
              : 'top-1/2 -translate-y-1/2 text-gray-500'
          } peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}