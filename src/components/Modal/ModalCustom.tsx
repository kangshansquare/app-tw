'use client';

import { useEffect, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ModalCustomProps {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    widthClass?: string;
    title: string;
    positionClass?: string;
}

export default function ModalCustom({ 
    show, 
    onClose, 
    children, 
    widthClass = 'max-w-2xl', 
    title, 
    positionClass 
}: ModalCustomProps) {

    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if(!mounted) return;

        if (show) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [show, mounted]);

    if (!mounted) return null;
    return (
        ReactDOM.createPortal(
            <div 
                className={`
                    fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm transition-opacity duration-300
                    ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                // onClick={onClose}
            >
                <div 
                    className={`w-full h-full ${positionClass ? positionClass : 'flex items-center justify-center'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div 
                        className={`
                            bg-white shadow-2xl relative flex flex-col
                            ${widthClass} 
                            ${!positionClass ? 'rounded-lg max-h-[85vh]' : 'h-full'}
                            
                            // 动画核心
                            transition-all duration-300 ease-out transform
                            ${show 
                                ? 'opacity-100 scale-100 translate-x-0' 
                                : 'opacity-0 scale-95 translate-x-full' // 默认假设是侧边栏，如果是居中，translate-x 不影响
                            }
                        `}
                    >
                        <div className="p-5 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-lg font-bold">{title}</h3>
                            <button onClick={onClose}><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                        <div className="p-5 overflow-y-auto">{children}</div>
                    </div>
                </div>
            </div>,
            document.body
        )
    )
}