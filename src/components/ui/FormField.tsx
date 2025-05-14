import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "datetime-local" | "select";
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  options?: Option[];
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  inputClassName = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  options = [],
}) => (
  <div className={className}>
    <label htmlFor={id} className={labelClassName}>
      {label}
    </label>
    {type === "select" ? (
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
        required={required}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
        required={required}
        placeholder={placeholder}
      />
    )}
  </div>
);
