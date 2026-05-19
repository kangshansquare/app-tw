// 'use client';

// interface InputComponentProps {
//     value: string | number;
//     placeholder: string
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//     name: string
// }

// export default function InputComponent({ placeholder,name, value, onChange }: InputComponentProps) {
//     return (
//         <input 
//             className="p-2 h-10 outline-none border border-gray-200 rounded-md placeholder:text-sm placeholder:text-gray-500"
//             name={name}
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder}
//         />
//     )
// }

'use client';
import React from 'react';

export type InputProps<T extends HTMLInputElement = HTMLInputElement> = React.ComponentPropsWithoutRef<'input'> & {
    clasName?: string;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', ...props }, ref) => {
        const baseClass = 'outline-none border border-gray-300 p-2 rounded-lg focus:border-blue-500 h-10';

        return (
            <input 
                ref={ref}
                className={`${baseClass} ${className}`.trim()}
                {...props}
            />
        )
    }
)

InputComponent.displayName = 'InputComponent'
export default InputComponent;