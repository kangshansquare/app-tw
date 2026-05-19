'use client';
import React from 'react';

export interface SelectOptions {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export type SelectProps<T extends HTMLSelectElement = HTMLSelectElement> = React.ComponentPropsWithoutRef<'select'> & {
    className?: string;
    options: SelectOptions[];
    placeholder?: string;
}

const SelectCompoent = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', options, placeholder, ...props }, ref) => {
        const baseClass = 'outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 text-gray-600 text-sm h-10';
        return (
            <select
                ref={ref}
                className={`${baseClass} ${className}`.trim()}
                {...props}
            >
                {
                    options.map(opt => (
                        <option
                            key={opt.value} value={opt.value} disabled={opt.disabled}
                        >
                            { opt.label }
                        </option>
                    ))
                }
            </select>
        )
    }
)

SelectCompoent.displayName = 'SelectCompoent';
export default SelectCompoent;