import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const areaId = id ?? rest.name;
    return (
      <div>
        {label && (
          <label htmlFor={areaId} className="label">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          className={`input resize-none ${error ? 'border-red-500' : ''} ${className}`}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
