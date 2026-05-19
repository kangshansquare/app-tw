'use client';
import type React from 'react';

export type FromProps<T = any> = React.FormHTMLAttributes<HTMLFormElement> & {
    className?: string;
    footer?: React.ReactNode;
    loading?: boolean;
    initalValues?: T
}

export default function FormComponent<T = any>({
    className= '',
    children,
    footer,
    loading = false,
    ...props
}: React.PropsWithChildren<FromProps<T>>) {
    return (
        <form className={`${className}`.trim()} {...props}>
            <div className='flex flex-col gap-5'>{children}</div>
            { footer && <div className='mt-4 flex justify-end'>{children}</div> }
            { loading && <div className='mt-2 text-sm text-gray-500'>提交中...</div> }
        </form>
    )
}