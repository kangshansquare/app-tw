'use client';

interface OperatorButtonProps {
    text: string;
}

export default function OperatorButton({text}: OperatorButtonProps) {
    return (
        <button className="p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500" >
            {text}
        </button>
    )
}