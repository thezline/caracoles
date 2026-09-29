import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = ({
  label,
  error,
  hint,
  id,
  ...inputProps
}: FormFieldProps) => (
  <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      {...inputProps}
    />
    {error && (
      <span className="form-field__error" id={`${id}-error`}>
        {error}
      </span>
    )}
    {!error && hint && (
      <span className="form-field__hint" id={`${id}-hint`}>
        {hint}
      </span>
    )}
  </div>
);
