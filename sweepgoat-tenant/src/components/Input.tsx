import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-zinc-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Input */}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            px-4 py-3
            ${isPasswordField ? 'pr-12' : ''}
            bg-zinc-900
            border
            ${error ? 'border-red-500' : 'border-zinc-800'}
            text-white
            text-sm
            font-light
            rounded
            focus:outline-none
            focus:border-zinc-700
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
            min-h-[48px]
          `}
        />

        {/* Password Toggle Button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Eye className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-400 mt-2 font-light">{error}</p>
      )}
    </div>
  );
}