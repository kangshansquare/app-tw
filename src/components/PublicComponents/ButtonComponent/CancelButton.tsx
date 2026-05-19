'use client';

interface CancelButtonProps {
    onClose: () => void
}

export default function CancelButton({ onClose }: CancelButtonProps) {
    return (
        <button className="border border-gray-200 p-2 px-4 rounded-md hover:bg-gray-200" onClick={onClose}>
            取消
        </button>
    )
}